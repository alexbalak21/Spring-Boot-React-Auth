import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import type { SidebarLink } from "../components/Sidebar";

interface UserLayoutProps {
  links: SidebarLink[];
  position?: "left" | "right"; // default is "right"
}

export default function UserLayout({ links, position = "left" }: UserLayoutProps) {
  return (
    <div className="flex bg-gray-50  h-full">

      <div className="w-64">
        {position === "left" && <Sidebar links={links} />}
      </div>

      <div className="w-full flex items-center justify-center">
        <Outlet />  
      </div>
          
       
      <div className="w-64">
        {position === "right" && <Sidebar links={links} />}
      </div>
    </div>
  );
}
