import { hasCurrentAcceptanceReceipt } from "../state/acceptanceLifecycle.js";
import { useEffect, useId, useRef, useState } from "react";
import type { GoalV1 } from "../core/goals/goal.js";
import type {
  GoalDemandIntentV1,
  GoalPriorityLevel,
  GoalPriorityV1,
} from "../core/planning/goalDemand.js";
import type {
  DemandFootprintComponentV1,
  DemandResourceFootprintAssociationV1,
} from "../core/planning/demandResourceFootprint.js";
import type { DayFrameState, DayFrameStore } from "../state/types.js";
import { createGoalEditingContext, type GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import {
  evaluatePlanningRequest,
  type PlanningRequestResult,
} from "../state/constructivePlanningWorkflow.js";
import {
  durationLabel,
  feasibilityLabels,
  feasibilityReasons,
  noProposalReasons,
} from "./planningResultCopy.js";

export type GoalPlanningStore = Pick<
  DayFrameStore,
  | "getGoalStructureQualification"
  | "getGoal"
  | "listCurrentGoalDemands"
  | "exportGoalPlanningAuthority"
  | "subscribeGoalStructure"
  | "subscribeGoalPlanning"
  | "getGoalPlanningDurabilityStatus"
  | "retryGoalPlanningPersistence"
  | "getGoalPlanningIngressStatus"
  | "createDemand"
  | "reviseDemand"
  | "createPriority"
  | "revisePriority"
  | "createDemandResourceFootprintSpec"
  | "setDemandResourceFootprintAssociation"
  | "resolveDemandResourceFootprintAssociation"
  | "evaluateCompetingAllocation"
  | "deriveProposal"
  | "recordProposal"
>;
type Form = {
  start: string;
  end: string;
  effort: number;
  split: boolean;
  minimum: number;
  maximum: number | undefined;
  preferred: number | undefined;
  satisfaction: "minimum" | "target" | "optional";
  partial: boolean;
  minimumTotal: number;
  cadence: "total" | "sessionCount";
  count: number;
  priority: GoalPriorityLevel;
  footprint: "" | "preserve" | "productiveOnly" | "resources";
  support: number;
  buffer: number;
};
function initialForm(
  store: GoalPlanningStore,
  goal: GoalV1,
  state: DayFrameState,
  demand?: GoalDemandIntentV1,
): Form {
  const footprint = demand ? store.resolveDemandResourceFootprintAssociation(demand.id) : undefined;
  const priority = store
    .exportGoalPlanningAuthority()
    .priorities.filter((p) => p.goalId === goal.id && p.scope.kind === "default")
    .sort((a, b) => b.revision - a.revision)[0];
  return {
    start: demand?.horizon.startUserDayDate ?? state.previewRange.startDate,
    end: demand
      ? addUserDayLabels(demand.horizon.endUserDayDateExclusive, -1)
      : state.previewRange.endDate,
    effort: demand?.requestedEffort.amount ?? 60,
    split: demand?.session.mode === "splittable",
    minimum: demand?.session.mode === "splittable" ? demand.session.minimumMinutes : 30,
    maximum: demand?.session.mode === "splittable" ? demand.session.maximumMinutes : undefined,
    preferred: demand?.session.mode === "splittable" ? demand.session.preferredMinutes : undefined,
    satisfaction: demand?.satisfaction.kind ?? "target",
    partial: demand?.satisfaction.allowPartial ?? false,
    minimumTotal: demand?.satisfaction.allowPartial
      ? demand.satisfaction.minimumSatisfiedMinutes
      : 30,
    cadence: demand?.cadence.kind ?? "total",
    count: demand?.cadence.kind === "sessionCount" ? demand.cadence.count : 1,
    priority: priority?.status === "active" ? priority.level : "normal",
    footprint: footprint?.status === "resolved" ? "preserve" : "",
    support:
      footprint?.status === "resolved"
        ? footprint.components
            .filter((c) => c.role === "supportActivity")
            .reduce((sum, c) => sum + c.durationMinutes, 0)
        : 0,
    buffer:
      footprint?.status === "resolved"
        ? footprint.components
            .filter((c) => c.role === "bufferProtection")
            .reduce((sum, c) => sum + c.durationMinutes, 0)
        : 0,
  };
}
type PlanningProps = {
  goal: GoalV1;
  state: DayFrameState;
  store: GoalPlanningStore;
  onOpenReview: () => void;
  now: () => Date;
  context?: GoalEditingContext;
};
type RequestDraft = {
  demand: GoalDemandIntentV1 | undefined;
  priority: GoalPriorityV1 | undefined;
  association: DemandResourceFootprintAssociationV1 | undefined;
  form: Form;
  fields: Array<keyof Form>;
  busy: boolean;
  message: string;
  failed: boolean;
  advanced: boolean;
  resourceOpen: boolean;
  needsAssociation: boolean;
  pendingSelection: DemandResourceFootprintAssociationV1["selection"] | undefined;
  pendingResourceKey: string | undefined;
};
const demandFields: Array<keyof Form> = [
  "start",
  "end",
  "effort",
  "split",
  "minimum",
  "preferred",
  "maximum",
  "satisfaction",
  "partial",
  "minimumTotal",
  "cadence",
  "count",
];
const resourceFields: Array<keyof Form> = ["footprint", "support", "buffer"];
function priorityFor(store: GoalPlanningStore, goal: GoalV1) {
  return store
    .exportGoalPlanningAuthority()
    .priorities.filter((p) => p.goalId === goal.id && p.scope.kind === "default")
    .sort((a, b) => b.revision - a.revision)[0];
}
function associationFor(store: GoalPlanningStore, demand?: GoalDemandIntentV1) {
  return store
    .exportGoalPlanningAuthority()
    .footprintAssociations.filter((a) => a.demandId === demand?.id)
    .sort((a, b) => b.revision - a.revision)[0];
}
function requestDraft(props: PlanningProps, demand?: GoalDemandIntentV1): RequestDraft {
  return {
    demand,
    priority: priorityFor(props.store, props.goal),
    association: associationFor(props.store, demand),
    form: initialForm(props.store, props.goal, props.state, demand),
    fields: demand ? [] : ["priority"],
    busy: false,
    message: "",
    failed: false,
    advanced: false,
    resourceOpen: false,
    needsAssociation: !demand,
    pendingSelection: undefined,
    pendingResourceKey: undefined,
  };
}
export function GoalPlanningSection(props: PlanningProps) {
  const [local] = useState(createGoalEditingContext);
  const context = props.context ?? local;
  const [view, updateView, getView] = useGoalEditingState(
    context,
    `requests:${props.goal.id}`,
    () => ({
      selected: props.store
        .listCurrentGoalDemands(props.goal.id)
        .find((d) => d.lifecycle === "active")?.id as string | undefined,
    }),
  );
  const [, refresh] = useState(0);
  useEffect(() => {
    const stop = props.store.subscribeGoalPlanning(() => refresh((n) => n + 1));
    return () => {
      stop();
    };
  }, [props.store]);
  const demands = props.store.listCurrentGoalDemands(props.goal.id);
  const key = `request:${props.goal.id}:${view.selected ?? "new"}`;
  return (
    <section className="df-panel df-goal-planning" aria-label="Goal planning">
      <h3>Requested Time</h3>
      {props.store.getGoalStructureQualification().status === "protected" && (
        <p role="status">
          Structure records and history are preserved, but their recorded times cannot safely
          support planning. Planning and Structure changes are blocked. You can still export a
          complete backup. No dates were repaired.
        </p>
      )}
      <p>
        Choose a finite period and how much time to request. This is separate from your Goal and
        measured Progress.
      </p>
      {demands.length ? (
        <label>
          Planning request
          <select
            value={view.selected ?? ""}
            onChange={(e) => updateView({ selected: e.target.value || undefined })}
          >
            <option value="">New planning request</option>
            {demands.map((d) => (
              <option key={d.id} value={d.id}>
                {d.horizon.startUserDayDate} –{" "}
                {addUserDayLabels(d.horizon.endUserDayDateExclusive, -1)} ·{" "}
                {durationLabel(d.requestedEffort.amount)} ·{" "}
                {d.lifecycle === "active" ? "Active" : "Inactive"}
              </option>
            ))}
            {view.selected && !demands.some((d) => d.id === view.selected) && (
              <option value={view.selected}>Unavailable request</option>
            )}
          </select>
        </label>
      ) : (
        <p>No planning effort has been saved for this Goal.</p>
      )}
      <RequestEditor
        {...props}
        key={key}
        context={context}
        draftKey={key}
        demandId={view.selected}
        onCreated={(id) => {
          context.move(key, `request:${props.goal.id}:${id}`);
          if (getView().selected === view.selected) updateView({ selected: id });
        }}
      />
    </section>
  );
}
function RequestEditor({
  context,
  draftKey,
  demandId,
  onCreated,
  ...props
}: PlanningProps & {
  context: GoalEditingContext;
  draftKey: string;
  demandId: string | undefined;
  onCreated: (id: string) => void;
}) {
  const { goal, state, store, onOpenReview, now } = props;
  const [draft, update, getDraft] = useGoalEditingState(context, draftKey, () =>
    requestDraft(
      props,
      store.listCurrentGoalDemands(goal.id).find((d) => d.id === demandId),
    ),
  );
  const { demand, form, busy, message } = draft;
  const dirty = draft.fields.length > 0;
  useEffect(() => {
    if (!draft.busy && draft.message) {
      if (draft.failed) document.getElementById(uid + "-feedback")?.focus();
      else saveRef.current?.focus();
    }
  }, [draft.busy, draft.message, draft.failed]);
  const uid = useId();
  const saveRef = useRef<HTMLButtonElement>(null);
  const evaluationVersion = useRef(0);
  const [result, setResult] = useState<PlanningRequestResult | null>(null);
  const [, refresh] = useState(0);
  useEffect(() => {
    const invalidate = () => {
      evaluationVersion.current++;
      setResult(null);
      refresh((n) => n + 1);
    };
    const a = store.subscribeGoalPlanning(invalidate),
      b = store.subscribeGoalStructure(invalidate);
    return () => {
      a();
      b();
      evaluationVersion.current++;
    };
  }, [store]);
  useEffect(() => {
    evaluationVersion.current++;
    setResult(null);
    return () => {
      evaluationVersion.current++;
    };
  }, [state, goal.revision]);
  function change<K extends keyof Form>(key: K, value: Form[K]) {
    update((d) => ({
      form: { ...d.form, [key]: value },
      fields: [...new Set([...d.fields, key])],
      message: "",
      failed: false,
    }));
    evaluationVersion.current++;
    setResult(null);
  }
  function reload() {
    if (getDraft().busy) return;
    update(
      requestDraft(
        props,
        store
          .listCurrentGoalDemands(goal.id)
          .find((d) => d.id === (getDraft().demand?.id ?? demandId)),
      ),
    );
    setResult(null);
    saveRef.current?.focus();
  }
  async function save() {
    if (getDraft().busy || !context.isValid()) return;
    update({ busy: true, message: "", failed: false });
    setResult(null);
    evaluationVersion.current++;
    let step = "Requested Time";
    const completed: string[] = [];
    const checkContext = () => {
      if (!context.isValid())
        throw new Error(
          "This editing session was replaced. Reopen Goals to review current saved data.",
        );
      const currentGoal = store.getGoal(goal.id);
      if (
        !currentGoal ||
        currentGoal.status !== "active" ||
        store.getGoalPlanningIngressStatus().status !== "accepted"
      )
        throw new Error(
          "This Goal or its planning data is unavailable. Your draft was kept; review current data before saving.",
        );
    };
    try {
      checkContext();
      let current = getDraft();
      const f = current.form;
      const changesResources =
        current.needsAssociation || current.fields.some((k) => resourceFields.includes(k));
      if (changesResources && !f.footprint)
        throw new Error("Choose whether this work needs support or protected time.");
      if (changesResources && f.footprint === "resources" && f.support <= 0 && f.buffer <= 0)
        throw new Error(
          "Enter support or protected time, or explicitly choose productive work only.",
        );
      const savedDemand = current.demand;
      if (
        savedDemand &&
        JSON.stringify(
          store.listCurrentGoalDemands(goal.id).find((d) => d.id === savedDemand.id),
        ) !== JSON.stringify(savedDemand)
      )
        throw new Error(
          "This request changed elsewhere. Your draft was kept. Review the saved request, then explicitly reload to edit its latest revision.",
        );
      if (!savedDemand || current.fields.some((k) => demandFields.includes(k))) {
        const input = {
          goalId: goal.id,
          requestedEffort: { unit: "minutes" as const, amount: f.effort },
          horizon: {
            kind: "userDayInterval" as const,
            startUserDayDate: f.start as GoalDemandIntentV1["horizon"]["startUserDayDate"],
            endUserDayDateExclusive: addUserDayLabels(
              f.end as GoalDemandIntentV1["horizon"]["startUserDayDate"],
              1,
            ),
          },
          session: f.split
            ? {
                mode: "splittable" as const,
                minimumMinutes: f.minimum,
                ...(f.preferred === undefined ? {} : { preferredMinutes: f.preferred }),
                ...(f.maximum === undefined ? {} : { maximumMinutes: f.maximum }),
              }
            : { mode: "indivisible" as const, exactMinutes: f.effort },
          satisfaction:
            f.satisfaction === "minimum"
              ? { kind: "minimum" as const, allowPartial: false as const }
              : f.partial
                ? {
                    kind: f.satisfaction,
                    allowPartial: true as const,
                    minimumSatisfiedMinutes: f.minimumTotal,
                  }
                : { kind: f.satisfaction, allowPartial: false as const },
          cadence:
            f.cadence === "total"
              ? { kind: "total" as const }
              : { kind: "sessionCount" as const, count: f.count },
        };
        const saved = savedDemand
          ? await store.reviseDemand(savedDemand.id, savedDemand.revision, input)
          : await store.createDemand(input);
        if (saved.status !== "accepted")
          throw new Error(
            saved.reason === "staleRevision"
              ? "The request changed. Reload deliberately before saving."
              : "Check dates, requested time, minimum/preferred/maximum sessions and session count. Preserved constraints may conflict; none were silently removed.",
          );
        update((d) => ({
          demand:
            store.listCurrentGoalDemands(goal.id).find((v) => v.id === saved.value.id) ??
            saved.value,
          fields: d.fields.filter((k) => !demandFields.includes(k)),
        }));
        completed.push("Requested Time accepted");
        // Keep the accepted identity even if a subsequent step rejects or persistence fails.
      }
      checkContext();
      current = getDraft();
      step = "Goal priority";
      if (current.fields.includes("priority") || !savedDemand) {
        const existing = priorityFor(store, goal);
        if (JSON.stringify(existing) !== JSON.stringify(current.priority))
          throw new Error(
            "Goal priority changed elsewhere. Your draft was kept; reload the saved values before changing it.",
          );
        const priority =
          existing?.status === "active"
            ? await store.revisePriority(existing.id, existing.revision, { level: f.priority })
            : await store.createPriority({
                goalId: goal.id,
                level: f.priority,
                scope: { kind: "default" },
              });
        if (priority.status !== "accepted")
          throw new Error(
            `Goal priority was rejected (${priority.reason}). Review or retry the remaining changes.`,
          );
        update((d) => ({
          priority: priority.value,
          fields: d.fields.filter((k) => k !== "priority"),
        }));
        completed.push("Goal priority accepted");
      }
      checkContext();
      current = getDraft();
      step = "session resources";
      if (changesResources) {
        const previous = associationFor(store, current.demand);
        if (JSON.stringify(previous) !== JSON.stringify(current.association))
          throw new Error(
            "Session resources changed elsewhere. Reload the saved values before replacing them.",
          );
        let selection: DemandResourceFootprintAssociationV1["selection"] = {
          kind: "productiveOnly",
        };
        if (f.footprint === "preserve") {
          if (!previous)
            throw new Error("The saved resource choice is unavailable. Reload before editing.");
          selection = previous.selection;
        }
        if (f.footprint === "resources") {
          const resourceKey = JSON.stringify([f.support, f.buffer]);
          if (current.pendingSelection && current.pendingResourceKey === resourceKey)
            selection = current.pendingSelection;
          else {
            const components: DemandFootprintComponentV1[] = [];
            if (f.support > 0)
              components.push({
                id: "follow-up",
                role: "supportActivity",
                scope: "perSession",
                requiredness: "required",
                durationMinutes: f.support,
                geometry: { kind: "startsAtProductiveEnd" },
                actor: "user",
                source: { kind: "direct" },
              });
            if (f.buffer > 0)
              components.push({
                id: "protected-after",
                role: "bufferProtection",
                scope: "perSession",
                requiredness: "required",
                durationMinutes: f.buffer,
                target:
                  f.support > 0
                    ? { kind: "supportComponent", componentId: "follow-up" }
                    : { kind: "productive" },
                side: "after",
                source: { kind: "direct" },
              });
            const spec = await store.createDemandResourceFootprintSpec({
              name: `${goal.title.slice(0, 150)} session resources`,
              variants: [{ id: "standard", name: "Authored session", components }],
            });
            if (spec.status !== "accepted")
              throw new Error(
                `Session resources were rejected (${spec.reason}). Check durations and retry.`,
              );
            selection = {
              kind: "specification",
              specificationId: spec.value.id,
              specificationRevision: spec.value.revision,
              variantId: "standard",
              selectedOptionalComponentIds: [],
            };
            update({ pendingSelection: selection, pendingResourceKey: resourceKey });
            completed.push("Resource specification accepted");
          }
        }
        checkContext();
        const associated = await store.setDemandResourceFootprintAssociation({
          demandId: getDraft().demand!.id,
          selection,
          ...(previous ? { expectedRevision: previous.revision } : {}),
        });
        if (associated.status !== "accepted")
          throw new Error(
            `Resource association was rejected (${associated.reason}). Retry uses the already accepted request and resource specification.`,
          );
        update((d) => ({
          association: associated.value,
          needsAssociation: false,
          form: { ...d.form, footprint: "preserve" },
          fields: d.fields.filter((k) => !resourceFields.includes(k)),
          pendingSelection: undefined,
          pendingResourceKey: undefined,
        }));
        completed.push("Resource association accepted");
      }
      checkContext();
      step = "local saving";
      if (
        store.getGoalPlanningDurabilityStatus() !== "durable" &&
        (await store.retryGoalPlanningPersistence()).status !== "durable"
      )
        throw new Error(
          "Changes are accepted for this session but could not be saved to storage. Retry Save to persist them without creating them again.",
        );
      update({
        message: "Requested Time saved. Your schedule and measured Progress have not changed.",
        failed: false,
      });
      if (!demandId && getDraft().demand) onCreated(getDraft().demand!.id);
      saveRef.current?.focus();
    } catch (error) {
      update({
        failed: true,
        message: `Could not finish saving ${step}. ${completed.length ? completed.join("; ") + ". " : ""}${error instanceof Error ? error.message : "Try again."} Earlier accepted changes remain; discarding a draft does not undo them.`,
      });
    } finally {
      update({ busy: false });
    }
  }
  async function evaluate() {
    if (!demand || dirty || getDraft().busy || !context.isValid()) return;
    update({ busy: true, message: "", failed: false });
    setResult(null);
    const version = ++evaluationVersion.current;
    try {
      const evaluated = await evaluatePlanningRequest(store, {
        demandId: demand.id,
        ...demand.horizon,
        evaluationCutoff: now().toISOString(),
      });
      if (version === evaluationVersion.current && context.isValid()) setResult(evaluated);
    } catch {
      if (version === evaluationVersion.current)
        update({
          message:
            "Planning could not be evaluated. Check storage and schedule readiness, then retry. No acceptance was made.",
          failed: true,
        });
    } finally {
      update({ busy: false });
    }
  }
  const currentDemand = demand
    ? store.listCurrentGoalDemands(goal.id).find((d) => d.id === demand.id)
    : undefined;
  const ready =
    store.getGoalPlanningIngressStatus().status === "accepted" &&
    context.isValid() &&
    (!demandId || !!currentDemand);
  const savedFootprint = demand
    ? store.resolveDemandResourceFootprintAssociation(demand.id)
    : undefined;
  return (
    <div>
      {!ready && (
        <p role="alert">
          Requested Time is unavailable. Your draft is retained but cannot be saved into unavailable
          authority.
        </p>
      )}
      {message && (
        <p id={uid + "-feedback"} tabIndex={-1} role={draft.failed ? "alert" : "status"}>
          {message}
        </p>
      )}
      <form
        onInvalid={(e) => {
          const details = (e.target as HTMLElement).closest("details");
          if (details) {
            details.open = true;
            update(
              details.querySelector("select[required]")
                ? { resourceOpen: true }
                : { advanced: true },
            );
          }
        }}
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <fieldset
          aria-describedby={message ? uid + "-feedback" : undefined}
          disabled={busy || !ready || goal.status !== "active"}
          className="df-form-stack"
        >
          <legend>Requested Time</legend>
          <label>
            Plan from
            <input
              type="date"
              required
              value={form.start}
              onChange={(e) => change("start", e.target.value)}
            />
          </label>
          <label>
            Plan through
            <input
              type="date"
              required
              min={form.start}
              value={form.end}
              onChange={(e) => change("end", e.target.value)}
            />
          </label>
          <DurationInput
            label="Requested Time"
            value={form.effort}
            onChange={(v) => change("effort", v)}
          />
          <details
            open={draft.advanced}
            onToggle={(e) => {
              if (e.currentTarget.open !== getDraft().advanced)
                update({ advanced: e.currentTarget.open });
            }}
          >
            <summary>Session details and constraints</summary>
            <label>
              Session arrangement
              <select
                value={form.split ? "split" : "one"}
                onChange={(e) => change("split", e.target.value === "split")}
              >
                <option value="one">One uninterrupted session</option>
                <option value="split">Split across sessions</option>
              </select>
            </label>
            {form.split ? (
              <>
                <DurationInput
                  label="Minimum session"
                  value={form.minimum}
                  onChange={(v) => change("minimum", v)}
                />
                <label className="df-goal-check">
                  <input
                    type="checkbox"
                    checked={form.preferred !== undefined}
                    onChange={(e) =>
                      change("preferred", e.target.checked ? form.minimum : undefined)
                    }
                  />
                  Set preferred session duration
                </label>
                {form.preferred !== undefined && (
                  <DurationInput
                    label="Preferred session"
                    value={form.preferred}
                    onChange={(v) => change("preferred", v)}
                  />
                )}
                <label className="df-goal-check">
                  <input
                    type="checkbox"
                    checked={form.maximum !== undefined}
                    onChange={(e) => change("maximum", e.target.checked ? form.effort : undefined)}
                  />
                  Set maximum session duration
                </label>
                {form.maximum !== undefined && (
                  <DurationInput
                    label="Maximum session"
                    value={form.maximum}
                    onChange={(v) => change("maximum", v)}
                  />
                )}
                <p>
                  Unchecked optional durations are not authored limits. Existing values are
                  preserved until you explicitly change or clear them.
                </p>
              </>
            ) : null}
            <label>
              Effort requirement
              <select
                value={form.satisfaction}
                onChange={(e) => change("satisfaction", e.target.value as Form["satisfaction"])}
              >
                <option value="target">Target</option>
                <option value="minimum">Required minimum</option>
                <option value="optional">Optional effort</option>
              </select>
            </label>
            {form.satisfaction !== "minimum" ? (
              <label>
                <input
                  type="checkbox"
                  checked={form.partial}
                  onChange={(e) => change("partial", e.target.checked)}
                />
                Allow less than the requested effort
              </label>
            ) : null}
            {form.partial && form.satisfaction !== "minimum" ? (
              <DurationInput
                label="Minimum acceptable effort"
                value={form.minimumTotal}
                onChange={(v) => change("minimumTotal", v)}
              />
            ) : null}
            <label>
              Session count requirement
              <select
                value={form.cadence}
                onChange={(e) => change("cadence", e.target.value as Form["cadence"])}
              >
                <option value="total">Total effort only</option>
                <option value="sessionCount">Exact number of sessions</option>
              </select>
            </label>
            {form.cadence === "sessionCount" ? (
              <label>
                Number of sessions
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form.count}
                  onChange={(e) => change("count", Number(e.target.value))}
                />
              </label>
            ) : null}
          </details>
          <label>
            Goal planning priority
            <select
              value={form.priority}
              onChange={(e) => change("priority", e.target.value as GoalPriorityLevel)}
            >
              {(["low", "normal", "high", "critical"] as const).map((p) => (
                <option key={p} value={p}>
                  {p[0]!.toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <p>
            This sets the Goal's default planning priority. Existing period-specific priorities
            still apply in their periods.
          </p>
          <details
            open={draft.resourceOpen}
            onToggle={(e) => {
              if (e.currentTarget.open !== getDraft().resourceOpen)
                update({ resourceOpen: e.currentTarget.open });
            }}
          >
            <summary>Support and protected time</summary>
            <label>
              Session resources
              <select
                required={
                  draft.needsAssociation || draft.fields.some((k) => resourceFields.includes(k))
                }
                value={form.footprint}
                onChange={(e) => change("footprint", e.target.value as Form["footprint"])}
              >
                <option value="">Choose explicitly</option>
                {demand &&
                store.resolveDemandResourceFootprintAssociation(demand.id).status === "resolved" ? (
                  <option value="preserve">Keep saved choice</option>
                ) : null}
                <option value="productiveOnly">Productive work only</option>
                <option value="resources">Support/protected time</option>
              </select>
            </label>
            {form.footprint === "preserve" && savedFootprint?.status === "resolved" ? (
              <p>
                Saved choice:{" "}
                {savedFootprint.selection.kind === "productiveOnly"
                  ? "productive work only, with no support or protected time"
                  : savedFootprint.components
                      .map(
                        (component) =>
                          `${component.role === "supportActivity" ? "Support activity" : "Protected Buffer"}: ${durationLabel(component.durationMinutes)} per session`,
                      )
                      .join("; ")}
                .
              </p>
            ) : null}
            {form.footprint === "resources" ? (
              <>
                <DurationInput
                  label="Follow-up activity after each session"
                  value={form.support}
                  onChange={(v) => change("support", v)}
                />
                <DurationInput
                  label="Protected time after work and follow-up"
                  value={form.buffer}
                  onChange={(v) => change("buffer", v)}
                />
                <p>Follow-up is an activity. Protected time is a Buffer, not a task to perform.</p>
              </>
            ) : null}
          </details>
          <button ref={saveRef} type="submit" className="df-action-button">
            Save Requested Time
          </button>
        </fieldset>
      </form>
      <button type="button" className="df-secondary-button" disabled={busy} onClick={reload}>
        Discard draft and reload saved request
      </button>
      {goal.status !== "active" ? (
        <p>Reactivate this Goal before authoring planning effort.</p>
      ) : null}
      <div className="df-screen-actions">
        <button
          type="button"
          disabled={
            !demand ||
            dirty ||
            busy ||
            !ready ||
            store.getGoalPlanningDurabilityStatus() !== "durable"
          }
          onClick={() => void evaluate()}
          className="df-action-button"
        >
          Evaluate planning opportunity
        </button>
        <button type="button" onClick={onOpenReview} className="df-secondary-button">
          Review Schedule
        </button>
      </div>
      <p>
        Evaluation considers active requests with this same period, including competing Goals.
        Available time is evaluated from current planning information. Evaluation never accepts or
        publishes work.
      </p>
      {dirty ? <p>Save the planning intent before evaluating.</p> : null}
      {busy ? <p role="status">Working…</p> : null}

      {result ? <PlanningResult result={result} /> : null}
    </div>
  );
}
function DurationInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset className="df-screen-actions">
      <legend>{label}</legend>
      <label>
        Hours
        <input
          aria-label={`${label} hours`}
          type="number"
          min="0"
          max="10000"
          step="1"
          required
          value={Math.floor(value / 60)}
          onChange={(e) => onChange(Number(e.target.value) * 60 + (value % 60))}
        />
      </label>
      <label>
        Minutes
        <input
          aria-label={`${label} minutes`}
          type="number"
          min="0"
          max="59"
          step="1"
          required
          value={value % 60}
          onChange={(e) => onChange(Math.floor(value / 60) * 60 + Number(e.target.value))}
        />
      </label>
    </fieldset>
  );
}
function PlanningResult({ result }: { result: PlanningRequestResult }) {
  if (result.status === "blocked")
    return <p>Required Sleep must be resolved before planning this effort.</p>;
  if (result.status === "invalidHorizon")
    return <p role="status">The planning period is invalid. Check its dates.</p>;
  if (result.status === "unavailable")
    return (
      <p role="status">
        {result.reason === "noPreview"
          ? "Available time is unknown. Generate a schedule in Review first."
          : result.reason === "outsidePreview"
            ? "Available time is unavailable for this period. Generate a schedule covering it."
            : "Planning authority needs recovery before available time can be evaluated."}
      </p>
    );
  const { capacity } = result.evaluation;
  const qualified = capacity.qualification;
  const known =
    qualified.coverage === "complete" &&
    qualified.freshness === "current" &&
    qualified.integrity === "valid";
  return (
    <section aria-label="Planning result" aria-live="polite">
      <h4>Planning result</h4>
      <p>
        {!known
          ? qualified.freshness === "stale"
            ? "Available time is out of date. Refresh the schedule."
            : qualified.integrity !== "valid"
              ? "Available time is unknown because planning information cannot be trusted."
              : "Available time is only partially covered or unavailable. Extend schedule coverage."
          : `Known usable time: ${durationLabel(capacity.summary.fullyAllocatableMinutes)}. Qualified time: ${durationLabel(capacity.summary.qualifiedMinutes)}.`}
      </p>
      {qualified.liability === "unresolved" ? (
        <p>
          Unplaced or accepted unscheduled work still needs attention; some available time is
          qualified.
        </p>
      ) : null}
      {result.status === "demandUnavailable" ? (
        <p>No proposal: this request is inactive, unavailable, or outside the evaluated period.</p>
      ) : (
        <>
          <p>{feasibilityLabels[result.selected.feasibility.classification]}</p>
          <ul>
            {result.selected.feasibility.reasons.map((r, i) => (
              <li key={i}>{feasibilityReasons[r.code]}</li>
            ))}
          </ul>
          {!result.outcomes.length ? (
            <p>
              No proposal is available. The evaluation found no eligible opportunity for this
              request. The reasons above describe what needs attention.
            </p>
          ) : null}
          {result.outcomes.map(({ result: offer, recording }, i) => (
            <div key={i}>
              {offer.status === "proposed" ? (
                <>
                  <p>
                    {recording?.status === "accepted" &&
                    recording.persistence === "durable" &&
                    hasCurrentAcceptanceReceipt(recording)
                      ? "Proposal saved for review. Nothing has been accepted or scheduled by this evaluation."
                      : recording?.status === "unconfirmed"
                        ? "The proposal write is unconfirmed. Authority is protected; do not retry evaluation until it can be verified."
                        : "A proposal was calculated but is not confirmed as current saved authority. Review its status before deciding."}
                  </p>
                  <p>{offer.proposal.options.length} option(s). Open Review Schedule to decide.</p>
                  {offer.proposal.options
                    .filter((o) => o.preferred)
                    .map((o) => (
                      <ul key={o.id}>
                        {o.assignments.map((a) => (
                          <li key={a.demandProjectionId}>
                            Proposed effort: {durationLabel(a.assignedMinutes)}; unallocated effort:{" "}
                            {durationLabel(a.unmetMinutes)}.
                          </li>
                        ))}
                        <li>
                          Support: {durationLabel(o.supportMinutes)}. Protected time:{" "}
                          {durationLabel(o.bufferMinutes)}.
                        </li>
                      </ul>
                    ))}
                </>
              ) : offer.status === "noProposal" ? (
                <>
                  <p>No proposal is available.</p>
                  <ul>
                    {offer.result.reasons.map((r) => (
                      <li key={r.code}>{noProposalReasons[r.code]}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>
                  No proposal: the period or allocation input is invalid. Review the planning dates
                  and evaluate again.
                </p>
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );
}
