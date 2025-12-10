import { useEffect, useState, useMemo } from "react";
import { useCsrf } from "../hooks/useCsrf";
import { useAuthorizedApi } from "../hooks/useAuthorizedApi";
import { useLogout } from "../hooks/useLogout";

const USER_URL = "/user";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function User() {
  const csrfReady = useCsrf();
  const api = useMemo(() => useAuthorizedApi(), []);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout, loading: logoutLoading } = useLogout();

  useEffect(() => {
    if (!csrfReady) return;

    const fetchUser = async () => {
      try {
        const response = await api.get(USER_URL, {
          headers: { "X-Requested-With": "XMLHttpRequest" },
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load user info"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [csrfReady, api]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {user && (
            <div className="px-6 py-5 space-y-4">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => confirm("Log out now?") && logout()}
                  disabled={logoutLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID</p>
                    <p className="mt-1 text-sm text-gray-900">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="mt-1 text-sm text-gray-900">{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}