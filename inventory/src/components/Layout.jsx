import { Outlet } from "react-router-dom";
import Sidebartest from "./Sidebartest";
import { useState, useEffect } from 'react';

export default function Layout() {
    const [open, setOpen] = useState(window.innerWidth >= 1024); // Open by default on large screens

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setOpen(true); // Open sidebar on large screens
            } else {
                setOpen(false); // Close sidebar on small screens
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="relative w-full h-screen flex">
            {/* Sidebar Component */}
            <Sidebartest open={open} toggleSidebar={() => setOpen(!open)} />

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${open ? "ml-72" : "ml-0"} p-5`}>
                <Outlet />
            </main>
        </div>
    );
}
