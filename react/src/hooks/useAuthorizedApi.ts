// hooks/useAuthorizedApi.ts
import axios from "axios";
import { useMemo } from "react";

export function useAuthorizedApi() {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "/api",
    });

    // Always read the latest token from localStorage
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, []);

  return api;
}
