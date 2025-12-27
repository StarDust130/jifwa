import { getDashboardData } from "@/app/actions/dashboard";
import DashboardClient from "@/components/pages/dashboard/dashboard-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/sign-in");
  }

  return <DashboardClient data={data} />;
}
