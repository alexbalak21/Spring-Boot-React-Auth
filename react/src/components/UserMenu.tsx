import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import Confirm from "./Confirm";
import { useState } from "react";
import { useLogout } from "../hooks/useLogout";
import { useUser } from "../context/UserContext";

export default function UserMenu() {
  const { logout, loading } = useLogout();
  const { user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) return null;

  return (
    <Menu as="div" className="relative ml-3">
      <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        <span className="sr-only">Open user menu</span>
        <Avatar
          name={user?.name ?? "?"}
          imageUrl={user?.profileImage ? `data:image/png;base64,${user.profileImage}` : ""}
          size={32}
          bgColor="bg-gray-400"
          textColor="text-white"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-5 w-48 origin-top-right rounded-md bg-white py-1 outline outline-gray-200 
                  transition 
                  data-closed:scale-95 data-closed:transform data-closed:opacity-0 
                  data-open:opacity-100 data-open:scale-100 
                  data-enter:duration-100 data-enter:ease-out 
                  data-leave:duration-75 data-leave:ease-in"
      >
        <MenuItem>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Profile
          </Link>
        </MenuItem>

        <MenuItem>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            Logout
          </button>
        </MenuItem>
      </MenuItems>

      {/* Confirm modal */}
      <Confirm
        open={showConfirm}
        title="Logout ?"
        message="Are you sure you want to log out?"
        onConfirm={() => {
          setShowConfirm(false);
          logout();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </Menu>
  );
}
