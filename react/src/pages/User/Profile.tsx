import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useUser } from "../../context/UserContext";
import EditableField from "../../components/EditableField";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import ProfileAvatar from "../../components/ProfileAvatar";

interface UserDto {
  name?: string;
  email?: string;
}

export default function Profile() {
  const api = useAuthorizedApi();
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Update name/email
  const updateUser = async (payload: UserDto) => {
    try {
      const response = await api.patch("/user/profile", payload);
      return response.data;
    } catch (err: any) {
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

  // ⬇️ NEW: Upload profile image (delegated from ProfileAvatar)
  const handleProfileImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend returns updated user with new profileImage
      if (response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
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

      {/* Avatar with upload overlay */}
      <ProfileAvatar
        user={user}
        onImageSelected={handleProfileImageUpload}
      />

      {!user && <p className="text-gray-600">Loading user info...</p>}

      {user && (
        <div className="space-y-3">
          <EditableField
            label="Name"
            value={user.name}
            onSave={handleSaveName}
          />

          <EditableField
            label="Email"
            value={user.email}
            onSave={handleSaveEmail}
          />

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
