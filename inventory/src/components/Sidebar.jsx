import { useState } from "react";
import { Menu, X, LayoutDashboard, User, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-pink-600 text-white h-screen p-5 fixed top-0 left-0 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="text-white mb-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className="mt-4">
          <ul>
            <li className="flex items-center p-2 hover:bg-gray-700 rounded">
              <LayoutDashboard size={24} />
              {isOpen && <span className="ml-2">Dashboard</span>}
            </li>
            <li className="flex items-center p-2 hover:bg-gray-700 rounded">
              <User size={24} />
              {isOpen && <span className="ml-2">Profile</span>}
            </li>
            <li className="flex items-center p-2 hover:bg-gray-700 rounded">
              <Settings size={24} />
              {isOpen && <span className="ml-2">Settings</span>}
            </li>
            <li className="flex items-center p-2 hover:bg-gray-700 rounded">
              <LogOut size={24} />
              {isOpen && <span className="ml-2">Logout</span>}
            </li>
          </ul>
        </nav>
      </div>
      {/* Content */}
      {/* <div className="flex-1 p-5 ml-16 transition-all duration-300">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p className="mt-2">This is the main content area.</p>
      </div> */}
    </div>
  );
}
