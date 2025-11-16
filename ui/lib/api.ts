import Constants from "expo-constants";

function resolveHostFromExpo(): string | null {
  // For Expo dev, hostUri / debuggerHost usually looks like "192.168.x.x:19000"
  const manifest = (Constants as any).manifest;
  const manifest2 = (Constants as any).manifest2;
  const expoConfig = (Constants as any).expoConfig;

  const hostUri =
    expoConfig?.hostUri ??
    manifest2?.extra?.expoClient?.hostUri ??
    manifest?.debuggerHost ??
    manifest?.hostUri;

  if (typeof hostUri !== "string") return null;
  const host = hostUri.split(":")[0];
  if (!host) return null;
  return host;
}

const devHost = resolveHostFromExpo();

const API_BASE_URL: string =
  (Constants.expoConfig?.extra as any)?.backendUrl ??
  process.env.EXPO_PUBLIC_BACKEND_URL ??
  (devHost ? `http://${devHost}:8000` : "http://localhost:8000");

export type StudentProfile = {
  student: any;
  budgets: any[];
  recent_transactions: any[];
  leaderboard_position: any | null;
};

export async function fetchStudentProfile(
  studentId: number,
): Promise<StudentProfile> {
  const res = await fetch(`${API_BASE_URL}/students/${studentId}/profile`);
  if (!res.ok) {
    throw new Error(`Failed to load profile (${res.status})`);
  }
  return res.json();
}

export async function updateBudgetLimit(
  budgetId: number,
  limitAmount: number,
) {
  const url = new URL(`${API_BASE_URL}/budgets/${budgetId}`);
  url.searchParams.set('limit_amount', String(limitAmount));

  const res = await fetch(url.toString(), {
    method: 'PUT',
  });

  if (!res.ok) {
    throw new Error(`Failed to update budget (${res.status})`);
  }
  return res.json();
}

export async function createTransaction(userId: number, payload: any) {
  const url = new URL(`${API_BASE_URL}/transactions/`);
  url.searchParams.set("user_id", String(userId));

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create transaction (${res.status})`);
  }
  return res.json();
}

export type PurchaseAdvice = {
  status: "GO" | "CAREFUL" | "NOPE";
  message: string;
  suggestion?: string;
};

export async function askPurchaseAdvice(
  userId: string,
  message: string,
): Promise<PurchaseAdvice> {
  const res = await fetch(`${API_BASE_URL}/ai/advice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: Number(userId),
      message,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = (data as any)?.error ?? res.statusText;
    throw new Error(`AI request failed: ${detail}`);
  }

  return res.json();
}

export async function fetchDailyAdvice() {
  const res = await fetch(`${AI_BASE_URL}/advice/daily`);
  if (!res.ok) throw new Error("Failed to load daily advice");
  return res.json() as Promise<{ date: string; tip: string }>;
}


