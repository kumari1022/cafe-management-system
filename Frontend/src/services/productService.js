import api from "./api";

export const productService = {
  getAll: () => api.get("/product/get"),
  add: (payload) => api.post("/product/add", payload),
  update: (payload) => api.post("/product/update", payload),
  updateStatus: (payload) => api.post("/product/updateProductStatus", payload),
  remove: (id) => api.post(`/product/delete/${id}`),
  getByCategory: (id) => api.get(`/product/getByCategory/${id}`),
  getById: (id) => api.get(`/product/getProductById/${id}`),
  uploadImage: (formData) => api.post("/product/uploadImage", formData, { headers: { "Content-Type": "multipart/form-data" } }),
};
