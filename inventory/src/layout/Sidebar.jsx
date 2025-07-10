import { forwardRef } from "react";
import { cn } from "../lib/cn";
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { navbarLinks } from "../constants";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "../hooks/use-theme";
import { Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [openItems, setOpenItems] = useState([]);
  const [activeSection, setActiveSection] = useState([]);

  useEffect(() => {
    const items = navbarLinks.map((item) => item.title);
    setOpenItems(items);
  }, []);

  const toggleItem = (title) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

    useEffect(() => {
      const isSectionActive = navbarLinks.map((item) => item.links.some(link => link.path === location.pathname) ? item.title : null);
    
      setActiveSection(isSectionActive);
  
    }, [location.pathname]);

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full flex-col overflow-x-hidden border-r border-slate-300 bg-white shadow-lg transition-all duration-300 ease-in-out dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      {/* Header section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {isDark ? (
            <MdOutlineDashboard size={24} className="flex-shrink-0" />
          ) : (
            <MdDashboard size={24} className="flex-shrink-0" />
          )}
          {!collapsed && (
            <h1 className="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">
              Syscodes Inventory
            </h1>
          )}
        </div>
        
        {/* Theme toggle button */}
        <button
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-pink-100 hover:scale-105 active:scale-95 dark:hover:bg-pink-800",
            collapsed ? "mx-auto" : ""
          )}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-slate-700 dark:text-slate-300" />
          )}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {navbarLinks.map((navbarLink) => (
          <div
            key={navbarLink.title}
            className={cn("mb-2", collapsed && "md:items-center")}
          >
            {/* Section header with toggle */}
            <div 
              onClick={() => toggleItem(navbarLink.title)}
              className={cn(
                "mb-1 flex cursor-pointer items-center rounded-lg p-2 transition-all hover:bg-pink-100 dark:hover:bg-pink-800",
                activeSection.includes(navbarLink.title) ? "bg-pink-200 text-pink-600 shadow-inner dark:bg-pink-900/30 dark:text-pink-400" : "",
                collapsed ? "justify-center" : "justify-between px-2"
              )}
            >
              {!collapsed && (
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {navbarLink.title}
                </span>
              )}
              {!collapsed && (
                openItems.includes(navbarLink.title) ? (
                  <ChevronUp size={16} className="text-slate-500 transition-transform duration-300" />
                ) : (
                  <ChevronDown size={16} className="text-slate-500 transition-transform duration-300" />
                )
              )}
            </div>
            
            {/* Links section */}
            <div 
              className={cn(
                "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                openItems.includes(navbarLink.title) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                collapsed && "md:flex md:flex-col md:items-center"
              )}
            >
              {navbarLink.links.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200",
                      "hover:bg-pink-100 hover:shadow-sm dark:hover:bg-pink-800",
                      isActive
                        ? "bg-pink-50 text-pink-600 shadow-inner dark:bg-pink-900/30 dark:text-pink-400"
                        : "text-slate-700 dark:text-slate-300",
                      collapsed ? "justify-center" : "px-3",
                      "hover:translate-x-1 hover:scale-[1.02] active:scale-95"
                    )
                  }
                  title={collapsed ? link.label : undefined}
                >
                  {link.icon && (
                    <link.icon
                      size={20}
                      className={cn(
                        "flex-shrink-0 transition-transform group-hover:scale-110",
                        collapsed ? "mx-auto" : ""
                      )}
                    />
                  )}
                  {!collapsed && (
                    <span className="truncate transition-all">{link.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};