import { Outlet } from "react-router-dom"

import { useMediaQuery } from "@uidotdev/usehooks";

import {Sidebar} from "../layout/Sidebar"
import {Header} from "../layout/Header"
import {cn} from "../lib/cn"
import { useRef, useState } from "react";

const Layout = () => {
    const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    const [collapsed,setCollapsed] = useState(!isDesktopDevice)
    const sidebarRef = useRef(null)

    useEffect(() =>{
        setCollapsed(!isDesktopDevice)
    }, [isDesktopDevice])

    return(
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <div className={cn("pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
                !collapsed &&  "max-md:pointer-events-auto max-md:opacity-30 max-md:z-50 "
            )}/>
            <Sidebar 
                ref={sidebarRef}
                collapsed={collapsed}
            />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px" )}>
                <Header 
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}/>
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 ">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Layout;