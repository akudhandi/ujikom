const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getDashboardHealth(): Promise<{ message: string }> {
  const response = await fetch(`${apiUrl}/api/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("API Laravel tidak dapat dihubungi.");
  }

  return response.json();
}
