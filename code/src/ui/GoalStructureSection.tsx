import { useEffect, useId, useRef, useState } from "react";
import type { GoalId, GoalV1 } from "../core/goals/goal.js";
import type {
  GoalStructureRelationshipV1 as Relationship,
  GoalStructureMilestoneV1 as Milestone,
} from "../core/planning/goalStructure.js";
import type { DayFrameStore } from "../state/types.js";
import type { GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";

type Store = Pick<
  DayFrameStore,
  | "listGoals"
  | "getGoal"
  | "subscribeGoals"
  | "subscribeGoalStructure"
  | "queryGoalStructure"
  | "listGoalStructureRelationships"
  | "listGoalStructureMilestones"
  | "getGoalStructureRelationshipRevision"
  | "getGoalStructureMilestoneRevision"
  | "getGoalStructureIngressStatus"
  | "getGoalStructureQualification"
  | "getGoalStructureDurabilityStatus"
  | "createRelationship"
  | "reviseRelationship"
  | "retireRelationship"
  | "createMilestone"
  | "reviseMilestone"
  | "retryGoalStructurePersistence"
>;
// Presentation identity only: distinct store owners never share an editor cell.
const ownerKeys = new WeakMap<object, number>();
let nextOwnerKey = 0;
function ownerKey(store: object) {
  let key = ownerKeys.get(store);
  if (key === undefined) {
    key = ++nextOwnerKey;
    ownerKeys.set(store, key);
  }
  return key;
}

type Editor =
  | { kind: Relationship["kind"]; base?: Relationship; retire?: boolean }
  | { kind: "milestone"; base?: Milestone };
type Draft = {
  target: string;
  search: string;
  limit: number;
  direction: string;
  requiredness: string;
  strength: string;
  condition: string;
  title: string;
  date: string;
  state: Milestone["state"];
};
const emptyDraft = (): Draft => ({
  target: "",
  search: "",
  limit: 10,
  direction: "parent",
  requiredness: "",
  strength: "",
  condition: "goalCompleted",
  title: "",
  date: "",
  state: "active",
});
const labels = {
  contains: "Containment",
  contributesTo: "Contributions",
  dependsOn: "Prerequisites",
};
const eligibility = {
  eligible: "No current structural prerequisite blocks this Goal.",
  ineligible: "A current prerequisite or Goal lifecycle state prevents structural eligibility.",
  conditionallyEligible: "Advisory prerequisites remain unmet or uncertain.",
  unknown: "Structural eligibility is unknown.",
};
function rejection(result: { reason: string; detail?: string }) {
  if (
    result.detail === "clockBeforeRecordedAuthority" ||
    result.detail === "retirementBeforeEffectiveStart" ||
    result.detail === "invalidClock"
  )
    return "The clock cannot support this change against recorded Structure times. Your draft is kept; correct the clock before explicitly trying again.";
  if (result.detail === "contextReplaced")
    return "The editing context was replaced. No old intent was replayed.";
  switch (result.reason) {
    case "invalidGraph":
      return "This change was rejected by Structure validation. Check direction, duplicate links, parent relationships and prerequisites. A Milestone referenced by an active prerequisite cannot be retired. Your draft is kept.";
    case "staleRevision":
      return "This record changed. Your draft and original revision are kept. Cancel and reopen the saved record to start a new edit.";
    case "notFound":
    case "missingEndpoint":
      return "The selected record or endpoint is unavailable. Your draft is kept; refresh and review the selection.";
    case "protected":
      return "Structure changes are protected. Records and your draft are preserved. Review the evidence below; no automatic repair is available.";
    case "initializing":
      return "Structure is still loading. Your draft is kept.";
    case "authorityTransactionActive":
      return "Structure is busy or an authority transaction is active. Nothing was saved by this submission; your draft is kept. Try again explicitly when it settles.";
    default:
      return "Structure could not accept this change. Check the entered values; your draft is kept.";
  }
}
export function GoalStructureSection({
  store,
  goal,
  context,
  onGoal,
  now = () => new Date(),
}: {
  store: Store;
  goal: GoalV1;
  context: GoalEditingContext;
  onGoal: (id: GoalId) => void;
  now?: () => Date;
}) {
  const [c, update, get] = useGoalEditingState(
    context,
    `structure:${ownerKey(store)}:${goal.id}`,
    () => ({
      open: false,
      editor: null as Editor | null,
      draft: emptyDraft(),
      busy: false,
      error: "",
      message: "",
      accepted: "",
      limits: { contains: 10, contributesTo: 10, dependsOn: 10, milestone: 10 },
      expanded: [] as string[],
      returnFocus: false,
    }),
  );
  const [tick, refresh] = useState(0);
  const clock = useRef(now);
  clock.current = now;
  const heading = useRef<HTMLHeadingElement>(null),
    form = useRef<HTMLFormElement>(null);
  const uid = useId();
  type Evidence = {
    goalId: GoalId;
    store: Store;
    context: GoalEditingContext;
    query: ReturnType<Store["queryGoalStructure"]>;
    relationships: Relationship[];
    milestones: Milestone[];
    goals: GoalV1[];
    choices: Milestone[];
  };
  const [evidence, setEvidence] = useState<Evidence>();
  const [readError, setReadError] = useState(false);
  useEffect(() => {
    const change = () => refresh((n) => n + 1);
    const a = store.subscribeGoalStructure(change),
      b = store.subscribeGoals(change);
    return () => {
      a();
      b();
    };
  }, [store]);
  useEffect(() => {
    if (!c.open || !context.isValid()) return;
    let current = true;
    const at = clock.current().toISOString();
    setReadError(false);
    void Promise.resolve()
      .then(() => {
        const goals = store.listGoals();
        return {
          goalId: goal.id,
          store,
          context,
          query: store.queryGoalStructure({
            goalId: goal.id,
            evaluationInstant: at,
            basis: "currentAuthority",
          }),
          relationships: store.listGoalStructureRelationships(goal.id),
          milestones: store.listGoalStructureMilestones(goal.id),
          goals,
          choices: goals.flatMap((g) => store.listGoalStructureMilestones(g.id)),
        };
      })
      .then(
        (value) => {
          if (current && context.isValid()) setEvidence(value);
        },
        () => {
          if (current && context.isValid()) setReadError(true);
        },
      );
    return () => {
      current = false;
    };
  }, [store, goal.id, context, c.open, tick]);
  useEffect(() => {
    if (!c.open) return;
    if (c.editor) form.current?.querySelector<HTMLElement>("input,select,button")?.focus();
    else if (c.returnFocus) {
      heading.current?.focus();
      update({ returnFocus: false });
    }
  }, [c.open, c.editor, context, goal.id]);
  const e =
    evidence?.goalId === goal.id && evidence.store === store && evidence.context === context
      ? evidence
      : undefined;
  const q = e?.query.status === "evaluated" ? e.query.value : undefined;
  const readable = q?.records.status === "available";
  const blocked =
    readError ||
    !context.isValid() ||
    !q ||
    q.qualification !== "qualified" ||
    store.getGoalStructureIngressStatus().status !== "accepted";
  const goalName = (id: GoalId) => {
    const g = store.getGoal(id);
    return g ? `${g.title} · ${g.id}` : `Unavailable Goal · ${id}`;
  };
  const milestoneName = (id: string) => {
    const m = e?.choices.find((m) => m.id === id);
    return m ? `${m.title} — owned by ${goalName(m.ownerGoalId)}` : `Unavailable Milestone · ${id}`;
  };
  const endpoint = (r: Relationship) =>
    r.target.kind === "goal" ? goalName(r.target.goalId) : milestoneName(r.target.milestoneId);
  function begin(editor: Editor) {
    if (get().busy || get().editor || blocked) return;
    const draft = emptyDraft(),
      b = editor.base;
    if (editor.kind === "milestone" && b && "title" in b)
      Object.assign(draft, { title: b.title, date: b.targetDate ?? "", state: b.state });
    else if (b && "semantics" in b) Object.assign(draft, b.semantics);
    update({ editor, draft, error: "", message: "" });
  }
  function patch(draft: Partial<Draft>) {
    update((v) => ({ draft: { ...v.draft, ...draft } }));
  }
  async function command(
    run: () => Promise<{
      status?: string;
      reason?: string;
      detail?: string;
      value?: Relationship | Milestone;
      persistence?: string;
      changed?: boolean;
    }>,
  ) {
    if (get().busy || !context.isValid()) return;
    update({ busy: true, error: "", message: "" });
    try {
      const result = await run();
      if (!context.isValid()) return;
      if (result.status === "rejected")
        update({
          error: rejection({
            reason: result.reason ?? "invalidInput",
            ...(result.detail ? { detail: result.detail } : {}),
          }),
        });
      else if (result.status === "accepted" && result.value) {
        const r = result.value;
        const exact =
          "title" in r
            ? store.getGoalStructureMilestoneRevision(r.id, r.revision)
            : store.getGoalStructureRelationshipRevision(r.id, r.revision);
        update({
          editor: null,
          accepted: `${r.id} revision ${r.revision}`,
          returnFocus: true,
          message: `${result.changed === false ? "No semantic change. " : ""}${exact.status === "resolved" ? "Structure accepted" : "Accepted record is no longer in this context"} (${r.id}, revision ${r.revision}). ${result.persistence === "durable" ? "Saved durably." : "Available for this session; local saving needs attention. Retry Structure save without creating it again."} Earlier revisions are retained.`,
        });
      } else if (result.status === "durable")
        update({ message: "Structure saved durably. Accepted identities are unchanged." });
      else
        update({
          error:
            "Local saving still needs attention. Retry Structure save; do not repeat creation.",
        });
    } catch {
      if (context.isValid())
        update({
          error:
            "The operation could not finish. Review current records and saving status before another explicit action.",
        });
    } finally {
      if (context.isValid()) {
        update({ busy: false });
        refresh((n) => n + 1);
      }
    }
  }
  function save() {
    const { editor, draft: d } = get();
    if (!editor || get().busy || blocked) return;
    // Refresh evidence without changing the draft's original expected revision.
    refresh((n) => n + 1);
    if (editor.kind === "milestone") {
      if (!d.title.trim()) {
        update({ error: "Enter a Milestone title." });
        return;
      }
      const b = editor.base;
      void command(() =>
        b
          ? store.reviseMilestone(b.id, b.revision, {
              ...(d.title !== b.title ? { title: d.title } : {}),
              ...(d.date !== (b.targetDate ?? "") ? { targetDate: d.date || null } : {}),
              ...(d.state !== b.state ? { state: d.state } : {}),
            })
          : store.createMilestone({
              ownerGoalId: goal.id,
              title: d.title,
              ...(d.date ? { targetDate: d.date } : {}),
            }),
      );
      return;
    }
    const b = editor.base;
    if (editor.retire && b) {
      void command(() => store.retireRelationship(b.id, b.revision));
      return;
    }
    if (!b && !d.target) {
      update({ error: "Choose an existing endpoint." });
      return;
    }
    if (editor.kind === "contains" && !d.requiredness) {
      update({ error: "Choose required or optional explicitly." });
      return;
    }
    if (editor.kind === "dependsOn" && !d.strength) {
      update({ error: "Choose hard or advisory explicitly." });
      return;
    }
    const semantics: Relationship["semantics"] =
      editor.kind === "contains"
        ? { kind: "containment", requiredness: d.requiredness as "required" | "optional" }
        : editor.kind === "contributesTo"
          ? { kind: "contribution", mode: "nonAggregating" }
          : {
              kind: "dependency",
              strength: d.strength as "hard" | "advisory",
              condition: d.condition as "goalCompleted" | "milestoneSatisfied",
            };
    if (b) {
      void command(() =>
        store.reviseRelationship(
          b.id,
          b.revision,
          JSON.stringify(b.semantics) === JSON.stringify(semantics) ? {} : { semantics },
        ),
      );
      return;
    }
    const parent = editor.kind === "contains" && d.direction === "child";
    const target: Relationship["target"] =
      editor.kind === "dependsOn" && d.condition === "milestoneSatisfied"
        ? { kind: "milestone", milestoneId: d.target as never }
        : { kind: "goal", goalId: parent ? goal.id : (d.target as GoalId) };
    void command(() =>
      store.createRelationship({
        kind: editor.kind,
        sourceGoalId: parent ? (d.target as GoalId) : goal.id,
        target,
        semantics,
      }),
    );
  }
  const draft = c.draft,
    editor = c.editor;
  const options = (
    editor?.kind === "dependsOn" && draft.condition === "milestoneSatisfied"
      ? (e?.choices ?? []).map((m) => ({ id: m.id, label: milestoneName(m.id) }))
      : (e?.goals ?? []).map((g) => ({ id: g.id, label: goalName(g.id) }))
  )
    .sort((a, b) => a.label.localeCompare(b.label) || a.id.localeCompare(b.id))
    .filter((o) => o.label.toLowerCase().includes(draft.search.toLowerCase()));
  function recordDetails(r: Relationship | Milestone) {
    const expanded = c.expanded.includes(r.id);
    const previous =
      r.revision > 1
        ? "title" in r
          ? store.getGoalStructureMilestoneRevision(r.id, r.revision - 1)
          : store.getGoalStructureRelationshipRevision(r.id, r.revision - 1)
        : undefined;
    return (
      <details
        open={expanded}
        onToggle={(event) => {
          const open = event.currentTarget.open;
          if (open !== expanded)
            update((v) => ({
              expanded: open ? [...v.expanded, r.id] : v.expanded.filter((id) => id !== r.id),
            }));
        }}
      >
        <summary>Record details: {r.id}</summary>
        <p>
          Revision {r.revision}. Created {r.createdAt}. Updated {r.updatedAt}. Current names are
          labels, not historical names.
        </p>
        {"title" in r ? (
          <p>
            Manual checkpoint. Satisfied at: {r.satisfiedAt ?? "not recorded"}. Retired at:{" "}
            {r.retiredAt ?? "not recorded"}. Target date: {r.targetDate ?? "not set"}.
          </p>
        ) : (
          <p>
            Effective from {r.effectiveFrom}; end {r.effectiveTo ?? "unbounded"}.
          </p>
        )}
        <p>Origin: {r.provenance.origin.kind}. Earlier revisions remain exact.</p>
        {expanded && previous?.status === "resolved" && (
          <pre aria-label="Previous exact revision">
            {JSON.stringify(
              "relationship" in previous ? previous.relationship : previous.milestone,
              null,
              2,
            )}
          </pre>
        )}
      </details>
    );
  }
  return (
    <section className="df-panel df-goal-structure" aria-label="Goal Structure">
      <h3 ref={heading} tabIndex={-1}>
        Structure
      </h3>
      <p>Optional relationships and manual checkpoints. Flat Goals remain valid.</p>
      <button
        type="button"
        aria-expanded={c.open}
        onClick={() => update({ open: !c.open, returnFocus: true })}
      >
        {c.open ? "Close Structure" : "Open Structure"}
      </button>
      {c.open && (
        <>
          <button type="button" onClick={() => refresh((n) => n + 1)}>
            Refresh Structure evidence
          </button>
          {c.error && (
            <p id={uid + "-error"} role="alert">
              {c.error}
            </p>
          )}
          {c.message && <p role="status">{c.message}</p>}
          {readError ? (
            <p role="alert">
              Structure evidence could not be read. Refresh to try again; your draft is kept.
            </p>
          ) : !q ? (
            <p role="status">Structure evidence is unavailable or loading.</p>
          ) : (
            <div aria-label="Structural eligibility">
              <p>{eligibility[q.eligibility]}</p>
              <p>
                Evaluated {q.evaluatedAt}, using current authority. This is not continuous live
                eligibility, complete Feasibility, Capacity, scheduling readiness or parent
                completion eligibility.
              </p>
              {q.qualification !== "qualified" && (
                <p role="status">
                  {readable
                    ? "Structure records and history are preserved, but recorded times cannot safely support planning. Ordinary Structure changes and retry are blocked. Complete backup export remains available; no dates were repaired."
                    : "Structure records are unavailable or protected. This is not evidence of an empty Structure."}
                </p>
              )}
              {q.reasons.map((r, i) => (
                <p key={i}>
                  {reasonText(r.code)}
                  {"record" in r && r.record
                    ? ` Record ${r.record.id}, revision ${r.record.revision}.`
                    : ""}
                </p>
              ))}
            </div>
          )}
          <p>
            Containment does not create prerequisites, combine Requested Time, inherit Priority,
            transfer Progress or complete another Goal. Contributions are directional,
            non-aggregating links, not parenthood. Prerequisites do not order scheduled activities.
          </p>
          <p>
            Saving:{" "}
            {store.getGoalStructureDurabilityStatus() === "durable"
              ? "durable"
              : store.getGoalStructureDurabilityStatus() === "pending"
                ? "pending"
                : store.getGoalStructureDurabilityStatus() === "storageFailure"
                  ? "local saving needs attention"
                  : "not yet known"}
            .
          </p>
          {(store.getGoalStructureDurabilityStatus() === "storageFailure" ||
            store.getGoalStructureDurabilityStatus() === "pending") && (
            <button
              type="button"
              disabled={blocked || c.busy}
              onClick={() => void command(() => store.retryGoalStructurePersistence())}
            >
              Retry Structure save
            </button>
          )}
          <div className="df-screen-actions">
            {(
              [
                ["contains", "Link Subgoal"],
                ["contributesTo", "Add contribution"],
                ["dependsOn", "Add prerequisite"],
                ["milestone", "Create Milestone"],
              ] as const
            ).map(([kind, label]) => (
              <button
                key={kind}
                type="button"
                disabled={blocked || c.busy || !!editor}
                onClick={() => begin({ kind })}
              >
                {label}
              </button>
            ))}
          </div>
          {editor && (
            <form
              ref={form}
              className="df-form-stack"
              aria-label="Structure editor"
              aria-describedby={c.error ? uid + "-error" : undefined}
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
            >
              <fieldset disabled={blocked || c.busy} className="df-form-stack">
                <legend>
                  {editor.kind === "milestone"
                    ? editor.base
                      ? "Edit Milestone"
                      : "New manual Milestone"
                    : editor.retire
                      ? "Retire relationship"
                      : editor.base
                        ? "Edit relationship"
                        : "New relationship"}
                </legend>
                {editor.kind === "milestone" ? (
                  <>
                    <p>
                      A checkpoint owned by {goal.title}. It has no duration, Requested Time,
                      Priority, Progress stream or schedule.
                    </p>
                    <label>
                      Milestone title
                      <input
                        required
                        maxLength={200}
                        value={draft.title}
                        aria-invalid={!!c.error}
                        aria-describedby={c.error ? uid + "-error" : undefined}
                        onChange={(ev) => patch({ title: ev.target.value })}
                      />
                    </label>
                    <label>
                      Milestone target date (optional)
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(ev) => patch({ date: ev.target.value })}
                      />
                    </label>
                    {editor.base && (
                      <label>
                        Checkpoint state
                        <select
                          value={draft.state}
                          onChange={(ev) => patch({ state: ev.target.value as Milestone["state"] })}
                        >
                          <option value="active">Active</option>
                          <option value="satisfied">Satisfied — checkpoint reached manually</option>
                          <option value="retired">Retired — preserve history</option>
                        </select>
                      </label>
                    )}
                    <p>
                      Checkpoint satisfaction is separate from Goal completion, activity reporting
                      and measured Progress. Retirement may reject while a prerequisite references
                      this checkpoint.
                    </p>
                  </>
                ) : editor.retire ? (
                  <p>
                    Retire this relationship explicitly. Earlier revisions and both endpoint Goals
                    remain. It will no longer apply to current eligibility.
                  </p>
                ) : (
                  <>
                    {editor.base ? (
                      <p>
                        Fixed endpoints: {goalName(editor.base.sourceGoalId)} →{" "}
                        {endpoint(editor.base)}. Kind and endpoints are preserved; no move or
                        conversion is performed.
                      </p>
                    ) : (
                      <>
                        {editor.kind === "contains" && (
                          <label>
                            Selected Goal is
                            <select
                              value={draft.direction}
                              onChange={(ev) => patch({ direction: ev.target.value })}
                            >
                              <option value="parent">
                                Broader Goal — contains the selected Subgoal
                              </option>
                              <option value="child">
                                Subgoal — contained by the selected broader Goal
                              </option>
                            </select>
                          </label>
                        )}
                        {editor.kind === "dependsOn" && (
                          <label>
                            Prerequisite condition
                            <select
                              value={draft.condition}
                              onChange={(ev) =>
                                patch({ condition: ev.target.value, target: "", limit: 10 })
                              }
                            >
                              <option value="goalCompleted">Specified Goal is completed</option>
                              <option value="milestoneSatisfied">
                                Specified manual Milestone is satisfied
                              </option>
                            </select>
                          </label>
                        )}
                        <p>
                          {editor.kind === "dependsOn"
                            ? "This Goal depends on the selected prerequisite."
                            : editor.kind === "contributesTo"
                              ? "This Goal contributes to the selected Goal without transferring time or Progress."
                              : "The broader Goal contains the Subgoal; both remain independent Goals."}
                        </p>
                        <label>
                          Search Structure endpoints
                          <input
                            type="search"
                            value={draft.search}
                            onChange={(ev) => patch({ search: ev.target.value, limit: 10 })}
                          />
                        </label>
                        <label>
                          Existing endpoint
                          <select
                            required
                            value={draft.target}
                            onChange={(ev) => patch({ target: ev.target.value })}
                          >
                            <option value="">Choose an existing endpoint</option>
                            {draft.target &&
                              !options.slice(0, draft.limit).some((o) => o.id === draft.target) && (
                                <option value={draft.target}>
                                  Retained selection · {draft.target}
                                </option>
                              )}
                            {options.slice(0, draft.limit).map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <p>
                          Showing {Math.min(draft.limit, options.length)} of {options.length}{" "}
                          matching endpoints. Identities distinguish duplicate titles.
                        </p>
                        {options.length > draft.limit && (
                          <button type="button" onClick={() => patch({ limit: draft.limit + 10 })}>
                            Show more endpoints
                          </button>
                        )}
                      </>
                    )}
                    {editor.kind === "contains" && (
                      <label>
                        Subgoal requiredness
                        <select
                          required
                          value={draft.requiredness}
                          onChange={(ev) => patch({ requiredness: ev.target.value })}
                        >
                          <option value="">Choose required or optional</option>
                          <option value="required">Required</option>
                          <option value="optional">Optional</option>
                        </select>
                      </label>
                    )}
                    {editor.kind === "dependsOn" && (
                      <>
                        <label>
                          Prerequisite strength
                          <select
                            required
                            value={draft.strength}
                            onChange={(ev) => patch({ strength: ev.target.value })}
                          >
                            <option value="">Choose hard or advisory</option>
                            <option value="hard">
                              Hard — unmet condition blocks structural eligibility
                            </option>
                            <option value="advisory">
                              Advisory — retain qualified eligibility
                            </option>
                          </select>
                        </label>
                        {editor.base && (
                          <p>
                            Condition:{" "}
                            {draft.condition === "goalCompleted"
                              ? "specified Goal is completed"
                              : "specified manual Milestone is satisfied"}
                            . Condition follows the fixed endpoint type.
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
                <button type="submit">
                  {"retire" in editor && editor.retire
                    ? "Confirm relationship retirement"
                    : "Save Structure"}
                </button>
              </fieldset>
              <button
                type="button"
                disabled={c.busy}
                onClick={() => update({ editor: null, error: "", returnFocus: true })}
              >
                Cancel Structure edit
              </button>
              <p>Only unsaved intent is discarded by Cancel. Accepted records remain.</p>
            </form>
          )}
          {c.busy && <p role="status">Structure operation pending…</p>}
          {readable && e && (
            <>
              {(Object.keys(labels) as Relationship["kind"][]).map((kind) => {
                const rows = e.relationships.filter((r) => r.kind === kind);
                return (
                  <section key={kind} aria-label={labels[kind]}>
                    <h4>{labels[kind]}</h4>
                    <p>
                      Showing {Math.min(rows.length, c.limits[kind])} of {rows.length} current
                      records, including retired records.
                    </p>
                    {!rows.length && <p>No {labels[kind].toLowerCase()} recorded for this Goal.</p>}
                    <ul>
                      {rows.slice(0, c.limits[kind]).map((r) => {
                        const applicability =
                          q?.records.status === "available"
                            ? q.records.values.find((v) => v.id === r.id)
                            : undefined;
                        return (
                          <li key={r.id}>
                            <p>
                              {goalName(r.sourceGoalId)} → {endpoint(r)}
                            </p>
                            <p>
                              Record {r.status}. Applicability:{" "}
                              {applicability?.applicability === "applicable"
                                ? "applies at evaluation"
                                : applicability?.applicability === "notApplicable"
                                  ? "does not apply at evaluation"
                                  : "unknown"}
                              . Interval position: {intervalText(applicability?.intervalPosition)}.{" "}
                              {r.semantics.kind === "containment"
                                ? `${r.semantics.requiredness} Subgoal`
                                : r.semantics.kind === "contribution"
                                  ? "Non-aggregating contribution"
                                  : `${r.semantics.strength} prerequisite: ${r.semantics.condition === "goalCompleted" ? "Goal completed" : "Milestone satisfied"}`}
                              .
                            </p>
                            {recordDetails(r)}
                            <button
                              type="button"
                              disabled={blocked || c.busy || !!editor || r.status === "retired"}
                              onClick={() => begin({ kind: r.kind, base: r })}
                            >
                              Edit relationship {r.id}
                            </button>
                            <button
                              type="button"
                              disabled={blocked || c.busy || !!editor || r.status === "retired"}
                              onClick={() => begin({ kind: r.kind, base: r, retire: true })}
                            >
                              Retire relationship {r.id}
                            </button>
                            {[
                              r.sourceGoalId,
                              ...(r.target.kind === "goal" ? [r.target.goalId] : []),
                            ]
                              .filter((id) => id !== goal.id)
                              .map((id) => (
                                <button
                                  type="button"
                                  key={id}
                                  onClick={() => {
                                    update({ returnFocus: true });
                                    onGoal(id);
                                  }}
                                >
                                  Open related Goal: {goalName(id)}
                                </button>
                              ))}
                          </li>
                        );
                      })}
                    </ul>
                    {rows.length > c.limits[kind] && (
                      <button
                        type="button"
                        onClick={() =>
                          update({ limits: { ...c.limits, [kind]: c.limits[kind] + 10 } })
                        }
                      >
                        Show more {labels[kind].toLowerCase()}
                      </button>
                    )}
                  </section>
                );
              })}
              <section aria-label="Manual Milestones">
                <h4>Manual Milestones</h4>
                <p>
                  Showing {Math.min(e.milestones.length, c.limits.milestone)} of{" "}
                  {e.milestones.length} checkpoints owned by this Goal.
                </p>
                <ul>
                  {e.milestones.slice(0, c.limits.milestone).map((m) => (
                    <li key={m.id}>
                      <p>
                        {m.title} · {m.state} · owner {goal.title}
                      </p>
                      {recordDetails(m)}
                      <button
                        type="button"
                        disabled={blocked || c.busy || !!editor}
                        onClick={() => begin({ kind: "milestone", base: m })}
                      >
                        Edit Milestone: {m.title} · {m.id}
                      </button>
                    </li>
                  ))}
                </ul>
                {e.milestones.length > c.limits.milestone && (
                  <button
                    type="button"
                    onClick={() =>
                      update({ limits: { ...c.limits, milestone: c.limits.milestone + 10 } })
                    }
                  >
                    Show more Milestones
                  </button>
                )}
              </section>
            </>
          )}
        </>
      )}
    </section>
  );
}
function reasonText(code: string) {
  switch (code) {
    case "hardPrerequisiteUnsatisfied":
      return "A hard prerequisite has not been satisfied.";
    case "hardPrerequisiteUnknown":
      return "A hard prerequisite cannot currently be verified.";
    case "advisoryPrerequisiteUnmet":
      return "An advisory prerequisite is unmet.";
    case "advisoryPrerequisiteUnknown":
      return "An advisory prerequisite is unknown.";
    case "temporalAnomaly":
      return "Retained Structure times are temporally unqualified.";
    case "goalLifecycle":
      return "The Goal lifecycle does not permit current structural eligibility.";
    case "missingGoal":
      return "The Goal is unavailable.";
    default:
      return "Current Structure evidence is unavailable.";
  }
}

function intervalText(position?: string) {
  switch (position) {
    case "beforeStart":
      return "before its effective start";
    case "inside":
      return "inside the recorded interval";
    case "atOrAfterEnd":
      return "at or after its effective end";
    case "empty":
      return "empty interval";
    default:
      return "unknown";
  }
}
