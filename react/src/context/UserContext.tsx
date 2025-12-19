import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import type { UserInfo, UserContextType } from "../types";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const { accessToken, clearAccessToken } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) {
        setUser(null);
        clearAccessToken();
        return;
      }
      try {
        const res = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err: any) {
        console.error("Failed to fetch user:", err);

        // If backend says Forbidden, flush everything
        if (err.response?.status === 403 || err.response?.status === 401) {
          setUser(null);
          clearAccessToken();
        } else {
          setUser(null);
        }
      }
    };

    fetchUser();
  }, [accessToken, clearAccessToken]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
