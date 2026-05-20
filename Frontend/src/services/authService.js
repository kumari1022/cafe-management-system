import api from "./api";

export const authService = {
  login: (payload) => api.post("/user/login", payload),
  signup: (payload) => api.post("/user/signup", payload),
  checkToken: () => api.get("/user/checkToken"),
  changePassword: (payload) => api.post("/user/changePassword", payload),
  getAllStaff: () => api.get("/user/staff/getAll"),
  addStaff: (payload) => api.post("/user/staff/add", payload),
  updateStaff: (payload) => api.post("/user/staff/update", payload),
  deleteStaff: (id) => api.post(`/user/staff/delete/${id}`),
};
