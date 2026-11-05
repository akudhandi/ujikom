import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { fetchDashboardData } from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialData: DashboardData | null = null;
  let apiReady = false;

  try {
    initialData = await fetchDashboardData();
    apiReady = true;
  } catch {
    initialData = null;
    apiReady = false;
  }

  return <DashboardShell apiReady={apiReady} initialData={initialData} />;
}
