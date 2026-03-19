const DEFAULT_API_ORIGIN = "http://127.0.0.1:8001";

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const configuredApiOrigin = trimTrailingSlash(
  (import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN).trim()
);

export const API_ORIGIN = configuredApiOrigin;
export const API_BASE_URL = `${API_ORIGIN}/api`;

const LEGACY_API_ORIGINS = new Set([
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:5174",
]);

const clientOrigin =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "http://localhost";

const toUrl = (url) => {
  try {
    return new URL(url, clientOrigin);
  } catch {
    return null;
  }
};

const isApiPath = (pathname) => pathname === "/api" || pathname.startsWith("/api/");

export const isApiRequestUrl = (url) => {
  if (!url) return false;
  const parsed = toUrl(url);
  return Boolean(parsed && isApiPath(parsed.pathname));
};

export const normalizeApiUrl = (url) => {
  if (!url) return API_BASE_URL;

  if (url === "/api" || url.startsWith("/api/")) {
    return `${API_ORIGIN}${url}`;
  }

  if (url === "api" || url.startsWith("api/")) {
    return `${API_ORIGIN}/${url}`;
  }

  const parsed = toUrl(url);
  if (!parsed) return url;

  if (!isApiPath(parsed.pathname)) {
    return url;
  }

  if (LEGACY_API_ORIGINS.has(parsed.origin) || parsed.origin === clientOrigin) {
    return `${API_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
  }

  return url;
};
