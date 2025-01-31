import { Outlet } from "react-router-dom";
import Sidebartest from "./Sidebartest";

export default function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebartest />
      <main className="p-5 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
