import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizedApi } from "../../hooks/useAuthorizedApi";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useUser } from "../../context/UserContext";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const api = useAuthorizedApi();

  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await api.put("/user/profile", formData);
      setUser(response.data); // update context with new user info
      setSuccess(true);

      // Reset success message after 3 seconds and redirect
      setTimeout(() => {
        setSuccess(false);
        navigate("/user");
      }, 3000);
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 min-w-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>
        <p className="mt-2 text-sm text-gray-600">Update your account information</p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Profile updated successfully! Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Full Name"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Input
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={100}
            placeholder="Enter your email address"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            onClick={() => navigate("/user")}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
