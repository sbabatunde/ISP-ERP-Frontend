import {forwardRef} from "react"
import {cn} from "../lib/cn"
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { navbarLinks } from "../constants";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types"
import { useTheme } from "../hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex gap-x-3 p-3 items-center justify-between">
                <span className="flex items-center gap-x-3">
                    {isDark ? <MdOutlineDashboard size={24} alt="Logoipsum" /> : <MdDashboard size={24} alt="Logoipsum" />}
                    {!collapsed && <p className="text-[20px] font-medium text-slate-900 transition-colors dark:text-slate-50">Syscodes Inventory</p>}
                </span>
                {/* uncomment this when you want to add a theme toggle button */}
                {/* <button
                    className="btn-ghost size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    title="Toggle theme"
                >
                    {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
                </button> */}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
            {navbarLinks.map((navbarLink) => (
          <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
              {navbarLink.title}
            </p>
            {navbarLink.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
              >
                {/* Only render the icon if it exists */}
                {link.icon ? (
                  <link.icon size={22} className="flex-shrink-0" />
                ) : null}
                {!collapsed && (
                  <p className="whitespace-nowrap text-[15px]">{link.label}</p>
                )}
              </NavLink>
            ))}
          </nav>
        ))}
        </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};