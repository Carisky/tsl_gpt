export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return (await res.json()) as T;
}
