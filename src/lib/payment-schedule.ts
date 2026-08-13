export interface PlanSchedule {
  /** The plan's fixed term length in months (always 3 or 12). */
  term: number;
  /** Number of monthly payments after the deposit (0 if paid in full, else === term). */
  payMonths: number;
  /** Dollar amount of each payment after the deposit, in order. Length === payMonths. */
  schedule: number[];
}

/**
 * The term length is fixed to the plan (3 or 12 months) regardless of
 * deposit size — the deposit is a separate upfront payment, due before
 * work begins. Whatever remains after the deposit splits as evenly as
 * possible across the full term, so deposit + every monthly payment sums
 * exactly to `total`.
 */
export function computeSchedule(total: number, deposit: number, term: number): PlanSchedule {
  const remaining = total - deposit;
  if (remaining <= 0) {
    return { term, payMonths: 0, schedule: [] };
  }

  const base = Math.floor(remaining / term);
  const remainder = remaining - base * term;
  const schedule = Array.from({ length: term }, (_, i) => base + (i < remainder ? 1 : 0));

  return { term, payMonths: term, schedule };
}

export function planTotal(plan: "3mo" | "12mo"): number {
  return plan === "3mo" ? 5000 : 18000;
}

export function planTermMonths(plan: "3mo" | "12mo"): number {
  return plan === "3mo" ? 3 : 12;
}
