import api from "./api";

export const dashboardService = {
  getDetails: () => api.get("/dashboard/details"),
};
