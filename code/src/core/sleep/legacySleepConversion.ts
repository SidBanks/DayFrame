import type { ActiveDayFrameAuthoredSetup } from "../../state/types.js";
import type { SleepFoundationAuthority } from "./sleepFoundationalOccupancy.js";
import type { PlanPublicationBatchV1 } from "../historicalPlan/historicalPlan.js";
import type { SleepRequirementIntentV1 } from "./sleepRequirement.js";
import { isSleepOwnerDate, validateSleepRequirement } from "./sleepRequirement.js";
import {
  addUserDayLabels,
  resolveUserDayContainingInstant,
  resolveUserDayWindowForLabel,
} from "../time/canonicalUserDay.js";
import { capacityFingerprint } from "../planning/capacityFingerprint.js";
import { createCurrentActive } from "../../state/activeV4.js";
import { conversionMappingFingerprint } from "./legacySleepConversionRecord.js";
import type { LegacySleepConversionV1 } from "./legacySleepConversionRecord.js";
export type ConversionSelection = {
  templateId: string;
  templateIncarnationId: string;
  recurrenceId: string;
  recurrenceIncarnationId: string;
};
export type ConversionRequest = {
  selection: ConversionSelection;
  cutover: SleepRequirementIntentV1["effectiveFrom"];
  intent?: SleepRequirementIntentV1;
};
export type ConversionContext = {
  setup: ActiveDayFrameAuthoredSetup;
  authority: SleepFoundationAuthority;
  history: PlanPublicationBatchV1[];
  historyReady: boolean;
  now: string;
};
export type ConversionReview = {
  status: "convertible" | "requiresReview" | "unsupported" | "protected" | "alreadyConverted";
  reasons: string[];
  fingerprint: string;
  request: ConversionRequest;
  source?: LegacySleepConversionV1["source"];
  proposed?: SleepRequirementIntentV1;
  conversion?: LegacySleepConversionV1;
};
const placeholder = "00000000-0000-4000-8000-000000000001";
export function discoverLegacySleep(setup: ActiveDayFrameAuthoredSetup) {
  return setup.blockTemplates
    .filter((t) => t.id === "default_sleep" || t.category === "sleep" || /\bsleep\b/i.test(t.title))
    .flatMap((t) =>
      setup.blockRecurrences
        .filter((r) => r.blockTemplateId === t.id)
        .map((r) => ({
          title: t.title,
          template: structuredClone(t),
          recurrence: structuredClone(r),
          selection: {
            templateId: t.id,
            templateIncarnationId: t.incarnationId,
            recurrenceId: r.id,
            recurrenceIncarnationId: r.incarnationId,
          },
        })),
    );
}
export function reviewLegacySleep(
  context: ConversionContext,
  request: ConversionRequest,
): ConversionReview {
  const { setup, authority, history } = context;
  const result: ConversionReview = {
    status: "requiresReview",
    reasons: [],
    request: structuredClone(request),
    fingerprint: capacityFingerprint({ setup, authority, history, request }),
  };
  const reject = (status: ConversionReview["status"], reason: string) => ({
    ...result,
    status,
    reasons: [reason],
  });
  try {
    createCurrentActive(setup);
  } catch {
    return reject("protected", "Authored setup is invalid.");
  }
  if (authority.status !== "complete" || !context.historyReady)
    return reject(
      "protected",
      "Planning or published history is unavailable. Retry when it is ready.",
    );
  const { selection: s } = request;
  const t = setup.blockTemplates.find(
    (t) => t.id === s.templateId && t.incarnationId === s.templateIncarnationId,
  );
  const r = setup.blockRecurrences.find(
    (r) =>
      r.id === s.recurrenceId &&
      r.incarnationId === s.recurrenceIncarnationId &&
      r.blockTemplateId === s.templateId,
  );
  if (!t || !r)
    return reject("requiresReview", "The selected schedule changed or no longer exists.");
  result.source = structuredClone({ template: t, recurrence: r });
  const converted = setup.legacySleepConversions?.find(
    (c) => c.source.recurrence.incarnationId === r.incarnationId,
  );
  if (converted)
    return { ...result, status: "alreadyConverted", conversion: structuredClone(converted) };
  if (setup.sleepRequirements?.length)
    return reject(
      "requiresReview",
      "Required Sleep already exists, including disabled or future setup. Conversion cannot merge it.",
    );
  if (!t.enabled || !["daily", "specificWeekdays"].includes(r.frequency))
    return reject(
      "unsupported",
      "Only enabled daily or specific-weekday schedules can be converted without changing their recurrence meaning.",
    );
  if (t.requiresWorkAnchor)
    return reject(
      "unsupported",
      "This schedule requires a Work anchor. Its conditional applicability cannot be represented as required Sleep weekdays in this conversion.",
    );
  if (
    t.requiresResource ||
    t.externalResources.length ||
    authority.composition.authority.relationships.some(
      (a) =>
        a.status === "active" &&
        !authority.composition.authority.relationships.some(
          (later) => later.id === a.id && later.revision > a.revision,
        ) &&
        [a.parent, a.child].some((e) => e.sourceId === t.id && e.incarnationId === t.incarnationId),
    )
  )
    return reject(
      "unsupported",
      "This schedule has resources or attached activities. Resolve those relationships before conversion.",
    );
  if (
    setup.blockRecurrences.some(
      (other) =>
        other.id !== r.id &&
        other.blockTemplateId === t.id &&
        (!other.endsOnDate || other.endsOnDate >= request.cutover),
    )
  )
    return reject(
      "requiresReview",
      "This schedule has multiple future recurrences. Resolve them separately before conversion.",
    );
  let today: string;
  try {
    today = resolveUserDayContainingInstant({
      shiftCycles: setup.shiftCycles,
      defaultSchedulingPreferences: setup.schedulingPreferences,
      instant: new Date(context.now),
    }).userDayDate;
  } catch {
    return reject("protected", "Current user day is unavailable.");
  }
  if (
    !isSleepOwnerDate(request.cutover) ||
    request.cutover <= today ||
    (r.startsOnDate && request.cutover <= r.startsOnDate) ||
    (r.endsOnDate && request.cutover > r.endsOnDate)
  )
    return reject(
      "requiresReview",
      "Choose a future user day within the existing recurrence, after its start date.",
    );
  const cutoverStart = resolveUserDayWindowForLabel({
    shiftCycles: setup.shiftCycles,
    defaultSchedulingPreferences: setup.schedulingPreferences,
    userDayDate: request.cutover,
  }).start.toISOString();
  const matches = (ref: { sourceKind: string } & Record<string, unknown>) => {
    if (ref.sourceKind !== "template") return false;
    const template = ref.template as { id: string; incarnationId: string },
      recurrence = ref.recurrence as { id: string; incarnationId: string };
    return (
      template.id === t.id &&
      template.incarnationId === t.incarnationId &&
      recurrence.id === r.id &&
      recurrence.incarnationId === r.incarnationId
    );
  };
  if (
    authority.planDecisions.some(
      (d) =>
        matches(d.target) &&
        (d.target.sourceKind !== "template" ||
          d.target.coordinate.scopeKind !== "userDay" ||
          d.target.coordinate.userDayDate >= request.cutover ||
          (d.kind === "placeOccurrence" && d.payload.userDayDate >= request.cutover)),
    )
  )
    return reject(
      "requiresReview",
      "Future accepted changes exist for this schedule. Resolve them or choose a later cutover.",
    );
  if (
    history.some((b) =>
      b.days.some((day) =>
        day.occurrences.some(
          (o) =>
            matches(o.reference) &&
            (day.userDayDate >= request.cutover ||
              (o.plan.state === "scheduled" && "endsAt" in o.plan && o.plan.endsAt > cutoverStart)),
        ),
      ),
    )
  )
    return reject(
      "requiresReview",
      "This schedule is already published on or after that date. Choose a cutover after its published days; past publications stay unchanged.",
    );
  if (
    authority.realizedFacts.some(
      (f) =>
        (f.userDayDate >= request.cutover || f.endsAt > cutoverStart) &&
        f.lineage.source.kind === "compositionRelationship" &&
        [f.lineage.source.parent, f.lineage.source.child].some(
          (e) => e.sourceId === t.id && e.incarnationId === t.incarnationId,
        ),
    )
  )
    return reject(
      "requiresReview",
      "A realized activity uses this schedule after the cutover. Choose a later date.",
    );
  const weekdays = r.frequency === "daily" ? ("all" as const) : r.weekdays;
  if (!weekdays?.length) return reject("unsupported", "Specific weekdays are missing.");
  const proposed =
    request.intent ??
    (t.preferredWindow === "custom" && t.customWindowStartTime && t.customWindowEndTime
      ? {
          enabled: true,
          effectiveFrom: request.cutover,
          ...(r.endsOnDate ? { effectiveUntilExclusive: addUserDayLabels(r.endsOnDate, 1) } : {}),
          weekdays,
          durationMinutes: t.durationMinutes,
          bufferBeforeMinutes: t.bufferBeforeMinutes ?? 0,
          bufferAfterMinutes: t.bufferAfterMinutes ?? 0,
          window: {
            kind: "clock" as const,
            startClock: t.customWindowStartTime,
            endClock: t.customWindowEndTime,
            ...(t.fixedStartTime ? { preferredStartClock: t.fixedStartTime } : {}),
          },
        }
      : undefined);
  if (!proposed)
    return reject(
      "requiresReview",
      "Supply a required legal window. Work-relative Sleep also needs a span and an off-day window. No window is inferred from a preferred start.",
    );
  try {
    validateSleepRequirement({
      ...proposed,
      version: 1,
      id: "validation",
      incarnationId: placeholder,
      revision: 1,
      createdAt: context.now,
      updatedAt: context.now,
    });
    if (
      !proposed.enabled ||
      proposed.effectiveFrom !== request.cutover ||
      proposed.durationMinutes !== t.durationMinutes ||
      proposed.bufferBeforeMinutes !== (t.bufferBeforeMinutes ?? 0) ||
      proposed.bufferAfterMinutes !== (t.bufferAfterMinutes ?? 0) ||
      capacityFingerprint(proposed.weekdays) !== capacityFingerprint(weekdays) ||
      proposed.effectiveUntilExclusive !==
        (r.endsOnDate ? addUserDayLabels(r.endsOnDate, 1) : undefined)
    )
      throw new Error();
    if (
      ["beforeWork", "afterWork"].includes(t.preferredWindow) &&
      proposed.window.kind !== t.preferredWindow
    )
      throw new Error();
  } catch {
    return reject(
      "requiresReview",
      "Required Sleep must preserve this schedule’s duration, buffers, weekdays and end date, and use a valid explicit window.",
    );
  }
  return { ...result, status: "convertible", proposed: structuredClone(proposed) };
}
export type ConfirmConversionInput = {
  request: ConversionRequest;
  expectedFingerprint: string;
  commandId: string;
  confirmed: true;
};
export function stageLegacySleepConversion(
  context: ConversionContext,
  input: ConfirmConversionInput,
  allocate: () => string,
) {
  createCurrentActive(context.setup);
  const requestFingerprint = capacityFingerprint(input.request);
  const old = context.setup.legacySleepConversions?.find((c) => c.commandId === input.commandId);
  if (old) {
    if (
      old.requestFingerprint !== requestFingerprint ||
      input.confirmed !== true ||
      old.reviewFingerprint !== input.expectedFingerprint
    )
      throw new RangeError("Idempotence mismatch.");
    return {
      status: "alreadyConverted" as const,
      conversion: structuredClone(old),
      setup: context.setup,
    };
  }
  const review = reviewLegacySleep(context, input.request);
  if (
    input.confirmed !== true ||
    review.status !== "convertible" ||
    review.fingerprint !== input.expectedFingerprint ||
    !review.source ||
    !review.proposed
  )
    throw new RangeError(review.reasons[0] ?? "Review changed. Review again before confirming.");
  const requirement = validateSleepRequirement({
    ...review.proposed,
    version: 1,
    id: allocate(),
    incarnationId: allocate(),
    revision: 1,
    createdAt: context.now,
    updatedAt: context.now,
  });
  const evidence = {
    version: 1 as const,
    id: allocate(),
    commandId: input.commandId,
    request: structuredClone(input.request),
    requestFingerprint,
    reviewFingerprint: review.fingerprint,
    source: review.source,
    requirement,
    cutover: input.request.cutover,
    convertedAt: context.now,
    explicitConfirmation: true as const,
  };
  const conversion: LegacySleepConversionV1 = {
    ...evidence,
    mappingFingerprint: conversionMappingFingerprint(evidence),
    requirementDeleted: false,
  };
  const setup = {
    ...context.setup,
    sleepRequirements: [requirement],
    blockRecurrences: context.setup.blockRecurrences.map((r) =>
      r.incarnationId === review.source!.recurrence.incarnationId
        ? { ...r, endsOnDate: addUserDayLabels(input.request.cutover, -1) }
        : r,
    ),
    legacySleepConversions: [...(context.setup.legacySleepConversions ?? []), conversion],
  };
  createCurrentActive(setup);
  return { status: "converted" as const, conversion, setup };
}
