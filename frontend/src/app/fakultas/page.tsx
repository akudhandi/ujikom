import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { fetchDashboardData } from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";

export const dynamic = "force-dynamic";

type FakultasPageProps = {
  searchParams?: Promise<{ q?: string; faculty?: string }>;
};

export default async function FakultasPage({ searchParams }: FakultasPageProps) {
  const params = searchParams ? await searchParams : {};
  let initialData: DashboardData | null = null;
  let apiReady = false;

  try {
    initialData = await fetchDashboardData();
    apiReady = true;
  } catch {
    initialData = null;
    apiReady = false;
  }

  return (
    <DashboardShell
      apiReady={apiReady}
      initialData={initialData}
      initialFacultyCode={params?.faculty?.toUpperCase() ?? "ALL"}
      initialSearch={params?.q ?? ""}
      section="fakultas"
    />
  );
}
