import type { PlanType } from "./plans";
import { getRetentionDays } from "./plans";

/**
 * Returns the cutoff date for data visibility based on the user's plan.
 * Data older than this date should not be shown to the user.
 */
export function getRetentionCutoff(planType: PlanType): Date {
  const days = getRetentionDays(planType);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return cutoff;
}

/**
 * Returns the ISO string for use in Supabase queries.
 * Use with .gte("scraped_at", cutoffISO) to filter old data.
 */
export function getRetentionCutoffISO(planType: PlanType): string {
  return getRetentionCutoff(planType).toISOString();
}
