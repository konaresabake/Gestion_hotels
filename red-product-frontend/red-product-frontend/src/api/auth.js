import client from "./client";

export const registerAdmin = (payload) =>
  client.post("/auth/register/", payload);

export const loginAdmin = (payload) => client.post("/auth/login/", payload);

export const forgotPassword = (email) =>
  client.post("/auth/forgot-password/", { email });

export const resetPassword = (payload) =>
  client.post("/auth/reset-password/", payload);

export const fetchMe = () => client.get("/auth/me/");

export const fetchAdminCount = () => client.get("/auth/count/");
