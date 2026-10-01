export async function apiRequest(
  url,
  options = {},
  { throwOnError = true } = {},
) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (!throwOnError) return null;
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export function jsonRequest(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
