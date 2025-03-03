import {forwardRef} from "react"
import {cn} from "../lib/cn"
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import PropTypes from "prop-types"

export const Sidebar = forwardRef(({collapsed}, ref) => {
    return <aside ref={ref} 
    className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic_bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900")
    }>
        <div className="flex gap-x-3 p-3">
            <MdDashboard className="dark:hidden" alt="logo"/>
            <MdOutlineDashboard className="dark:block"/>
            {!collapsed && <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">Logo</p>}
        </div>
    </aside>
})

Sidebar.displayName = "Sidebar"

Sidebar.PropTypes ={
    collapsed: PropTypes.bool,
}