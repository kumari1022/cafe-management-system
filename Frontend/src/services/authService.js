import api from "./api";

export const authService = {
  login: (payload) => api.post("/user/login", payload),
  signup: (payload) => api.post("/user/signup", payload),
  forgotPassword: (payload) => api.post("/user/forgotPassword", payload),
  checkToken: () => api.get("/user/checkToken"),
};
