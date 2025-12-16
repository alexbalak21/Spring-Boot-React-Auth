import { useState } from "react";
import { useAuthorizedApi } from "./useAuthorizedApi";
import { useAuth } from "../context/AuthContext";   // use same context
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const api = useAuthorizedApi();
  const { clearAccessToken } = useAuth();   // unified
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Logout failed");
    } finally {
      clearAccessToken();   // clears token in AuthContext
      setUser(null);        // clears cached user
      setLoading(false);
      navigate("/");   // redirect to home page
    }
  };

  return { logout, loading, error } as const;
}
