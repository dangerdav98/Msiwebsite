export interface PlanSchedule {
  months: number;
  payMonths: number;
  /** Dollar amount of each payment after the deposit, in order. */
  schedule: number[];
}

/**
 * Computes the payment schedule for a plan: how many total months (deposit
 * counts as month 1), and how the remaining balance splits across the
 * subsequent months. The split is as even as possible (differs by at most
 * $1 between payments) so deposit + every subsequent payment sums exactly
 * to `total`.
 */
export function computeSchedule(total: number, deposit: number, cap: number): PlanSchedule {
  const remaining = total - deposit;
  let months = remaining <= 0 ? 1 : Math.ceil(remaining / deposit) + 1;
  if (months > cap) months = cap;
  if (months < 1 || !isFinite(months)) months = 1;
  const payMonths = months - 1;

  let schedule: number[] = [];
  if (payMonths > 0) {
    const base = Math.floor(remaining / payMonths);
    const remainder = remaining - base * payMonths;
    schedule = Array.from({ length: payMonths }, (_, i) => base + (i < remainder ? 1 : 0));
  }

  return { months, payMonths, schedule };
}

export function planTotal(plan: "3mo" | "12mo"): number {
  return plan === "3mo" ? 5000 : 18000;
}

export function planCap(plan: "3mo" | "12mo"): number {
  return plan === "3mo" ? 12 : 24;
}
