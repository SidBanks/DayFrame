import { useEffect, useRef, useState, type ReactElement } from "react";
import type { GoalCommitmentLinkV1, GoalId, GoalV1 } from "../core/goals/goal.js";
import type { DayFrameState, DayFrameStore } from "../state/types.js";
import { GoalMeasurementSection } from "./GoalMeasurementSection.js";
import { GoalProgressReportingSection } from "./GoalProgressReportingSection.js";

type GoalStore = Pick<
  DayFrameStore,
  | "listGoals"
  | "getGoal"
  | "getGoalLinkAvailability"
  | "getGoalIngressStatus"
  | "getGoalDurabilityStatus"
  | "subscribeGoals"
  | "createGoal"
  | "updateGoal"
  | "completeGoal"
  | "archiveGoal"
  | "reactivateGoal"
  | "linkCommitment"
  | "unlinkCommitment"
  | "retryGoalPersistence"
  | "listMeasurementDefinitionHistory"
  | "getMeasurementDefinitionIngressStatus"
  | "getMeasurementDefinitionDurabilityStatus"
  | "subscribeMeasurementDefinitions"
  | "createMeasurementDefinition"
  | "reviseMeasurementDefinition"
  | "stopMeasuringGoal"
  | "restartMeasurement"
  | "retryMeasurementDefinitionPersistence"
  | "queryGoalProgressObservationHistory"
  | "subscribeProgressObservations"
  | "getProgressObservationDurabilityStatus"
  | "retryProgressObservationPersistence"
  | "createProgressObservation"
  | "correctProgressObservation"
  | "retractProgressObservation"
>;
type Draft = { title: string; description: string; targetDate: string };
type CommitmentOption = { link: GoalCommitmentLinkV1; label: string; kindLabel: string };
const emptyDraft: Draft = { title: "", description: "", targetDate: "" };

