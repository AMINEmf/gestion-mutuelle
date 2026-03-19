import apiClient from "./apiClient";

export const getDepartementsHierarchy = () => apiClient.get("/departements/hierarchy");
