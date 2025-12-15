import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCsrf } from "../../hooks/useCsrf";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import Button from "../../components/Button";

const USER_URL = "/user";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function Profile() {
  const csrfReady = useCsrf();
  const api = useAuthorizedApi();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


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

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">User Profile</h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/update-profile")}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading user info...</p>}
      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      {user && (
        <div className="space-y-3">
          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Name:</strong>
            <span className="text-gray-900">{user.name}</span>
          </div>
          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Email:</strong>
            <span className="text-gray-900">{user.email}</span>
          </div>
          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Role:</strong>
            <span className="text-gray-900">{user.role}</span>
          </div>
          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Created:</strong>
            <span className="text-gray-900">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Updated:</strong>
            <span className="text-gray-900">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
