import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, loginAdmin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(({ data }) => setAdmin(data))
      .catch(() => {
        localStorage.clear();
        sessionStorage.clear();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password, keepLoggedIn }) => {
    const { data } = await loginAdmin({ email, password });
    const store = keepLoggedIn ? localStorage : sessionStorage;
    store.setItem("access", data.access);
    store.setItem("refresh", data.refresh);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
