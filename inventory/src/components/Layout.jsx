import { Outlet } from "react-router-dom";
import Sidebartest from "./Sidebartest";
import { MdMenu } from 'react-icons/md';
import { useState } from 'react';

export default function Layout() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen">
            <div className="md:hidden absolute top-4 left-4 z-40">
                <MdMenu 
                    className="text-3xl text-pink-600 cursor-pointer" 
                    onClick={() => setOpen(!open)} 
                />
            </div>
            <Sidebartest open={open} setOpen={setOpen} />
            <main className="p-5 flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
