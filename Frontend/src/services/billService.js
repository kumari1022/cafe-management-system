import api from "./api";

export const billService = {
  generate: (payload) => api.post("/bill/generateReport", payload),
  getAll: () => api.get("/bill/getBills"),
  getPdf: (payload) => api.post("/bill/getPdf", payload, { responseType: "blob" }),
  remove: (id) => api.post(`/bill/delete/${id}`),
};
