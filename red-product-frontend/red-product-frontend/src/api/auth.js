import client from "./client";

export const registerAdmin = (payload) =>
  client.post("/auth/register/", payload);

export const loginAdmin = (payload) => client.post("/auth/login/", payload);

export const forgotPassword = (email) =>
  client.post("/auth/forgot-password/", { email });

export const resetPassword = (payload) =>
  client.post("/auth/reset-password/", payload);

export const fetchMe = () => client.get("/auth/me/");

export const updateProfile = (formData) =>
  client.patch("/auth/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePassword = (payload) =>
  client.post("/auth/change-password/", payload);

export const fetchAdminCount = () => client.get("/auth/count/");
