import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
  authenticated: boolean;
  refreshAccessToken: () => Promise<string | null>;
  apiClient: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  });

  // Track refresh state and promise at module level to prevent multiple refreshes
  const isRefreshing = useRef(false);
  const refreshPromise = useRef<Promise<string | null> | null>(null);
  const refreshSubscribers = useRef<Array<(token: string | null) => void>>([]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token") {
        setAccessTokenState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setAccessToken = (token: string | null) => {
    try {
      if (token) {
        localStorage.setItem("access_token", token);
      } else {
        localStorage.removeItem("access_token");
      }
    } catch { }
    setAccessTokenState(token);
  };

  const clearAccessToken = useCallback(() => {
    // Clear the access token from memory and localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("access_token");
    }
    setAccessTokenState(null);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    // If we already have a refresh in progress, return the existing promise
    if (isRefreshing.current) {
      return new Promise((resolve) => {
        const unsubscribe = (token: string | null) => {
          const index = refreshSubscribers.current.indexOf(unsubscribe);
          if (index > -1) {
            refreshSubscribers.current.splice(index, 1);
          }
          resolve(token);
        };
        refreshSubscribers.current.push(unsubscribe);
      });
    }

    isRefreshing.current = true;

    try {
      console.log('[Auth] Refreshing access token...');
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Important for sending refresh token cookie
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Auth] Token refresh failed:', response.status, errorText);
        throw new Error(`Failed to refresh token: ${response.status} ${errorText}`);
      }

      const data = await response.json().catch(() => ({}));
      const newAccessToken = data.access_token || data.accessToken;

      if (!newAccessToken) {
        console.error('[Auth] No access token in refresh response:', data);
        throw new Error('No access token in response');
      }

      console.log('[Auth] Successfully refreshed access token');
      // Update the token in state and storage
      setAccessToken(newAccessToken);

      // Notify all waiting subscribers
      refreshSubscribers.current.forEach(cb => cb(newAccessToken));
      refreshSubscribers.current = [];

      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Notify all waiting subscribers of the error
      refreshSubscribers.current.forEach(cb => cb(null));
      refreshSubscribers.current = [];
      clearAccessToken();
      return null;
    } finally {
      isRefreshing.current = false;
    }
  }, [isRefreshing, clearAccessToken]);

  // Create an API client that automatically handles token refresh
  const apiClient = useCallback(
    async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
      // Convert URL object to string if needed
      const url = input instanceof URL ? input.toString() : input.toString();
      const isPublicEndpoint = ['/api/auth/refresh', '/api/csrf'].some(path =>
        url.includes(path)
      );

      // Create a clean headers object
      const headers = new Headers(init?.headers);

      // Helper function to make the actual request
      const makeRequest = async (token: string | null) => {
        // Create a new headers object for each request to avoid header pollution
        const requestHeaders = new Headers(init?.headers); // Start with original headers

        // Set the authorization header if we have a token and it's not a public endpoint
        if (token && !isPublicEndpoint) {
          requestHeaders.set('Authorization', `Bearer ${token}`);
        }

        // Ensure we include credentials for all requests
        const options: RequestInit = {
          ...init,
          headers: requestHeaders,
          credentials: 'include' as const,
        };

        return fetch(url, options);
      };

      // Make the initial request
      let response = await makeRequest(accessToken);

      // Handle token expiration (401 with X-Token-Expired header)
      // Only attempt refresh for non-public endpoints and if we have a token
      if (!isPublicEndpoint && accessToken && response.status === 401 && response.headers.get('X-Token-Expired') === 'true') {
        console.log('[Auth] Access token expired, attempting refresh...');

        try {
          // Get a new token using the refresh token
          const newToken = await refreshAccessToken();

          if (newToken) {
            console.log('[Auth] Retrying original request with new token');
            // Create a new request with the new token
            return makeRequest(newToken);
          } else {
            console.error('[Auth] Failed to refresh access token');
            clearAccessToken();
            return response; // Return the original 401 response
          }
        } catch (error) {
          console.error('[Auth] Error during token refresh:', error);
          clearAccessToken();
          return response; // Return the original 401 response
        }
      }

      return response;
    },
    [accessToken, refreshAccessToken, clearAccessToken]
  );

  const value = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      clearAccessToken,
      authenticated: !!accessToken,
      refreshAccessToken,
      apiClient
    }),
    [accessToken, refreshAccessToken, apiClient, clearAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
