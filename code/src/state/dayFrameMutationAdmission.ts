import type { DayFrameReadiness } from "./dayFrameReadiness.js";

export type DayFrameMutationAdmission =
  | { allowed: true }
  | {
      allowed: false;
      reason: "initializing" | "protected" | "authorityTransactionActive";
    };

export class DayFrameMutationAdmissionError extends Error {
  constructor(
    public readonly reason: Exclude<DayFrameMutationAdmission, { allowed: true }>["reason"],
  ) {
    super(`DayFrame mutation is blocked: ${reason}.`);
    this.name = "DayFrameMutationAdmissionError";
  }
}

export function getDayFrameMutationAdmission(
  readiness: DayFrameReadiness,
  transactionActive: boolean,
): DayFrameMutationAdmission {
  if (readiness.status === "initializing") return { allowed: false, reason: "initializing" };
  if (readiness.status === "protected") return { allowed: false, reason: "protected" };
  if (transactionActive) return { allowed: false, reason: "authorityTransactionActive" };
  return { allowed: true };
}
