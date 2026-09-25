const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function parseResponse(response) {
  if (!response.ok) {
    let detail = `API request failed: ${response.status}`;

    try {
      const data = await response.json();

      if (data?.detail) {
        detail = data.detail;
      }
    } catch {
      
    }

    throw new Error(detail);
  }

  return response.json();
}

export async function apiGet(endpoint, getIdToken = null) {
  const headers = {};

  if (getIdToken) {
    const token = await getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  return parseResponse(response);
}

export async function apiPost(endpoint, data, getIdToken = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (getIdToken) {
    const token = await getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}