const API_BASE_URL = "http://localhost:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("bugtrack_token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep default error message if response is not JSON.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return handleResponse(response);
}

export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  return handleResponse(response);
}

export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export async function createProject(name) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      name,
    }),
  });

  return handleResponse(response);
}

export async function getSummary(projectId) {
  const params = new URLSearchParams();

  if (projectId) {
    params.append("project_id", projectId);
  }

  const response = await fetch(`${API_BASE_URL}/api/summary?${params.toString()}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export async function getReports(projectId, filters = {}) {
  const params = new URLSearchParams();

  if (projectId) params.append("project_id", projectId);
  if (filters.status) params.append("status", filters.status);
  if (filters.severity) params.append("severity", filters.severity);
  if (filters.type) params.append("type", filters.type);

  const response = await fetch(`${API_BASE_URL}/api/reports?${params.toString()}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export async function getReportById(reportId) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export async function updateReportStatus(reportId, status) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      status,
    }),
  });

  return handleResponse(response);
}

export async function deleteReport(reportId) {
  const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export async function deleteProject(projectId) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response);
}

export function saveToken(token) {
  localStorage.setItem("bugtrack_token", token);
}

export function getToken() {
  return localStorage.getItem("bugtrack_token");
}

export function logout() {
  localStorage.removeItem("bugtrack_token");
}