export function GoalSection({
  store,
  state,
}: {
  store: GoalStore;
  state: DayFrameState;
}): ReactElement {
  const [goals, setGoals] = useState(() => store.listGoals());
  const [selectedId, setSelectedId] = useState<GoalId | null>(null);
  const [editing, setEditing] = useState<"create" | "edit" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [expectedRevision, setExpectedRevision] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const ingress = store.getGoalIngressStatus();
  const durability = store.getGoalDurabilityStatus();
  const selected = selectedId ? goals.find((goal) => goal.id === selectedId) : undefined;
  const commitments = commitmentOptions(state);

  useEffect(
    () =>
      store.subscribeGoals((next) => {
        setGoals(next);
        setSelectedId((current) =>
          current && next.some((goal) => goal.id === current) ? current : null,
        );
      }),
    [store],
  );
  useEffect(() => {
    if (editing) titleRef.current?.focus();
  }, [editing]);
  useEffect(() => {
    if (submitting.current || !selectedId || !selected || editing !== "edit") return;
    if (expectedRevision !== null && selected.revision !== expectedRevision) {
      setError(
        "This Goal changed while you were editing it. Reload the latest version and try again.",
      );
    }
  }, [editing, expectedRevision, selected, selectedId]);

  function beginCreate() {
    setSelectedId(null);
    setEditing("create");
    setDraft(emptyDraft);
    setExpectedRevision(null);
    clearFeedback();
  }
  function beginEdit(goal: GoalV1) {
    setSelectedId(goal.id);
    setEditing("edit");
    setExpectedRevision(goal.revision);
    setDraft({
      title: goal.title,
      description: goal.description ?? "",
      targetDate: goal.targetDate ?? "",
    });
    clearFeedback();
  }
  function cancelEdit() {
    setEditing(null);
    setExpectedRevision(null);
    setDraft(emptyDraft);
    clearFeedback();
  }
  function clearFeedback() {
    setMessage("");
    setError("");
  }
  async function saveGoal() {
    clearFeedback();
    if (!draft.title.trim()) {
      setError("Enter a Goal title.");
      titleRef.current?.focus();
      return;
    }
    submitting.current = true;
    const result =
      editing === "create"
        ? await store.createGoal({
            title: draft.title,
            ...(draft.description ? { description: draft.description } : {}),
            ...(draft.targetDate ? { targetDate: draft.targetDate as never } : {}),
          })
        : selectedId && expectedRevision !== null
          ? await store.updateGoal(selectedId, expectedRevision, {
              title: draft.title,
              description: draft.description || null,
              targetDate: draft.targetDate ? (draft.targetDate as never) : null,
            })
          : { status: "rejected" as const, reason: "notFound" as const };
    submitting.current = false;
    if (result.status === "rejected") {
      setError(commandError(result.reason));
      return;
    }
    setSelectedId(result.goal.id);
    setEditing(null);
    setExpectedRevision(null);
    setMessage(
      result.persistence === "durable"
        ? "Goal saved."
        : "Goal saved for this session; local saving needs attention.",
    );
  }
  async function lifecycle(goal: GoalV1, action: "complete" | "archive" | "reactivate") {
    clearFeedback();
    const result =
      action === "complete"
        ? await store.completeGoal(goal.id, goal.revision)
        : action === "archive"
          ? await store.archiveGoal(goal.id, goal.revision)
          : await store.reactivateGoal(goal.id, goal.revision);
    if (result.status === "rejected") setError(commandError(result.reason));
    else {
      setSelectedId(result.goal.id);
      setMessage(
        action === "complete"
          ? "Goal marked complete."
          : action === "archive"
            ? "Goal archived."
            : "Goal reactivated.",
      );
    }
  }
  async function link(goal: GoalV1, value: string) {
    const option = commitments.find((item) => linkKey(item.link) === value);
    if (!option) return;
    clearFeedback();
    const result = await store.linkCommitment(goal.id, goal.revision, option.link);
    if (result.status === "rejected") setError(commandError(result.reason));
    else setMessage("Supporting commitment linked.");
  }
  async function unlink(goal: GoalV1, link: GoalCommitmentLinkV1) {
    clearFeedback();
    const result = await store.unlinkCommitment(goal.id, goal.revision, link);
    if (result.status === "rejected") setError(commandError(result.reason));
    else setMessage("Supporting commitment unlinked. The commitment was not changed.");
  }

  if (ingress.status === "initializing")
    return (
      <section className="df-panel df-goals" aria-labelledby="goals-heading">
        <h2 id="goals-heading">Goals</h2>
        <p aria-live="polite">Loading Goals…</p>
      </section>
    );
  if (ingress.status === "protected")
    return (
      <section className="df-panel df-goals" aria-labelledby="goals-heading">
        <h2 id="goals-heading">Goals</h2>
        <p role="alert" className="df-danger-message">
          Goals need recovery before they can be viewed or changed. Stored Goal data was preserved.
        </p>
      </section>
    );
  const active = goals.filter((goal) => goal.status === "active");
  const past = goals.filter((goal) => goal.status !== "active");
  return (
    <section className="df-panel df-goals" aria-labelledby="goals-heading">
      <header className="df-collapsible-section-header">
        <div>
          <p className="df-workflow-eyebrow">Authored intent</p>
          <h2 id="goals-heading">Goals</h2>
          <p className="df-support">
            Describe what you want to accomplish and connect it to work you already plan. Goal
            changes do not change your schedule automatically.
          </p>
        </div>
        <button className="df-action-button" type="button" onClick={beginCreate}>
          Add Goal
        </button>
      </header>
      {durability === "storageFailure" ? (
        <div className="df-danger-message" role="alert">
          <p>Goal changes are available for this session but are not durably saved.</p>
          <button
            className="df-secondary-button"
            type="button"
            onClick={() => void store.retryGoalPersistence()}
          >
            Retry Goal save
          </button>
        </div>
      ) : null}
      {message ? (
        <p className="df-success-message" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="df-danger-message" role="alert">
          {error}
        </p>
      ) : null}
      {editing ? (
        <form
          className="df-goal-editor df-form-stack"
          aria-label={editing === "create" ? "Add Goal" : "Edit Goal"}
          onSubmit={(event) => {
            event.preventDefault();
            void saveGoal();
          }}
        >
          <label>
            Goal title
            <input
              ref={titleRef}
              maxLength={200}
              required
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </label>
          <label>
            Description <span className="df-support">(optional)</span>
            <textarea
              maxLength={2000}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            />
          </label>
          <label>
            Target date <span className="df-support">(optional)</span>
            <input
              type="date"
              value={draft.targetDate}
              onChange={(event) => setDraft({ ...draft, targetDate: event.target.value })}
            />
          </label>
          <p className="df-support">
            A target date describes your intended horizon; it does not change scheduling
            automatically.
          </p>
          <div className="df-screen-actions">
            <button className="df-action-button" type="submit">
              Save Goal
            </button>
            <button className="df-secondary-button" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      {!editing && goals.length === 0 ? (
        <div className="df-goal-empty">
          <h3>No Goals yet</h3>
          <p>Goals can stand on their own or connect to existing commitments.</p>
        </div>
      ) : null}
      {!editing ? (
        <div className="df-goal-columns">
          <GoalList
            heading="Active Goals"
            goals={active}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <GoalList
            heading="Completed and archived"
            goals={past}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      ) : null}
      {!editing && selected ? (
        <GoalDetail
          goal={selected}
          store={store}
          commitments={commitments}
          onEdit={beginEdit}
          onLifecycle={lifecycle}
          onLink={link}
          onUnlink={unlink}
        />
      ) : null}
    </section>
  );
}

function GoalList({
  heading,
  goals,
  selectedId,
  onSelect,
}: {
  heading: string;
  goals: GoalV1[];
  selectedId: GoalId | null;
  onSelect: (id: GoalId) => void;
}) {
  return (
    <div>
      <h3>{heading}</h3>
      {goals.length ? (
        <ul className="df-goal-list">
          {goals.map((goal) => (
            <li key={goal.id}>
              <button
                aria-pressed={selectedId === goal.id}
                className="df-goal-list-button"
                onClick={() => onSelect(goal.id)}
                type="button"
              >
                <strong>{goal.title}</strong>
                <span>
                  {goal.status}
                  {goal.targetDate ? ` · Target ${goal.targetDate}` : ""}
                </span>
                <span>
                  {goal.links.length} supporting{" "}
                  {goal.links.length === 1 ? "commitment" : "commitments"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="df-support">None.</p>
      )}
    </div>
  );
}
function GoalDetail({
  goal,
  store,
  commitments,
  onEdit,
  onLifecycle,
  onLink,
  onUnlink,
}: {
  goal: GoalV1;
  store: GoalStore;
  commitments: CommitmentOption[];
  onEdit: (goal: GoalV1) => void;
  onLifecycle: (goal: GoalV1, action: "complete" | "archive" | "reactivate") => void;
  onLink: (goal: GoalV1, value: string) => void;
  onUnlink: (goal: GoalV1, link: GoalCommitmentLinkV1) => void;
}) {
  const availability = store.getGoalLinkAvailability(goal.id);
  const linked = new Set(goal.links.map(linkKey));
  const eligible = commitments.filter((item) => !linked.has(linkKey(item.link)));
  return (
    <article className="df-goal-detail" aria-labelledby="selected-goal-heading">
      <header>
        <p className="df-workflow-eyebrow">{goal.status} Goal</p>
        <h3 id="selected-goal-heading">{goal.title}</h3>
      </header>
      {goal.description ? <p>{goal.description}</p> : null}
      {goal.targetDate ? (
        <p>
          <strong>Target:</strong> {goal.targetDate}
        </p>
      ) : null}
      <div className="df-screen-actions">
        <button className="df-secondary-button" type="button" onClick={() => onEdit(goal)}>
          Edit Goal
        </button>
        {goal.status === "active" ? (
          <>
            <button
              className="df-secondary-button"
              type="button"
              onClick={() => void onLifecycle(goal, "complete")}
            >
              Mark Complete
            </button>
            <button
              className="df-secondary-button"
              type="button"
              onClick={() => void onLifecycle(goal, "archive")}
            >
              Archive Goal
            </button>
          </>
        ) : (
          <button
            className="df-secondary-button"
            type="button"
            onClick={() => void onLifecycle(goal, "reactivate")}
          >
            Reactivate Goal
          </button>
        )}
      </div>
      <GoalMeasurementSection goal={goal} store={store} />
      <GoalProgressReportingSection goal={goal} store={store} />
      <div>
        <h4>Supporting commitments</h4>
        {availability.length ? (
          <ul className="df-goal-links">
            {availability.map(({ link, status }) => {
              const option = commitments.find((item) => linkKey(item.link) === linkKey(link));
              return (
                <li key={linkKey(link)}>
                  <span>
                    <strong>{option?.label ?? "Previously linked commitment"}</strong> ·{" "}
                    {option?.kindLabel ?? kindLabel(link.sourceKind)}{" "}
                    {status === "unavailable" ? (
                      <em className="df-warning-message">Currently unavailable</em>
                    ) : null}
                  </span>
                  <button
                    className="df-secondary-button"
                    aria-label={`Unlink ${option?.label ?? "unavailable commitment"} from ${goal.title}`}
                    type="button"
                    onClick={() => void onUnlink(goal, link)}
                  >
                    Unlink
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="df-support">
            No supporting commitments linked. This Goal can stand on its own.
          </p>
        )}
        {eligible.length ? (
          <label>
            Link an existing commitment
            <select
              defaultValue=""
              onChange={(event) => {
                if (event.target.value) void onLink(goal, event.target.value);
                event.target.value = "";
              }}
            >
              <option value="">Choose a commitment</option>
              {eligible.map((item) => (
                <option key={linkKey(item.link)} value={linkKey(item.link)}>
                  {item.kindLabel}: {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="df-support">No additional current commitments are available to link.</p>
        )}
      </div>
    </article>
  );
}
function commitmentOptions(state: DayFrameState): CommitmentOption[] {
  const result: CommitmentOption[] = [];
  const add = (
    sourceKind: GoalCommitmentLinkV1["sourceKind"],
    source: { id: string; incarnationId: string; title?: string; name?: string },
    fallback: string,
  ) =>
    result.push({
      link: { sourceKind, id: source.id, incarnationId: source.incarnationId as never },
      label: source.title ?? source.name ?? fallback,
      kindLabel: kindLabel(sourceKind),
    });
  state.blockTemplates.forEach((item) => add("blockTemplate", item, item.id));
  state.blockRecurrences.forEach((item) =>
    add(
      "blockRecurrence",
      item,
      state.blockTemplates.find((template) => template.id === item.blockTemplateId)?.title ??
        item.id,
    ),
  );
  state.manualEvents.forEach((item) => add("manualEvent", item, item.title));
  state.shiftDefinitions.forEach((item) => add("shiftDefinition", item, item.name));
  state.shiftCycles.forEach((cycle) => {
    add("shiftCycle", cycle, cycle.name);
    cycle.segments.forEach((item) => add("shiftSegment", item, `${cycle.name} segment`));
    (cycle.sequence ?? []).forEach((item) =>
      add("shiftSequenceEntry", item, `${cycle.name} day ${item.dayOffset + 1}`),
    );
  });
  return result.sort(
    (a, b) => a.kindLabel.localeCompare(b.kindLabel) || a.label.localeCompare(b.label),
  );
}
function kindLabel(kind: GoalCommitmentLinkV1["sourceKind"]) {
  return (
    {
      blockTemplate: "Template",
      blockRecurrence: "Recurrence",
      manualEvent: "Calendar event",
      shiftDefinition: "Shift",
      shiftCycle: "Shift cycle",
      shiftSegment: "Shift segment",
      shiftSequenceEntry: "Cycle day",
    } as const
  )[kind];
}
function linkKey(link: GoalCommitmentLinkV1) {
  return `${link.sourceKind}|${link.id}|${link.incarnationId}`;
}
function commandError(reason: string) {
  return reason === "staleRevision"
    ? "This Goal changed while you were editing it. Reload the latest version and try again."
    : reason === "protected"
      ? "Goals need recovery before they can be changed."
      : reason === "authorityTransactionActive"
        ? "Goal changes are temporarily unavailable while DayFrame replaces saved authority."
        : reason === "duplicateLink"
          ? "That commitment already supports this Goal."
          : reason === "notFound" || reason === "linkNotFound"
            ? "This Goal changed. Select it again and retry."
            : reason === "invalidInput"
              ? "Check the Goal fields and try again."
              : "The Goal change could not be completed.";
}
