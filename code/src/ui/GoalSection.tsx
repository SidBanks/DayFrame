import { useEffect, useRef, useState, type ReactNode, type ReactElement } from "react";
import type { GoalCommitmentLinkV1, GoalId, GoalV1 } from "../core/goals/goal.js";
import type { DayFrameState, DayFrameStore } from "../state/types.js";
import { createGoalEditingContext, type GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
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
  renderPlanning,
  renderInspection,
  renderStructure,
  renderRecorded,
  initialGoalId,
  onInitialGoalHandled,
  context: suppliedContext,
}: {
  context?: GoalEditingContext;
  onInitialGoalHandled?: () => void;
  initialGoalId?: string;
  store: GoalStore;
  state: DayFrameState;
  renderPlanning?: (goal: GoalV1) => ReactNode;
  renderRecorded?: (goal: GoalV1) => ReactNode;
  renderInspection?: (goalId: string) => ReactNode;
  renderStructure?: (goal: GoalV1, navigate: (id: GoalId) => void) => ReactNode;
}): ReactElement {
  const [goals, setGoals] = useState(() => store.listGoals());
  const [localContext] = useState(createGoalEditingContext);
  const context = suppliedContext ?? localContext;
  const [view, update, getView] = useGoalEditingState(context, "goals", () => ({
    selectedId: null as GoalId | null,
    editing: null as "create" | "edit" | null,
    draft: emptyDraft,
    expectedRevision: null as number | null,
    base: undefined as GoalV1 | undefined,
    message: "",
    error: "",
    busy: false,
    search: "",
    filter: "all" as "all" | GoalV1["status"],
    limit: 10,
    pendingSelection: undefined as string | undefined,
  }));
  const [returns, updateReturns] = useGoalEditingState(context, "structure-return", () => ({
    stack: [] as (typeof view)[],
  }));
  function openRelated(id: GoalId) {
    if (getView().busy) return;
    updateReturns((v) => ({ stack: [...v.stack, getView()] }));
    update({
      selectedId: id,
      editing: null,
      draft: emptyDraft,
      base: undefined,
      expectedRevision: null,
      message: "",
      error: "",
      pendingSelection: undefined,
    });
  }
  const { selectedId, editing, draft, expectedRevision, message, error, busy } = view;
  const setSelectedId = (selectedId: GoalId | null) => update({ selectedId });
  const setEditing = (editing: "create" | "edit" | null) => update({ editing });
  const setDraft = (draft: Draft) => update({ draft });
  const setExpectedRevision = (expectedRevision: number | null) => update({ expectedRevision });
  const setMessage = (message: string) => update({ message });
  const setError = (error: string) => update({ error });
  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!initialGoalId) return;
    if (getView().editing || getView().busy) update({ pendingSelection: initialGoalId });
    else update({ selectedId: initialGoalId as GoalId });
    onInitialGoalHandled?.();
  }, [initialGoalId, context, onInitialGoalHandled]);
  const ingress = store.getGoalIngressStatus();
  const durability = store.getGoalDurabilityStatus();
  const selected = selectedId ? goals.find((goal) => goal.id === selectedId) : undefined;
  const commitments = commitmentOptions(state);

  useEffect(() => store.subscribeGoals((next) => setGoals(next)), [store]);
  useEffect(() => {
    if (editing) titleRef.current?.focus();
    else document.getElementById(selected ? "selected-goal-heading" : "goals-heading")?.focus();
  }, [editing, selectedId]);
  useEffect(() => {
    if (busy || editing !== "edit") return;
    if (
      !selected ||
      selected.revision !== expectedRevision ||
      JSON.stringify(selected) !== JSON.stringify(view.base)
    )
      setError(
        "This Goal changed while you were editing it. Your draft is kept. Review and reload the saved Goal before trying again.",
      );
  }, [busy, editing, expectedRevision, selected, view.base]);

  function beginCreate() {
    if (getView().busy || getView().editing) return;
    update({ base: undefined });
    setSelectedId(null);
    setEditing("create");
    setDraft(emptyDraft);
    setExpectedRevision(null);
    clearFeedback();
  }
  function beginEdit(goal: GoalV1) {
    if (getView().busy) return;
    update({ base: goal });
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
    if (getView().busy) return;
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
    if (getView().busy || !context.isValid()) return;
    clearFeedback();
    if (!draft.title.trim()) {
      setError("Enter a Goal title.");
      titleRef.current?.focus();
      return;
    }
    if (
      editing === "edit" &&
      JSON.stringify(store.getGoal(selectedId!)) !== JSON.stringify(view.base)
    ) {
      setError(
        "This Goal changed while you were editing it. Your draft is kept. Review and reload the saved Goal before trying again.",
      );
      return;
    }
    update({ busy: true });
    try {
      const result =
        editing === "create"
          ? await store.createGoal({
              title: draft.title,
              ...(draft.description ? { description: draft.description } : {}),
              ...(draft.targetDate ? { targetDate: draft.targetDate as never } : {}),
            })
          : selectedId && expectedRevision !== null
            ? await store.updateGoal(selectedId, expectedRevision, {
                ...(draft.title !== view.base?.title ? { title: draft.title } : {}),
                ...(draft.description !== (view.base?.description ?? "")
                  ? { description: draft.description || null }
                  : {}),
                ...(draft.targetDate !== (view.base?.targetDate ?? "")
                  ? { targetDate: draft.targetDate ? (draft.targetDate as never) : null }
                  : {}),
              })
            : { status: "rejected" as const, reason: "notFound" as const };
      if (result.status === "rejected") {
        setError(commandError(result.reason));
        return;
      }
      const canonical = store.getGoal(result.goal.id);
      update({
        selectedId: result.goal.id,
        editing: null,
        expectedRevision: null,
        base: canonical,
        message:
          result.persistence === "durable"
            ? "Goal saved."
            : "Goal accepted for this session; local saving needs attention. Retry Goal save without creating it again.",
      });
      setGoals(store.listGoals());
    } catch {
      setError(
        "Goal saving could not finish. Review the current Goal and local saving status before retrying.",
      );
    } finally {
      update({ busy: false });
    }
  }
  async function lifecycle(goal: GoalV1, action: "complete" | "archive" | "reactivate") {
    if (getView().busy) return;
    update({ busy: true });
    clearFeedback();
    const result =
      action === "complete"
        ? await store.completeGoal(goal.id, goal.revision)
        : action === "archive"
          ? await store.archiveGoal(goal.id, goal.revision)
          : await store.reactivateGoal(goal.id, goal.revision);
    update({ busy: false });
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
        <h2 id="goals-heading" tabIndex={-1}>
          Goals
        </h2>
        <p aria-live="polite">Loading Goals…</p>
      </section>
    );
  if (ingress.status === "protected")
    return (
      <section className="df-panel df-goals" aria-labelledby="goals-heading">
        <h2 id="goals-heading" tabIndex={-1}>
          Goals
        </h2>
        <p role="alert" className="df-danger-message">
          Goals need recovery before they can be viewed or changed. Stored Goal data was preserved.
        </p>
        {(selectedId ?? initialGoalId) ? renderInspection?.((selectedId ?? initialGoalId)!) : null}
      </section>
    );
  const ordered = [...goals].sort(
    (a, b) =>
      Number(b.status === "active") - Number(a.status === "active") ||
      a.title.toLowerCase().localeCompare(b.title.toLowerCase(), "en") ||
      a.id.localeCompare(b.id),
  );
  const matches = ordered.filter(
    (g) =>
      (view.filter === "all" || g.status === view.filter) &&
      g.title.toLowerCase().includes(view.search.trim().toLowerCase()),
  );
  const shown = matches.slice(0, view.limit);
  const active = shown.filter((g) => g.status === "active"),
    past = shown.filter((g) => g.status !== "active");
  return (
    <section className="df-panel df-goals" aria-labelledby="goals-heading">
      <header className="df-collapsible-section-header">
        <div>
          <p className="df-workflow-eyebrow">Authored intent</p>
          <h2 id="goals-heading" tabIndex={-1}>
            Goals
          </h2>
          <p className="df-support">
            Describe what you want to accomplish and connect it to work you already plan. Goal
            changes do not change your schedule automatically.
          </p>
        </div>
        <button
          className="df-action-button"
          type="button"
          disabled={busy || !!editing}
          onClick={beginCreate}
        >
          Add Goal
        </button>
      </header>
      {returns.stack.length > 0 && (
        <button
          type="button"
          disabled={busy || !!editing}
          onClick={() => {
            const previous = returns.stack.at(-1)!;
            update(previous);
            updateReturns({ stack: returns.stack.slice(0, -1) });
          }}
        >
          Back to previous Goal and drafts
        </button>
      )}
      {initialGoalId && !goals.some((goal) => goal.id === initialGoalId) && (
        <p role="status">
          The linked Goal is no longer available in the current Goal list. Its published schedule
          remains unchanged.
        </p>
      )}
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
        <p id="goal-edit-error" className="df-danger-message" role="alert">
          {error}
        </p>
      ) : null}
      <div className="df-goal-list-controls">
        <label>
          Search Goals
          <input
            type="search"
            value={view.search}
            onChange={(e) => update({ search: e.target.value, limit: 10 })}
          />
        </label>
        <label>
          Goal status
          <select
            value={view.filter}
            onChange={(e) => update({ filter: e.target.value as typeof view.filter, limit: 10 })}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>
      <p role="status">
        Showing {shown.length} of {matches.length} matching Goals ({goals.length} total). Active
        first, then title.
      </p>
      {goals.length > 0 && !matches.length && <p>No Goals match your search and status filter.</p>}
      {selected && !shown.some((g) => g.id === selected.id) && (
        <p>The selected Goal remains open outside the visible list. Your edits are kept.</p>
      )}
      {selectedId && !selected && (
        <p role="alert">
          The linked Goal is no longer available in the current Goal list. Its retained draft cannot
          be saved; published schedules remain unchanged.
        </p>
      )}
      {view.pendingSelection && (
        <div role="alert">
          <p>
            A linked Goal was opened while this editor had a draft. Finish this edit, or explicitly
            discard it to open the linked Goal.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              cancelEdit();
              update({ selectedId: view.pendingSelection as GoalId, pendingSelection: undefined });
            }}
          >
            Discard Goal draft and open linked Goal
          </button>
          <button type="button" onClick={() => update({ pendingSelection: undefined })}>
            Keep editing
          </button>
        </div>
      )}
      <div className="df-goal-columns">
        <GoalList
          heading="Active Goals"
          goals={active}
          selectedId={selectedId}
          onSelect={setSelectedId}
          disabled={busy || !!editing}
        />
        <GoalList
          heading="Completed and archived"
          goals={past}
          selectedId={selectedId}
          onSelect={setSelectedId}
          disabled={busy || !!editing}
        />
      </div>
      {matches.length > shown.length && (
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => update({ limit: view.limit + 10 })}
        >
          Show more Goals
        </button>
      )}
      {editing && (
        <p>
          Goal switching is paused while editing. Save or Cancel explicitly; search and navigation
          keep this draft.
        </p>
      )}
      {editing ? (
        <form
          className="df-goal-editor df-form-stack"
          aria-describedby={error ? "goal-edit-error" : undefined}
          aria-label={editing === "create" ? "Add Goal" : "Edit Goal"}
          onSubmit={(event) => {
            event.preventDefault();
            void saveGoal();
          }}
        >
          <fieldset disabled={busy || (editing === "edit" && !selected)} className="df-form-stack">
            <legend>Goal outcome</legend>
            <label>
              Goal title
              <input
                ref={titleRef}
                aria-describedby={error ? "goal-edit-error" : undefined}
                aria-invalid={!!error}
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
            </div>
          </fieldset>
          <button
            className="df-secondary-button"
            disabled={busy}
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
          {editing === "edit" && selected && (
            <button
              className="df-secondary-button"
              disabled={busy}
              type="button"
              onClick={() => beginEdit(selected)}
            >
              Discard draft and reload saved Goal
            </button>
          )}
          {busy && <p role="status">Saving Goal…</p>}
        </form>
      ) : null}
      {!editing && goals.length === 0 ? (
        <div className="df-goal-empty">
          <h3>No Goals yet</h3>
          <p>Goals can stand on their own or connect to existing commitments.</p>
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
      {selected ? (
        <>
          <GoalMeasurementSection
            key={`measurement:${selected.id}`}
            goal={selected}
            store={store}
            context={context}
          />
          <GoalProgressReportingSection
            key={`reporting:${selected.id}`}
            goal={selected}
            store={store}
            context={context}
          />
        </>
      ) : null}
      {!editing && selected ? renderPlanning?.(selected) : null}
      {selected ? renderRecorded?.(selected) : null}
      {selected ? renderStructure?.(selected, openRelated) : null}
      {selectedId ? renderInspection?.(selectedId) : null}
    </section>
  );
}

function GoalList({
  heading,
  goals,
  selectedId,
  onSelect,
  disabled = false,
}: {
  disabled?: boolean;
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
                disabled={disabled}
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
        <h3 id="selected-goal-heading" tabIndex={-1}>
          {goal.title}
        </h3>
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
      <p>
        Completing or archiving this Goal does not release accepted scheduled work or change
        recorded Progress.
      </p>

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
