export type PlanId = "free" | "starter" | "agency";

export interface PlanMeta {
  id: PlanId;
  name: string;
  limit: number;
  label: string;
  badgeTone: "gray" | "emerald" | "indigo";
  colorClass: string;
}

export const PLAN_LIMITS: Record<PlanId, number> = {
  free: 1,
  starter: 5,
  // Use a very high finite number to avoid JSON serialisation issues with Infinity
  agency: Number.MAX_SAFE_INTEGER,
};

export const PLAN_META: Record<PlanId, PlanMeta> = {
  free: {
    id: "free",
    name: "Free",
    limit: PLAN_LIMITS.free,
    label: "Free Plan",
    badgeTone: "gray",
    colorClass: "bg-zinc-100 text-zinc-700",
  },
  starter: {
    id: "starter",
    name: "Starter",
    limit: PLAN_LIMITS.starter,
    label: "Starter Plan",
    badgeTone: "emerald",
    colorClass: "bg-emerald-50 text-emerald-700",
  },
  agency: {
    id: "agency",
    name: "Agency",
    limit: PLAN_LIMITS.agency,
    label: "Agency Plan",
    badgeTone: "indigo",
    colorClass: "bg-indigo-50 text-indigo-700",
  },
};

export function getPlanId(value?: string | null): PlanId {
  if (value === "starter" || value === "agency") return value;
  return "free";
}

export function getPlanLimit(plan: PlanId): number {
  return PLAN_LIMITS[plan];
}

export function getPlanMeta(plan: PlanId): PlanMeta {
  return PLAN_META[plan];
}
