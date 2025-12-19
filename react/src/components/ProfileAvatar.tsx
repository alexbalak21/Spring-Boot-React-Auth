import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { UserInfo } from "../types";

interface ProfileAvatarProps { user: UserInfo | null; onImageSelected: (file: File) => void; }

export default function ProfileAvatar({ user, onImageSelected } : ProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    const selectUploadImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image");
            return;
        }

        // Delegate to parent
        onImageSelected(file);
    };

    return (
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

                    <button
                        onClick={selectUploadImage}
                        className="absolute inset-0 flex items-center justify-center 
                       bg-black/50 rounded-full opacity-0 group-hover:opacity-100 
                       transition"
                    >
                        <PlusIcon className="h-6 w-6 text-white" />
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            )}

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
