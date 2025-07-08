import { useRef, useState, useEffect } from "react";


import { Outlet } from "react-router-dom"
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../hooks/use-clicks-outside";

import {Sidebar} from "../layout/Sidebar"
import {Header} from "../layout/Header"
import {cn} from "../lib/cn"
import { useLocation } from "react-router-dom";
import { Footer } from "../layout/Footer";



const Layout = () => {
    const location = useLocation();
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    const sidebarRef = useRef(null);

    useEffect(() => {
        if(location.pathname.includes("suppliers")){
            setCollapsed(true);
        }else{
            setCollapsed(!isDesktopDevice);
        }
    }, [isDesktopDevice, location.pathname]);

    useClickOutside([sidebarRef], () => {
        if (!isDesktopDevice && !collapsed) {
            setCollapsed(true);
        }
    });

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <div
                className={cn(
                    "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                    !collapsed && "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30",
                )}
            />
            <Sidebar
                ref={sidebarRef}
                collapsed={collapsed}
            />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-3">
                    <Outlet />
                </div>
            {/* <Footer/> */}
            </div>
        </div>
    );
};

export default Layout;