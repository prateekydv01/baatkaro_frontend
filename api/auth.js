import { api } from "./index.js";

export const loginUser = (data) => api.post("/user/login", data);
export const registerUser = (data) => api.post("/user/register", data);
export const logoutUser = () => api.post("/user/logout");
export const getCurrentUser = () => api.get("/user/current-user");
export const searchUsers = (username) =>api.get(`/user/search?username=${username}`);