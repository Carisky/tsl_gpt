export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";

export async function apiFetch<T = any>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && (data.message || JSON.stringify(data))) || res.statusText);
  }
  return data as T;
}

