const API_BASE = "/api/applications";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

const buildQuery = ({ search, status } = {}) => {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const listApplications = async (filters = {}) => {
  const response = await fetch(`${API_BASE}${buildQuery(filters)}`);
  return parseResponse(response);
};

export const getApplication = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  return parseResponse(response);
};

export const createApplication = async (application) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  });

  return parseResponse(response);
};

export const updateApplication = async (id, application) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(application)
  });

  return parseResponse(response);
};

export const deleteApplication = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE"
  });

  return parseResponse(response);
};
