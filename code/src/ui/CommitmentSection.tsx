import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from "react";
import { allocateReadableSourceId } from "../core/authored/allocateReadableSourceId.js";
import type { BlockCategory, PreferredWindow, RecurrenceFrequency } from "../core/blocks/types.js";
import type { Weekday } from "../core/time/types.js";
import { deriveCommitmentSummaries } from "./commitmentProjection.js";
import {
  createSetupDraftSourceReference,
  recordSetupDraftSourceCreated,
  recordSetupDraftSourceDeleted,
  type SetupDraft,
  type SetupDraftEntry,
} from "./setupDraft.js";

export type CommitmentEditorTarget = {
  logicalId: string;
  incarnationId: string;
  recurrenceLogicalId: string;
  recurrenceIncarnationId: string;
};
type Props = {
  draft: SetupDraft;
  setDraft: Dispatch<SetStateAction<SetupDraft>>;
  requestedEditorTarget?: CommitmentEditorTarget | null;
  requestedAddEditor?: boolean;
  onRequestedEditorTargetHandled?: (status: "opened" | "unavailable") => void;
  onRequestedAddEditorHandled?: () => void;
  onOpenEditorInvalidated?: () => void;
};
type Editor = { mode: "add" | "edit"; originalId?: string; entry: SetupDraftEntry };
const categories: BlockCategory[] = [
  "sleep",
  "fitness",
  "meal",
  "maintenance",
  "family",
  "health",
  "review",
  "admin",
  "recovery",
  "optional",
];
const windows: PreferredWindow[] = [
  "afterWaking",
  "beforeWork",
  "afterWork",
  "beforeSleep",
  "anyAvailable",
  "custom",
];
const frequencies: RecurrenceFrequency[] = [
  "daily",
  "weekly",
  "specificWeekdays",
  "timesPerUserWeek",
];
const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function CommitmentSection({
  draft,
  setDraft,
  requestedEditorTarget = null,
  requestedAddEditor = false,
  onRequestedEditorTargetHandled,
  onRequestedAddEditorHandled,
  onOpenEditorInvalidated,
}: Props): ReactElement {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState("");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const returnFocusId = useRef<string | null>(null);
  const editorDraftFingerprint = useRef<string | null>(null);
  const summaries = deriveCommitmentSummaries(draft.templateEntries);

  useEffect(() => {
    if (editor) titleRef.current?.focus();
  }, [editor?.mode, editor?.originalId]);
  useEffect(() => {
    if (editor && editorDraftFingerprint.current !== draftFingerprint(draft)) {
      setEditor(null);
      setRemoveId(null);
      setError("");
      editorDraftFingerprint.current = null;
      onOpenEditorInvalidated?.();
    }
  }, [draft, editor, onOpenEditorInvalidated]);
  useEffect(() => {
    if (!requestedEditorTarget) return;
    const source = draft.templateEntries.find(
      (item) =>
        item.template.id === requestedEditorTarget.logicalId &&
        getIncarnationId(item.template) === requestedEditorTarget.incarnationId &&
        item.recurrence.id === requestedEditorTarget.recurrenceLogicalId &&
        getIncarnationId(item.recurrence) === requestedEditorTarget.recurrenceIncarnationId,
    );
    if (!source) {
      onRequestedEditorTargetHandled?.("unavailable");
      headingRef.current?.focus();
      return;
    }
    returnFocusId.current = source.template.id;
    editorDraftFingerprint.current = draftFingerprint(draft);
    setEditor({
      mode: "edit",
      originalId: source.template.id,
      entry: structuredClone(source),
    });
    onRequestedEditorTargetHandled?.("opened");
  }, [draft, onRequestedEditorTargetHandled, requestedEditorTarget]);
  useEffect(() => {
    if (!requestedAddEditor) return;
    openAddEditor();
    onRequestedAddEditorHandled?.();
  }, [onRequestedAddEditorHandled, requestedAddEditor]);

  function openAddEditor(): void {
    const timestamp = new Date().toISOString();
    const templateId = allocateReadableSourceId({
      prefix: "template_",
      occupiedIds: draft.templateEntries.map((item) => item.template.id),
    });
    returnFocusId.current = null;
    editorDraftFingerprint.current = draftFingerprint(draft);
    setEditor({
      mode: "add",
      entry: {
        template: {
          id: templateId,
          userId:
            draft.templateEntries[0]?.template.userId ?? draft.shiftCycles[0]?.userId ?? "user_001",
          title: "",
          category: "optional",
          requiresWorkAnchor: false,
          placementType: "flexible",
          durationMinutes: 60,
          priority: 3,
          preferredWindow: "anyAvailable",
          rescheduleBehavior: "askUser",
          requiresResource: false,
          externalResources: [],
          enabled: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        recurrence: {
          id: allocateReadableSourceId({
            prefix: "rec_",
            preferredId: `rec_${templateId}`,
            occupiedIds: draft.templateEntries.map((item) => item.recurrence.id),
          }),
          blockTemplateId: templateId,
          frequency: "daily",
        },
      },
    });
  }

  function closeEditor(focusId?: string) {
    setEditor(null);
    setError("");
    editorDraftFingerprint.current = null;
    requestAnimationFrame(() => {
      if (focusId) document.getElementById(`commitment-${focusId}`)?.focus();
      else headingRef.current?.focus();
    });
  }

  function commitEditor() {
    if (!editor || !editor.entry.template.title.trim()) {
      setError("Enter a commitment name.");
      titleRef.current?.focus();
      return;
    }
    if (
      editor.entry.recurrence.frequency === "specificWeekdays" &&
      (!editor.entry.recurrence.weekdays || editor.entry.recurrence.weekdays.length === 0)
    ) {
      setError("Choose at least one weekday.");
      document.getElementById("commitment-weekdays")?.focus();
      return;
    }
    if (
      editor.entry.recurrence.frequency === "timesPerUserWeek" &&
      (!Number.isInteger(editor.entry.recurrence.timesPerUserWeek) ||
        (editor.entry.recurrence.timesPerUserWeek ?? 0) <= 0)
    ) {
      setError("Enter a positive whole number of times per user-week.");
      document.getElementById("commitment-times-per-user-week")?.focus();
      return;
    }
    const entry = {
      ...editor.entry,
      template: {
        ...editor.entry.template,
        title: editor.entry.template.title.trim(),
        updatedAt: new Date().toISOString(),
      },
    };
    if (editor.mode === "edit") {
      setDraft((current) => ({
        ...current,
        templateEntries: current.templateEntries.map((item) =>
          item.template.id === editor.originalId ? entry : item,
        ),
      }));
      closeEditor(editor.originalId);
      return;
    }
    setDraft((current) => {
      let next = { ...current, templateEntries: [...current.templateEntries, entry] };
      next = recordSetupDraftSourceCreated(
        next,
        createSetupDraftSourceReference("blockTemplate", entry.template.id),
      );
      return recordSetupDraftSourceCreated(
        next,
        createSetupDraftSourceReference("blockRecurrence", entry.recurrence.id),
      );
    });
    closeEditor(entry.template.id);
  }

  return (
    <section aria-labelledby="commitments-heading" className="df-panel df-form-stack">
      <div className="df-section-heading-row">
        <div>
          <h2 id="commitments-heading" ref={headingRef} tabIndex={-1}>
            Commitments
          </h2>
          <p className="df-support">The things you want DayFrame to make time for.</p>
        </div>
        <button className="df-action-button" type="button" onClick={openAddEditor}>
          Add Commitment
        </button>
      </div>
      {summaries.length === 0 ? (
        <p className="df-empty-state">
          Add the things you want DayFrame to make time for. Anchored calendar events remain in the
          calendar day workflow.
        </p>
      ) : (
        <ul className="df-commitment-list">
          {summaries.map((summary) => (
            <li className="df-list-card" key={summary.reference.logicalId}>
              <div className="df-section-heading-row">
                <div>
                  <h3>{summary.label}</h3>
                  <p className="df-support">
                    {summary.kind} · {summary.recurrence} · {summary.preferredTiming}
                    {summary.enabled ? "" : " · Disabled"}
                  </p>
                </div>
                <button
                  aria-label={`Edit commitment ${summary.label}`}
                  className="df-secondary-button"
                  id={`commitment-${summary.reference.logicalId}`}
                  type="button"
                  onClick={() => {
                    const source = draft.templateEntries.find(
                      (item) => item.template.id === summary.reference.logicalId,
                    )!;
                    returnFocusId.current = source.template.id;
                    editorDraftFingerprint.current = draftFingerprint(draft);
                    setEditor({
                      mode: "edit",
                      originalId: source.template.id,
                      entry: structuredClone(source),
                    });
                  }}
                >
                  Edit Commitment
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editor ? (
        <section
          aria-labelledby="commitment-editor-heading"
          className="df-inset-panel df-form-stack"
        >
          <h3 id="commitment-editor-heading">
            {editor.mode === "add" ? "Add Commitment" : `Edit ${editor.entry.template.title}`}
          </h3>
          <p className="df-support">
            Changes enter your Planner draft. Use Save Setup to persist them.
          </p>
          <div className="df-grid">
            <div className="df-field">
              <label htmlFor="commitment-title">Name</label>
              <input
                aria-describedby={
                  error === "Enter a commitment name." ? "commitment-title-error" : undefined
                }
                aria-invalid={error === "Enter a commitment name."}
                id="commitment-title"
                ref={titleRef}
                value={editor.entry.template.title}
                onChange={(event) => {
                  setError("");
                  setEditor({
                    ...editor,
                    entry: {
                      ...editor.entry,
                      template: { ...editor.entry.template, title: event.target.value },
                    },
                  });
                }}
              />
              {error === "Enter a commitment name." ? (
                <p className="df-danger-message" id="commitment-title-error">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="df-field">
              <label htmlFor="commitment-kind">Kind</label>
              <select
                aria-describedby={error ? "commitment-editor-error" : undefined}
                id="commitment-kind"
                value={editor.entry.template.category}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    entry: {
                      ...editor.entry,
                      template: {
                        ...editor.entry.template,
                        category: event.target.value as BlockCategory,
                      },
                    },
                  })
                }
              >
                {categories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="df-field">
              <label htmlFor="commitment-duration">Duration (minutes)</label>
              <input
                id="commitment-duration"
                min="1"
                type="number"
                value={editor.entry.template.durationMinutes}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    entry: {
                      ...editor.entry,
                      template: {
                        ...editor.entry.template,
                        durationMinutes: Number(event.target.value),
                      },
                    },
                  })
                }
              />
            </div>
            <div className="df-field">
              <label htmlFor="commitment-repeats">Repeats</label>
              <select
                id="commitment-repeats"
                value={editor.entry.recurrence.frequency}
                onChange={(event) => {
                  const frequency = event.target.value as RecurrenceFrequency;
                  const baseRecurrence = { ...editor.entry.recurrence };
                  delete baseRecurrence.weekdays;
                  delete baseRecurrence.timesPerUserWeek;
                  setError("");
                  setEditor({
                    ...editor,
                    entry: {
                      ...editor.entry,
                      recurrence: {
                        ...baseRecurrence,
                        frequency,
                        ...(frequency === "specificWeekdays" ? { weekdays: [] } : {}),
                      },
                    },
                  });
                }}
              >
                {!frequencies.includes(editor.entry.recurrence.frequency) ? (
                  <option disabled value={editor.entry.recurrence.frequency}>
                    {editor.entry.recurrence.frequency} (advanced; preserved)
                  </option>
                ) : null}
                {frequencies.map((value) => (
                  <option key={value} value={value}>
                    {value === "timesPerUserWeek" ? "Times per user-week" : value}
                  </option>
                ))}
              </select>
            </div>
            {editor.entry.recurrence.frequency === "specificWeekdays" ? (
              <fieldset
                aria-describedby={error ? "commitment-editor-error" : undefined}
                className="df-field"
                id="commitment-weekdays"
                tabIndex={-1}
              >
                <legend>Weekdays</legend>
                <div className="df-screen-actions">
                  {weekdays.map((weekday) => {
                    const selected = editor.entry.recurrence.weekdays?.includes(weekday) ?? false;
                    return (
                      <label className="df-checkbox-row" key={weekday}>
                        <input
                          checked={selected}
                          onChange={() => {
                            setError("");
                            const selectedDays = new Set(editor.entry.recurrence.weekdays ?? []);
                            if (selected) selectedDays.delete(weekday);
                            else selectedDays.add(weekday);
                            setEditor({
                              ...editor,
                              entry: {
                                ...editor.entry,
                                recurrence: {
                                  ...editor.entry.recurrence,
                                  weekdays: weekdays.filter((day) => selectedDays.has(day)),
                                },
                              },
                            });
                          }}
                          type="checkbox"
                        />
                        {weekday.charAt(0).toUpperCase() + weekday.slice(1)}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}
            {editor.entry.recurrence.frequency === "timesPerUserWeek" ? (
              <div className="df-field">
                <label htmlFor="commitment-times-per-user-week">Times per user-week</label>
                <input
                  aria-describedby={error ? "commitment-editor-error" : undefined}
                  id="commitment-times-per-user-week"
                  min="1"
                  onChange={(event) => {
                    setError("");
                    const baseRecurrence = { ...editor.entry.recurrence };
                    delete baseRecurrence.timesPerUserWeek;
                    const nextValue = event.target.value;
                    setEditor({
                      ...editor,
                      entry: {
                        ...editor.entry,
                        recurrence: {
                          ...baseRecurrence,
                          ...(nextValue === "" ? {} : { timesPerUserWeek: Number(nextValue) }),
                        },
                      },
                    });
                  }}
                  step="1"
                  type="number"
                  value={editor.entry.recurrence.timesPerUserWeek ?? ""}
                />
              </div>
            ) : null}
            <div className="df-field">
              <label htmlFor="commitment-time">Preferred time</label>
              <select
                id="commitment-time"
                value={editor.entry.template.preferredWindow}
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    entry: {
                      ...editor.entry,
                      template: {
                        ...editor.entry.template,
                        preferredWindow: event.target.value as PreferredWindow,
                      },
                    },
                  })
                }
              >
                {windows.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <label className="df-checkbox-row">
              <input
                checked={editor.entry.template.enabled}
                type="checkbox"
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    entry: {
                      ...editor.entry,
                      template: { ...editor.entry.template, enabled: event.target.checked },
                    },
                  })
                }
              />
              Enabled
            </label>
          </div>
          {error && error !== "Enter a commitment name." ? (
            <p className="df-danger-message" id="commitment-editor-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="df-screen-actions">
            <button className="df-action-button" type="button" onClick={commitEditor}>
              {editor.mode === "add" ? "Add to Plan" : "Update Commitment"}
            </button>
            <button
              className="df-secondary-button"
              type="button"
              onClick={() => closeEditor(returnFocusId.current ?? undefined)}
            >
              Cancel
            </button>
            {editor.mode === "edit" ? (
              <button
                className="df-secondary-button"
                type="button"
                onClick={() => setRemoveId(editor.originalId!)}
              >
                Remove Commitment
              </button>
            ) : null}
          </div>
          {removeId ? (
            <div role="alert">
              <p>
                This removes the commitment from your planning setup. Save the setup, then refresh
                your schedule to see the change.
              </p>
              <div className="df-screen-actions">
                <button
                  className="df-danger-button"
                  type="button"
                  onClick={() => {
                    const source = draft.templateEntries.find(
                      (item) => item.template.id === removeId,
                    )!;
                    setDraft((current) => {
                      let next = {
                        ...current,
                        templateEntries: current.templateEntries.filter(
                          (item) => item.template.id !== removeId,
                        ),
                      };
                      next = recordSetupDraftSourceDeleted(
                        next,
                        createSetupDraftSourceReference("blockTemplate", source.template.id),
                      );
                      return recordSetupDraftSourceDeleted(
                        next,
                        createSetupDraftSourceReference("blockRecurrence", source.recurrence.id),
                      );
                    });
                    setRemoveId(null);
                    closeEditor();
                  }}
                >
                  Confirm Remove Commitment
                </button>
                <button
                  className="df-secondary-button"
                  type="button"
                  onClick={() => setRemoveId(null)}
                >
                  Keep Commitment
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}

function draftFingerprint(draft: SetupDraft): string {
  return [
    ...draft.templateEntries.map(
      (entry) =>
        `${entry.template.id}:${getIncarnationId(entry.template) ?? ""}:${entry.recurrence.id}:${getIncarnationId(entry.recurrence) ?? ""}`,
    ),
    ...draft.shiftDefinitions.map((source) => source.id),
    ...draft.shiftCycles.map((source) => source.id),
  ].join("|");
}

function getIncarnationId(value: object): string | undefined {
  return "incarnationId" in value && typeof value.incarnationId === "string"
    ? value.incarnationId
    : undefined;
}
