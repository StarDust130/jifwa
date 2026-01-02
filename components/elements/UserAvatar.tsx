import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getPlanContext } from "@/app/actions/plan";
import { getPlanId, getPlanMeta, PlanId } from "@/lib/plans";
import { UserNav } from "../pages/platform/UserNav";

const UserAvatar = () => {
  const { user, isLoaded } = useUser();
  const [plan, setPlan] = useState<PlanId>("free");
  const planMeta = getPlanMeta(plan);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const ctx = await getPlanContext();
        if (ctx?.plan) setPlan(getPlanId(ctx.plan));
      } catch (e) {
        // ignore and stay at default
      }
    };

    loadPlan();
  }, []);

  return (
    <div className="flex items-center gap-3 pl-3 ml-2 border-l border-gray-200/60 h-8">
      {isLoaded && user && (
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-sm font-bold text-gray-900 leading-none">
            {user.fullName || user.firstName}
          </span>
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mt-1">
            {planMeta.label}
          </span>
        </div>
      )}

      <div className="relative transition-all duration-200 hover:scale-105 hover:ring-4 hover:ring-gray-100 rounded-full">
        <UserNav />
      </div>
    </div>
  );
};

export default UserAvatar;
