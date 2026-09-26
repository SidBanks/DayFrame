import { useEffect, useState } from "react";
import type { DayFrameStore } from "../state/types.js";
import type { SetupDraftEntry } from "./setupDraft.js";
export type CommitmentRelationshipStore = Pick<
  DayFrameStore,
  "listCurrentAttachments" | "getCompositionIngressStatus" | "subscribeComposition"
>;
export function CommitmentRelationshipContext({
  store,
  entry,
  entries,
}: {
  store: CommitmentRelationshipStore;
  entry: SetupDraftEntry;
  entries: SetupDraftEntry[];
}) {
  const [, refresh] = useState(0);
  useEffect(() => {
    const unsubscribe = store.subscribeComposition(() => refresh((v) => v + 1));
    return () => {
      unsubscribe();
    };
  }, [store]);
  const status = store.getCompositionIngressStatus();
  if (status.status !== "accepted")
    return (
      <p role="status">
        Support relationships{" "}
        {status.status === "protected" ? "cannot currently be read safely" : "are loading"}. Editing
        this Commitment does not replace those relationships.
      </p>
    );
  const incarnation = "incarnationId" in entry.template ? entry.template.incarnationId : undefined;
  const links = store
    .listCurrentAttachments()
    .filter((r) =>
      [r.parent, r.child].some(
        (e) => e.sourceId === entry.template.id && e.incarnationId === incarnation,
      ),
    );
  if (!links.length) return null;
  return (
    <section>
      <h4>Support relationships</h4>
      <p>These links are preserved separately and are read-only here.</p>
      <ul>
        {links.map((r) => {
          const parent =
            r.parent.sourceId === entry.template.id && r.parent.incarnationId === incarnation;
          const other = parent ? r.child : r.parent;
          const name =
            entries.find(
              (e) =>
                e.template.id === other.sourceId &&
                "incarnationId" in e.template &&
                e.template.incarnationId === other.incarnationId,
            )?.template.title ?? "Source no longer available";
          return (
            <li key={r.id}>
              {parent ? "Supported by" : "Supports"} {name} · {r.requiredness} ·{" "}
              {r.timingStrictness}.
              <details>
                <summary>Relationship references</summary>
                <p>
                  {r.id} · revision {r.revision} · slot {r.slot}
                </p>
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
