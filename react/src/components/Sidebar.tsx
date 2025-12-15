import { Link, useLocation } from "react-router-dom";

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

  return (
    <aside className="w-full h-full bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">User Menu</h2>
      <nav className="space-y-2">
        {links.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={classNames(
              isActive(item.href)
                ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
              "block px-3 py-2 rounded-md text-sm font-medium"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
