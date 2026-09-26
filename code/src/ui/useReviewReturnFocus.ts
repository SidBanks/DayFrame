import { useEffect, useRef, type SyntheticEvent } from "react";
import type { GoalEditingContext } from "./goalEditingContext.js";

/** Session-only focus intent. Keys identify presentation controls, never command targets. */
export function useReviewReturnFocus(context: GoalEditingContext, attention: boolean) {
  const root = useRef<HTMLDivElement>(null);
  const cell = context.cell("review-return-focus", () => ({ key: "", section: "" }));
  useEffect(() => {
    if (attention || !root.current) return;
    const intent = cell.get();
    if (!intent.key) {
      document.getElementById("review-schedule-heading")?.focus();
      return;
    }
    // The original control may arrive after the qualified Review query resolves.
    const observer = new MutationObserver(restore);
    function restore() {
      if (!context.isValid() || !root.current) return;
      const target = [...root.current.querySelectorAll<HTMLElement>("[data-review-return]")].find(
        (element) => element.dataset.reviewReturn === intent.key,
      );
      if (!target && root.current.querySelector('[aria-busy="true"]')) return;
      const destination = target ?? document.getElementById(intent.section);
      if (!destination) return;
      observer.disconnect();
      if (!target) destination.tabIndex = -1;
      destination.focus();
    }
    observer.observe(root.current, { childList: true, subtree: true });
    restore();
    return () => observer.disconnect();
  }, []);
  function remember(event: SyntheticEvent) {
    const element = (event.target as Element).closest<HTMLElement>("[data-review-return]");
    if (!element || !root.current?.contains(element)) return;
    cell.update({
      key: element.dataset.reviewReturn!,
      section: element.dataset.reviewSection ?? "review-readiness-heading",
    });
  }
  return { ref: root, onClickCapture: remember, onFocusCapture: remember };
}
