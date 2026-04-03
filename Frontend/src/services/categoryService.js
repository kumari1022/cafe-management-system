import api from "./api";

export const categoryService = {
  getAll: () => api.get("/category/get"),
  getFiltered: () => api.get("/category/get?filterValue=true"),
  add: (payload) => api.post("/category/add", payload),
  update: (payload) => api.post("/category/update", payload),
};
