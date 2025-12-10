import { useState } from "react";
import { useAuthorizedApi } from "./useAuthorizedApi";
import { useAuthToken } from "./useAuthToken";

export function useLogout() {
  const api = useAuthorizedApi();
  const { clearAccessToken } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      // call server logout endpoint (optional for stateless JWT)
      await api.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err: any) {
      // ignore server errors for logout, but record if useful
      setError(err?.response?.data?.message || err?.message || "Logout failed");
    } finally {
      // Always clear the token client-side
      clearAccessToken();
      setLoading(false);
      // Redirect to login page (client-side route)
      try {
        window.location.href = "/login";
      } catch (e) {
        // no-op
      }
    }
  };

  return { logout, loading, error } as const;
}
