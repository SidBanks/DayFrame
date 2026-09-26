import { useReviewReturnFocus } from "./useReviewReturnFocus.js";
import { scheduleReviewNavigation } from "./scheduleReviewNavigation.js";
import { ReviewTrial, type ReviewTrialContext } from "./ReviewTrial.js";
import { ReviewConflicts } from "./ReviewConflicts.js";
import { useEffect, useId, type ComponentProps } from "react";
import { addUserDayLabels } from "../core/time/canonicalUserDay.js";
import type { LocalDateString } from "../core/shifts/types.js";
import { createReviewScope } from "../core/planning/reviewScope.js";
import type { GoalEditingContext } from "./goalEditingContext.js";
import { useGoalEditingState } from "./useGoalEditingState.js";
import { ScheduleReviewPanel } from "./ScheduleReviewPanel.js";
import { PreviewScreen } from "./PreviewScreen.js";

export function ScheduleReviewWorkspace({
  context,
  review,
  preview,
  missingSetup,
  message,
  onOpenSetup,
  onDay,
  onGoal,
  attentionId,
  onAttentionHandled,
}: {
  attentionId?: string | null;
  onAttentionHandled?: () => void;
  context: GoalEditingContext;
  review: ComponentProps<typeof ScheduleReviewPanel>;
  preview: ComponentProps<typeof PreviewScreen>;
  missingSetup: string[];
  message: string;
  onOpenSetup: () => void;
  onDay: (day: string) => void;
  onGoal?: (id: string, range: { start: string; end: string }) => void;
}) {
  const returnFocus = useReviewReturnFocus(context, !!attentionId);
  const errorId = useId();
  const [view, update] = useGoalEditingState(context, "schedule-review-workspace", () => ({
    start: review.startUserDayDate,
    end: addUserDayLabels(review.endUserDayDateExclusive, -1),
    draftStart: review.startUserDayDate as string,
    draftEnd: addUserDayLabels(review.endUserDayDateExclusive, -1) as string,
    error: "",
    detailDay: preview.visibleRangeStartDate ?? review.startUserDayDate,
    detailDraft: preview.visibleRangeStartDate ?? review.startUserDayDate,
    detailError: "",
    detailMode: (preview.visibleRangeStartDate ? "selection" : "single") as
      | "single"
      | "selection"
      | "generated",
    detailEnd: preview.visibleRangeEndDate ?? review.startUserDayDate,
    detailPage: 0,
    externalSelection: `${preview.visibleRangeStartDate ?? ""}:${preview.visibleRangeEndDate ?? ""}`,
    detailsOpen: !!attentionId,
    trial: null as ReviewTrialContext | null,
  }));
  const externalSelection = `${preview.visibleRangeStartDate ?? ""}:${preview.visibleRangeEndDate ?? ""}`;
  useEffect(() => {
    if (externalSelection === view.externalSelection) return;
    update({
      externalSelection,
      detailPage: 0,
      detailsOpen: true,
      detailMode: preview.visibleRangeStartDate ? "selection" : "generated",
      detailDay: preview.visibleRangeStartDate ?? review.startUserDayDate,
      detailDraft: preview.visibleRangeStartDate ?? review.startUserDayDate,
      detailEnd: preview.visibleRangeEndDate ?? review.startUserDayDate,
    });
  }, [
    externalSelection,
    view.externalSelection,
    preview.visibleRangeStartDate,
    preview.visibleRangeEndDate,
    review.startUserDayDate,
    update,
  ]);
  useEffect(() => {
    if (!attentionId) return;
    if (!view.detailsOpen) {
      update({ detailsOpen: true });
      return;
    }
    const target = document.getElementById(`review-friction-${attentionId}`);
    if (target) {
      target.focus();
      target.scrollIntoView?.({ block: "center" });
      onAttentionHandled?.();
    }
  }, [attentionId, view.detailsOpen, preview.preview, onAttentionHandled, update]);
  const detailStart =
    view.detailMode === "generated"
      ? (preview.preview?.rangeStartDate ?? view.detailDay)
      : view.detailDay;
  const detailEnd =
    view.detailMode === "generated"
      ? (preview.preview?.rangeEndDate ?? view.detailDay)
      : view.detailMode === "selection"
        ? view.detailEnd
        : view.detailDay;
  const pageStart = addUserDayLabels(detailStart, view.detailPage * 10);
  const pageEnd =
    addUserDayLabels(pageStart, 9) < detailEnd ? addUserDayLabels(pageStart, 9) : detailEnd;
  const navigation = scheduleReviewNavigation(context);
  useEffect(() => {
    const range = navigation.get().range;
    if (!range) return;
    try {
      const scope = createReviewScope({
        kind: "custom",
        anchorUserDayDate: range.start as LocalDateString,
        weekStartsOn: review.weekStartsOn,
        source: "explicit",
        customRange: {
          startUserDayDate: range.start as LocalDateString,
          endUserDayDateExclusive: addUserDayLabels(range.end as LocalDateString, 1),
        },
      });
      if (addUserDayLabels(scope.endUserDayDateExclusive, -1) !== range.end)
        throw new RangeError("Invalid end date");
      update({
        start: scope.startUserDayDate,
        end: range.end as LocalDateString,
        draftStart: range.start,
        draftEnd: range.end,
        error: "",
      });
    } catch {
      update({
        draftStart: range.start,
        draftEnd: range.end,
        error: "The linked period is invalid. The previous review period is retained.",
      });
    }
    navigation.update({ range: null });
  }, [context, navigation, review.weekStartsOn, update]);
  function tryCorrection(input: Parameters<typeof preview.onApplySuggestedFix>[0]) {
    if (preview.preview && !preview.preview.isStale)
      update({
        trial: {
          original: preview.preview,
          frictionId: input.selectedFrictionPointId,
          fixId: input.selectedSuggestedFixId,
        },
      });
    preview.onApplySuggestedFix(input);
  }
  const corrections = (
    <>
      {view.trial && preview.preview?.revisedAt && (
        <ReviewTrial
          trial={view.trial}
          current={preview.preview}
          onDiscard={() => {
            update({ trial: null });
            review.onGeneratePreview();
          }}
        />
      )}

      <ReviewConflicts
        preview={preview.preview}
        context={context}
        onTry={tryCorrection}
        onInspect={(day) => {
          update({
            detailsOpen: true,
            detailMode: "single",
            detailPage: 0,
            ...(day
              ? {
                  detailDay: day as LocalDateString,
                  detailDraft: day as LocalDateString,
                  detailError: "",
                }
              : {}),
          });
          requestAnimationFrame(() =>
            document.getElementById("schedule-friction-heading")?.focus(),
          );
        }}
      />
      <details
        className="df-panel"
        open={view.detailsOpen}
        onToggle={(event) => {
          if (view.detailsOpen !== event.currentTarget.open)
            update({ detailsOpen: event.currentTarget.open });
        }}
      >
        <summary>Conflicts, corrections and schedule detail</summary>
        <label className="df-field">
          Review one user-day
          <input
            type="date"
            value={view.detailDraft}
            min={preview.preview?.rangeStartDate}
            max={preview.preview?.rangeEndDate}
            aria-invalid={!!view.detailError}
            aria-describedby={view.detailError ? errorId + "-day" : undefined}
            onChange={(event) => {
              const detailDraft = event.target.value as LocalDateString;
              try {
                createReviewScope({
                  kind: "day",
                  anchorUserDayDate: detailDraft,
                  weekStartsOn: review.weekStartsOn,
                });
                update({
                  detailDraft,
                  detailDay: detailDraft,
                  detailEnd: detailDraft,
                  detailMode: "single",
                  detailPage: 0,
                  detailError: "",
                });
              } catch {
                update({
                  detailDraft,
                  detailError: "Enter a valid day. The previous detail day is retained.",
                });
              }
            }}
          />
        </label>
        {view.detailError && (
          <p role="alert" id={errorId + "-day"}>
            {view.detailError}
          </p>
        )}
        <p>This detail filter does not change the Build period.</p>
        <button
          type="button"
          className="df-secondary-button"
          disabled={!view.detailDay}
          data-review-return="detail-day"
          data-review-section="schedule-friction-heading"
          onClick={() => onDay(view.detailDay)}
        >
          Open Daily Planner for {view.detailDay}
        </button>
        <button
          type="button"
          className="df-secondary-button"
          onClick={() => update({ detailMode: "generated", detailPage: 0 })}
        >
          Show generated period detail
        </button>
        {view.detailMode !== "single" && (
          <div className="df-screen-actions">
            <p>
              Detail page: {pageStart} through {pageEnd}. At most ten days are expanded.
            </p>
            <button
              type="button"
              className="df-secondary-button"
              disabled={view.detailPage === 0}
              onClick={() => update({ detailPage: view.detailPage - 1 })}
            >
              Previous detail days
            </button>
            <button
              type="button"
              className="df-secondary-button"
              disabled={pageEnd >= detailEnd}
              onClick={() => update({ detailPage: view.detailPage + 1 })}
            >
              Next detail days
            </button>
          </div>
        )}
        <PreviewScreen
          {...preview}
          onApplySuggestedFix={tryCorrection}
          visibleRangeStartDate={pageStart}
          visibleRangeEndDate={pageEnd}
        />
      </details>
    </>
  );
  return (
    <div {...returnFocus} className="df-screen df-workflow-block df-workflow-block--preview">
      <section className="df-panel">
        <h2 className="df-screen-title" id="review-schedule-heading" tabIndex={-1}>
          Review Schedule
        </h2>
        <p>
          Reviewing {view.start} through {view.end}, including both dates.
        </p>
        <form
          className="df-history-range"
          onSubmit={(event) => {
            event.preventDefault();
            try {
              const scope = createReviewScope({
                kind: "custom",
                anchorUserDayDate: view.draftStart as LocalDateString,
                weekStartsOn: review.weekStartsOn,
                source: "explicit",
                customRange: {
                  startUserDayDate: view.draftStart as LocalDateString,
                  endUserDayDateExclusive: addUserDayLabels(view.draftEnd as LocalDateString, 1),
                },
              });
              if (addUserDayLabels(scope.endUserDayDateExclusive, -1) !== view.draftEnd)
                throw new RangeError("Invalid end date");
              update({
                start: scope.startUserDayDate,
                end: view.draftEnd as LocalDateString,
                error: "",
              });
            } catch {
              update({
                error:
                  "Enter valid dates with the end on or after the start. The applied review period has not changed.",
              });
            }
          }}
        >
          <label className="df-field">
            Review start date
            <input
              type="date"
              data-review-return="range-start"
              value={view.draftStart}
              aria-invalid={!!view.error}
              aria-describedby={view.error ? errorId : undefined}
              onChange={(event) => update({ draftStart: event.target.value })}
            />
          </label>
          <label className="df-field">
            Review end date
            <input
              type="date"
              data-review-return="range-end"
              value={view.draftEnd}
              aria-invalid={!!view.error}
              aria-describedby={view.error ? errorId : undefined}
              onChange={(event) => update({ draftEnd: event.target.value })}
            />
          </label>
          <button className="df-secondary-button" type="submit">
            Apply review period
          </button>
        </form>
        {view.error && (
          <p id={errorId} role="alert">
            {view.error}
          </p>
        )}
        <p>
          Decisions and Build use saved planning information. Unrelated editor drafts are not saved
          by this review.
        </p>
        <div className="df-screen-actions">
          <button className="df-action-button" type="button" onClick={review.onGeneratePreview}>
            {preview.preview ? "Refresh Schedule" : "Generate Schedule"}
          </button>
          <button
            className="df-secondary-button"
            type="button"
            data-review-return="generation-setup"
            onClick={onOpenSetup}
          >
            Generation range and setup
          </button>
        </div>
        <p>
          Generation uses the saved generation range; changing the review period only changes what
          you inspect and build.
        </p>
        {message && <p role="status">{message}</p>}
        {missingSetup.length > 0 && (
          <div role="alert">
            <p>Finish setup before generating a schedule:</p>
            <ul>
              {missingSetup.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <ScheduleReviewPanel
        {...review}
        context={context}
        corrections={corrections}
        onDay={onDay}
        {...(onGoal
          ? { onGoal: (id: string) => onGoal(id, { start: view.start, end: view.end }) }
          : {})}
        startUserDayDate={view.start}
        endUserDayDateExclusive={addUserDayLabels(view.end, 1)}
        onOpenFriction={() => {
          update({ detailsOpen: true });
          requestAnimationFrame(() =>
            document.getElementById("schedule-friction-heading")?.focus(),
          );
        }}
      />
    </div>
  );
}
