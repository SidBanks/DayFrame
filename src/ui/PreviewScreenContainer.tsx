import { useSyncExternalStore, type ReactElement } from "react";

import { resolveEffectiveSchedulePreferencesForUserDayDate } from "../core/cycles/resolveEffectiveSchedulePreferences.js";
import type { ApplyPreviewFixActionInput, DayFrameStore } from "../state/types.js";
import { PreviewScreen } from "./PreviewScreen.js";

export type PreviewScreenStore = Pick<
  DayFrameStore,
  "getState" | "subscribe" | "applySuggestedFixToPreview"
>;

export type PreviewScreenContainerProps = {
  store: PreviewScreenStore;
  getRevisedAt?: () => string;
  getNow?: () => Date;
};

export function PreviewScreenContainer({
  store,
  getRevisedAt = createIsoTimestamp,
  getNow = () => new Date(),
}: PreviewScreenContainerProps): ReactElement {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

  return (
    <PreviewScreen
      getDayBoundaryStartTimeForUserDayDate={(userDayDate) =>
        resolveEffectiveSchedulePreferencesForUserDayDate({
          shiftCycle: state.shiftCycle,
          defaultSchedulingPreferences: state.schedulingPreferences,
          userDayDate: userDayDate as `${number}-${number}-${number}`,
        }).dayBoundaryStartTime
      }
      now={getNow()}
      preview={state.preview}
      onApplySuggestedFix={(input) => {
        store.applySuggestedFixToPreview({
          ...input,
          revisedAt: getRevisedAt(),
        });
      }}
    />
  );
}

function createIsoTimestamp(): ApplyPreviewFixActionInput["revisedAt"] {
  return new Date().toISOString();
}
