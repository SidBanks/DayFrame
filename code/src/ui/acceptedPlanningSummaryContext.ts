export type AcceptedSummaryContext = {
  start: string;
  end: string;
  goal: string | null;
  iteration: string | null;
  fact: string | null;
  filter: "all" | "realized" | "acceptedButUnrealized" | "unknown";
  goalLimit: number;
  iterationLimit: number;
  factLimit: number;
};
/** Same seven local calendar labels as History; independent view scope, not a planning horizon. */
export function initialAcceptedSummaryContext(now: Date): AcceptedSummaryContext {
  const label = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  return {
    start: label(start),
    end: label(now),
    goal: null,
    iteration: null,
    fact: null,
    filter: "all",
    goalLimit: 10,
    iterationLimit: 10,
    factLimit: 10,
  };
}
