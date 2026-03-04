const FLASK_URL = process.env.FASTAPI_URL ?? "http://localhost:8000";

export async function flaskFetch(path, options = {}) {
  const res = await fetch(`${FLASK_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  return res;
}

export function getAuthHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}
