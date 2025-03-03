import { Outlet } from "react-router-dom"

import { useMediaQuery } from "@uidotdev/usehooks";

import {Sidebar} from "../layout/Sidebar"
import Header from "../layout/Header"
import {cn} from "../lib/cn"
import { useRef, useState } from "react";

const Layout = () => {
    // const isDesktopDevice = useMediaQuery("(min-width: 768px)");
    // const [collapsed,setCollapsed] = useState(false)
    // const sidebarRef = useRef(null)
    return(
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-900">
            <Sidebar />
            <div className={cn("transition-[margin] duration-300")}>
                <Header/>
                <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6 ">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Layout;