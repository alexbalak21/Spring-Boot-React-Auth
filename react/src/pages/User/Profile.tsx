import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useUser } from "../../context/UserContext";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

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

      {!user && (
        <p className="text-gray-600">Loading user info...</p>
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
