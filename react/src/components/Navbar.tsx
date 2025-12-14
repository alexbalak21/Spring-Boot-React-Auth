import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "API Demo", href: "/demo" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Disclosure
      as="nav"
      aria-label="Main navigation"
      className="bg-white border-b border-gray-200 relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-200"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-50 hover:text-black focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + Desktop nav */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img alt="Company logo" src="/react.svg" className="h-8 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 h-16">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={classNames(
                      isActive(item.href)
                        ? "text-indigo-600 font-semibold border-b-3 border-indigo-600"
                        : "text-gray-500 hover:text-gray-800 hover:border-gray-300 border-transparent",
                      "flex items-center h-full px-3 text-sm font-medium border-b-2 transition-colors"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              aria-label="View notifications"
              className="relative rounded-full p-1 text-gray-400 hover:text-black focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
            >
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                <span className="sr-only">Open user menu</span>
                <img
                  alt="User avatar"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?..."
                  className="size-8 rounded-full bg-gray-100 outline -outline-offset-1 outline-white/10"
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
                {["Your profile", "Settings", "Sign out"].map((label) => (
                  <MenuItem key={label}>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 data-focus:bg-gray-100 data-focus:text-gray-900"
                    >
                      {label}
                    </a>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={classNames(
                isActive(item.href)
                  ? "text-indigo-600 font-semibold bg-gray-50 border-l-4 border-indigo-600"
                  : "text-gray-700 hover:text-indigo-600 hover:border-l-4 hover:border-indigo-600",
                "block px-3 py-2 text-base font-medium transition-colors w-full"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
