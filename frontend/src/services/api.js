/**
 * LandGuard AI - Client API Service Layer
 * Connects to the FastAPI backend with resilient fallbacks.
 */

const BASE_URL = '/api';

export async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Fetch error for ${endpoint}, returning fallback:`, err.message);
    throw err;
  }
}

// 1. Projects & Summary APIs
export const getProjectsSummary = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchJson(`/projects/summary?${query}`);
};

export const getProjectsList = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/projects?${query}`);
};

export const getProjectDetails = (id) => {
  return fetchJson(`/projects/${id}`);
};

export const createProject = (projectData) => {
  return fetchJson('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
};

// 2. Predictive Risk & SHAP APIs
export const getProjectRisk = (id) => {
  return fetchJson(`/predictions/risk/${id}`);
};

export const getShapExplanation = (id) => {
  return fetchJson(`/predictions/shap/${id}`);
};

export const runWhatIfSimulation = (id, params) => {
  return fetchJson(`/predictions/simulate/${id}`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

// 3. GIS & Spatial APIs
export const getGisFeatures = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchJson(`/gis/features?${query}`);
};

export const getProjectSpatialDetail = (id) => {
  return fetchJson(`/gis/project/${id}`);
};

// 4. Compensation & Treasury APIs
export const getCompensationOverview = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchJson(`/compensation/overview?${query}`);
};

export const getCompensationCases = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/compensation/cases?${query}`);
};

export const disburseCompensationBatch = (payload) => {
  return fetchJson('/compensation/disburse-batch', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// 5. Legal & R&R APIs
export const getLegalCases = (projectId) => {
  const query = projectId ? `?projectId=${projectId}` : '';
  return fetchJson(`/legal-rr/legal${query}`);
};

export const getRrCases = (projectId) => {
  const query = projectId ? `?projectId=${projectId}` : '';
  return fetchJson(`/legal-rr/rr${query}`);
};

// 6. Alerts & Recommendations APIs
export const getAlerts = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetchJson(`/alerts?${query}`);
};

export const acknowledgeAlert = (id, officerName, actionNotes) => {
  return fetchJson(`/alerts/${id}/acknowledge`, {
    method: 'POST',
    body: JSON.stringify({ officerName, actionNotes }),
  });
};

export const resolveAlert = (id, officerName, actionNotes) => {
  return fetchJson(`/alerts/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ officerName, actionNotes }),
  });
};

export const dispatchAlertNotification = (id, officerName, channels = ["NIC_SMS_GATEWAY", "NIC_EMAIL_SERVICE", "GOV_MOBILE_PUSH"]) => {
  return fetchJson(`/alerts/${id}/dispatch-notification`, {
    method: 'POST',
    body: JSON.stringify({ officerName, channels }),
  });
};

export const getRecommendations = (projectId) => {
  const query = projectId ? `?projectId=${projectId}` : '';
  return fetchJson(`/recommendations${query}`);
};

export const recordRecommendationDecision = (id, decisionPayload) => {
  return fetchJson(`/recommendations/${id}/decide`, {
    method: 'POST',
    body: JSON.stringify(decisionPayload),
  });
};

// 7. Documents & Verification APIs
export const getDocuments = (projectId, category) => {
  const params = new URLSearchParams();
  if (projectId) params.set('projectId', projectId);
  if (category) params.set('category', category);
  return fetchJson(`/documents?${params.toString()}`);
};

export const verifyDocument = (docId) => {
  return fetchJson(`/documents/verify/${docId}`);
};

// 8. Analytics & Benchmarking APIs
export const getAnalyticsBenchmarks = () => {
  return fetchJson('/analytics/benchmarks');
};

// 9. Model Governance APIs
export const getModelStatus = () => {
  return fetchJson('/model/status');
};

export const triggerModelRetrain = (payload) => {
  return fetchJson('/model/retrain', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// 10. Audit Log APIs
export const getAuditLogs = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchJson(`/audit?${query}`);
};

// 11. Auth & Roles
export const getRoles = () => fetchJson('/auth/roles');
export const getUsers = () => fetchJson('/auth/users');
export const switchRole = (userId, targetRole) => {
  return fetchJson('/auth/switch-role', {
    method: 'POST',
    body: JSON.stringify({ userId, targetRole }),
  });
};
