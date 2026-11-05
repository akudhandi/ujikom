import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardHealth } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let apiReady = false;

  try {
    await getDashboardHealth();
    apiReady = true;
  } catch {
    apiReady = false;
  }

  return <DashboardShell apiReady={apiReady} />;
}
