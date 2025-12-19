import { useState, useRef } from "react";
import type { AxiosInstance } from "axios";

interface UploadProfileImageProps {
  api: AxiosInstance;
}

export default function UploadProfileImage({ api }: UploadProfileImageProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Optional: client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/user/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.imageData) {
        setPreview(response.data.imageData);
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    }
  };

  return (
    <div className="mb-6">
      {/* Preview */}
      {preview && (
        <div className="mb-4 flex justify-center">
          <img
            src={`data:image/jpeg;base64,${preview}`}
            alt="Profile preview"
            className="w-16 h-16 rounded-full object-cover border"
          />
        </div>
      )}

      {/* Hidden input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Single button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Select & Upload Image
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Image uploaded successfully!</p>}
    </div>
  );
}
