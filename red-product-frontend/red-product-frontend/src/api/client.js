import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Attache le token d'accès à chaque requête
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access") || sessionStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rafraîchit automatiquement le token si expiré (401)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/auth/login/refresh/`, { refresh });
          const store = localStorage.getItem("refresh") ? localStorage : sessionStorage;
          store.setItem("access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return client(original);
        } catch (refreshError) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
