import axios from "axios";
import { API_BASE_URL, isApiRequestUrl, normalizeApiUrl } from "./apiConfig";

const withBaseUrl = (url) => {
  if (!url) return API_BASE_URL;

  // Relative API paths used across the app (e.g. "/employes", "/postes")
  // should resolve to `${API_BASE_URL}/...`.
  if (typeof url === "string" && !/^https?:\/\//i.test(url)) {
    if (url === "/api" || url.startsWith("/api/") || url === "api" || url.startsWith("api/")) {
      return normalizeApiUrl(url);
    }

    if (url.startsWith("/")) {
      return `${API_BASE_URL}${url}`;
    }

    return `${API_BASE_URL}/${url}`;
  }

  return normalizeApiUrl(url);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("API_TOKEN");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const buildHeaders = (resolvedUrl, configHeaders) => {
  if (!isApiRequestUrl(resolvedUrl)) {
    return { ...(configHeaders || {}) };
  }
  return { ...getAuthHeaders(), ...(configHeaders || {}) };
};

const apiClient = {
  get: (url, config = {}) => {
    const resolvedUrl = withBaseUrl(url);
    const headers = buildHeaders(resolvedUrl, config.headers);
    return axios.get(resolvedUrl, { ...config, headers });
  },
  post: (url, data, config = {}) => {
    const resolvedUrl = withBaseUrl(url);
    const headers = buildHeaders(resolvedUrl, config.headers);
    return axios.post(resolvedUrl, data, { ...config, headers });
  },
  put: (url, data, config = {}) => {
    const resolvedUrl = withBaseUrl(url);
    const headers = buildHeaders(resolvedUrl, config.headers);
    return axios.put(resolvedUrl, data, { ...config, headers });
  },
  delete: (url, config = {}) => {
    const resolvedUrl = withBaseUrl(url);
    const headers = buildHeaders(resolvedUrl, config.headers);
    return axios.delete(resolvedUrl, { ...config, headers });
  },
};

export default apiClient;
