import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftEndOnRectangleIcon, ArrowRightEndOnRectangleIcon  } from "@heroicons/react/24/outline";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SidebarLink {
  name: string;
  href: string;
}

interface SidebarProps {
  links: SidebarLink[];
}

export default function Sidebar({ links }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={classNames(
        "bg-white h-full border-r border-gray-200 transition-all duration-300 ease-in-out",
        isOpen ? "w-64 p-4" : "w-16 px-2 py-4"
      )}
    >
      {/* Title only when open */}
        <div className="flex justify-between">
          {isOpen && <h2 className="text-lg font-semibold mb-4">User Menu</h2>}
          <button className={`rounded-md border border-gray-200 hover:bg-gray-100 p-1 mb-4 ${isOpen ? "" : "mx-auto"}`} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
            <ArrowLeftEndOnRectangleIcon  className="h-5 w-5 text-gray-600" />
          ) : (
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 text-gray-600" />
          )}
          </button>
        </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={classNames(
              isActive(item.href)
                ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "block px-3 py-2 rounded-md text-sm font-medium",
              !isOpen && "text-center px-0" // compact style when collapsed
            )}
          >
            {isOpen ? item.name : item.name.charAt(0)} {/* show first letter when collapsed */}
          </Link>
        ))}
      </nav>
    </aside>
  );
}


