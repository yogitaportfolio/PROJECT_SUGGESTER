// src/api/apiFetch.js
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // ✅ If endpoint starts with http, don't prepend base URL
  const baseURL = endpoint.startsWith("http")
    ? ""
    : "https://api-ums.onebigbit.com";

  // ✅ Default to POST (since most UMS APIs use POST)
  const method = options.method || "POST";

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // ✅ Add JSON header only if body exists and not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseURL}${endpoint}`, {
    method,
    headers,
    ...(options.body ? { body: options.body } : {}),
  });

  // ✅ Handle JSON / non-JSON gracefully
  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    const message = result?.message || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return result;
}
