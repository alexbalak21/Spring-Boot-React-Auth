import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useUser } from "../../context/UserContext";
import Avatar from "../../components/Avatar";
import EditableField from "../../components/EditableField";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import { PlusIcon } from "@heroicons/react/24/outline";


interface UserDto {
  name?: string;
  email?: string;
}

export default function Profile() {
  const api = useAuthorizedApi();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Make updateUser return the updated user from backend
  const updateUser = async (payload: UserDto) => {
    try {
      const response = await api.patch("/user/profile", payload);
      return response.data; // updated user object
    } catch (err: any) {
      // Extract backend error message if available
      const message =
        err?.response?.data?.message || "Failed to update user";
      throw new Error(message);
    }
  };


  const handleSaveName = async (newName: string) => {
    if (user) {
      const updatedUser = await updateUser({ name: newName });
      setUser(updatedUser);
    }
  };

  const handleSaveEmail = async (newEmail: string) => {
    if (user) {
      const updatedUser = await updateUser({ email: newEmail });
      setUser(updatedUser);
    }
  };

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

      {/* Avatar with overlay */}
      <div className="flex justify-center mb-6">
        {user && (
          <div className="relative group">
            <Avatar
              name={user.name}
              imageUrl={
                user?.profileImage
                  ? `data:image/png;base64,${user.profileImage}`
                  : undefined
              }
              size={64}
              bgColor="bg-gray-400"
              textColor="text-white"
            />
            {/* Overlay PlusIcon */}
            <button
              className="absolute inset-0 flex items-center justify-center 
                   bg-black/50 rounded-full opacity-0 group-hover:opacity-100 
                   transition"
            >
              <PlusIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        )}
      </div>


      {!user && <p className="text-gray-600">Loading user info...</p>}

      {user && (
        <div className="space-y-3">
          {/* Editable Name */}
          <EditableField
            label="Name"
            value={user.name}
            onSave={handleSaveName}
          />

          {/* Editable Email */}
          <EditableField
            label="Email"
            value={user.email}
            onSave={handleSaveEmail}
          />

          {/* Other fields */}
          <div className="flex gap-4">
            <strong className="w-28 text-gray-700">Role:</strong>
            <span className="text-gray-900">{user.roles.join(", ")}</span>
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
