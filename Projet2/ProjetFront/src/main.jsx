import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import App from "./App.jsx";
import { isApiRequestUrl, normalizeApiUrl } from "./services/apiConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const queryClient = new QueryClient();

axios.interceptors.request.use((config) => {
  const resolvedUrl = normalizeApiUrl(config.url);
  if (resolvedUrl) {
    config.url = resolvedUrl;
  }

  if (isApiRequestUrl(config.url)) {
    const token = localStorage.getItem("API_TOKEN");
    if (token) {
      config.headers = config.headers || {};
      const existingAuth =
        config.headers.Authorization || config.headers.authorization;
      if (
        !existingAuth ||
        existingAuth === "Bearer null" ||
        existingAuth === "Bearer undefined"
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  return config;
});

const originalFetch = window.fetch;
window.fetch = (input, init = {}) => {
  const rawUrl = typeof input === "string" ? input : input?.url;
  const resolvedUrl = normalizeApiUrl(rawUrl);

  let finalInput = input;
  if (typeof input === "string") {
    finalInput = resolvedUrl;
  } else if (input instanceof Request && resolvedUrl && resolvedUrl !== rawUrl) {
    finalInput = new Request(resolvedUrl, input);
  }

  let finalInit = init;
  if (isApiRequestUrl(resolvedUrl)) {
    const token = localStorage.getItem("API_TOKEN");
    if (token) {
      const headers = new Headers(
        init.headers || (input instanceof Request ? input.headers : undefined)
      );
      const existingAuth = headers.get("Authorization");
      if (
        !existingAuth ||
        existingAuth === "Bearer null" ||
        existingAuth === "Bearer undefined"
      ) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      finalInit = { ...init, headers };
    }
  }

  return originalFetch(finalInput, finalInit);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);

