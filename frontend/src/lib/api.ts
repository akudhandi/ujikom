import type {
  AuthUser,
  DashboardData,
  FacultyItem,
  StudentItem,
  StudentListResponse,
  StudentPayload,
} from "@/types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const TOKEN_STORAGE_KEY = "ucn_admin_token";
const USER_STORAGE_KEY = "ucn_admin_user";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredSession();
    }
    throw new ApiError(
      payload?.message ?? `Permintaan ke server gagal (${response.status}).`,
      response.status,
      payload?.errors,
    );
  }

  return payload as T;
}

export async function getDashboardHealth(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/api/health");
}

export async function fetchDashboardData(): Promise<DashboardData> {
  return apiRequest<DashboardData>("/api/dashboard");
}

export async function fetchFaculties(): Promise<FacultyItem[]> {
  const res = await apiRequest<{ data: FacultyItem[] }>("/api/faculties");
  return res.data;
}

export async function loginAdmin(identifier: string, password: string): Promise<{ token: string; user: AuthUser }> {
  try {
    await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
      credentials: "include",
    });
  } catch {
    // Abaikan jika csrf-cookie tidak diperlukan pada mode token
  }

  const res = await apiRequest<{ message: string; token: string; user: AuthUser }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  setStoredSession(res.token, res.user);
  return res;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await apiRequest<{ message: string }>("/api/logout", {
      method: "POST",
    });
  } finally {
    clearStoredSession();
  }
}

export async function fetchCurrentAdmin(): Promise<AuthUser | null> {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  try {
    const res = await apiRequest<{ user: AuthUser }>("/api/me");
    setStoredSession(token, res.user);
    return res.user;
  } catch {
    return null;
  }
}

export async function fetchAdminStudents(params: {
  search?: string;
  status?: string;
  faculty_id?: string | number;
  study_program_id?: string | number;
  gender?: string;
  page?: number;
  per_page?: number;
}): Promise<StudentListResponse> {
  const query = new URLSearchParams();
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.status) {
    query.set("status", params.status);
  }
  if (params.faculty_id) {
    query.set("faculty_id", String(params.faculty_id));
  }
  if (params.study_program_id) {
    query.set("study_program_id", String(params.study_program_id));
  }
  if (params.gender) {
    query.set("gender", params.gender);
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.per_page) {
    query.set("per_page", String(params.per_page));
  }

  const qs = query.toString();
  return apiRequest<StudentListResponse>(`/api/admin/students${qs ? `?${qs}` : ""}`);
}

export async function fetchAdminStudent(id: string | number): Promise<StudentItem> {
  const res = await apiRequest<{ data: StudentItem }>(`/api/admin/students/${id}`);
  return res.data;
}

export async function createAdminStudent(payload: StudentPayload): Promise<{ message: string; data: StudentItem }> {
  return apiRequest<{ message: string; data: StudentItem }>("/api/admin/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminStudent(
  id: string | number,
  payload: StudentPayload,
): Promise<{ message: string; data: StudentItem }> {
  return apiRequest<{ message: string; data: StudentItem }>(`/api/admin/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminStudentStatus(
  id: string | number,
  status: "active" | "inactive",
): Promise<{ message: string; data: StudentItem }> {
  return apiRequest<{ message: string; data: StudentItem }>(`/api/admin/students/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
