import { forwardRef } from "react";
import { cn } from "../lib/cn";
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { navbarLinks } from "../constants";
import { NavLink } from "react-router-dom";
import { useTheme } from "../hooks/use-theme";
import { Sun, Moon, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [openItems, setOpenItems] = useState([]);
  const [openSubItems, setOpenSubItems] = useState({});

  // Only keep relevant sections open based on current path
  useEffect(() => {
    const activeSections = navbarLinks
      .filter((item) =>
        item.links.some(
          (link) =>
            link.path === location.pathname ||
            (link.children &&
              link.children.some((child) => child.path === location.pathname)),
        ),
      )
      .map((item) => item.title);

    setOpenItems(activeSections);

    // Also open parent items for active child links
    const newOpenSubItems = {};
    navbarLinks.forEach((section) => {
      section.links.forEach((link) => {
        if (link.children) {
          const hasActiveChild = link.children.some(
            (child) => child.path === location.pathname,
          );
          if (hasActiveChild) {
            newOpenSubItems[section.title] = [
              ...(newOpenSubItems[section.title] || []),
              link.label,
            ];
          }
        }
      });
    });

    setOpenSubItems(newOpenSubItems);
  }, [location.pathname]);

  const toggleItem = (title) => {
    setOpenItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const toggleSubItem = (section, label) => {
    setOpenSubItems((prev) => ({
      ...prev,
      [section]: prev[section]?.includes(label)
        ? prev[section].filter((l) => l !== label)
        : [...(prev[section] || []), label],
    }));
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] p-2 flex h-full flex-col overflow-x-hidden border-r",
        "bg-white shadow-sm transition-all duration-300 ease-in-out",
        "border-slate-200 dark:border-slate-800 dark:bg-slate-900",
        collapsed ? "md:w-[72px] md:items-center" : "md:w-[250px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0",
      )}
    >
      {/* Header section */}
      <div
        className={cn(
          "flex items-center p-4 mb-2",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {isDark ? (
            <MdOutlineDashboard
              size={24}
              className={cn("flex-shrink-0", "text-pink-500")}
            />
          ) : (
            <MdDashboard
              size={24}
              className={cn("flex-shrink-0", "text-pink-600")}
            />
          )}
          {!collapsed && (
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Syscodes
            </h1>
          )}
        </div>

        {/* Theme toggle button */}
        {!collapsed && (
          <button
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              "hover:bg-pink-100 hover:scale-105 active:scale-95",
              "dark:hover:bg-pink-800/50",
              "shadow-sm hover:shadow-md",
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
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {navbarLinks.map((navbarLink) => (
          <div
            key={navbarLink.title}
            className={cn("mb-3", collapsed && "md:items-center")}
          >
            {/* Section header with toggle - only show if not collapsed */}
            {!collapsed && (
              <div
                onClick={() => toggleItem(navbarLink.title)}
                className={cn(
                  "mb-2 flex cursor-pointer items-center rounded-lg p-2 transition-all",
                  "hover:bg-slate-100 dark:hover:bg-slate-800",
                  openItems.includes(navbarLink.title)
                    ? "bg-slate-100/70 text-slate-800 dark:bg-slate-800/70 dark:text-slate-200"
                    : "",
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {navbarLink.title}
                </span>
                {openItems.includes(navbarLink.title) ? (
                  <ChevronUp size={16} className="ml-auto text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="ml-auto text-slate-400" />
                )}
              </div>
            )}

            {/* Links section */}
            <div
              className={cn(
                "space-y-1 transition-all duration-300 ease-in-out",
                collapsed || openItems.includes(navbarLink.title)
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden",
                collapsed && "md:flex md:flex-col md:items-center",
              )}
            >
              {navbarLink.links.map((link) => (
                <div key={link.label}>
                  {/* If link has children, render as expandable sub-menu */}
                  {link.children && link.children.length > 0 ? (
                    <>
                      <div
                        onClick={() =>
                          toggleSubItem(navbarLink.title, link.label)
                        }
                        className={cn(
                          "flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm font-medium transition-all",
                          "hover:bg-slate-100 dark:hover:bg-slate-800",
                          openSubItems[navbarLink.title]?.includes(link.label)
                            ? "bg-slate-100/50 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200"
                            : "text-slate-700 dark:text-slate-300",
                          collapsed ? "justify-center" : "px-3",
                          location.pathname === link.path &&
                            "bg-pink-100/50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
                        )}
                        title={collapsed ? link.label : undefined}
                      >
                        {link.icon && (
                          <link.icon
                            size={20}
                            className={cn(
                              "flex-shrink-0",
                              collapsed ? "mx-auto" : "",
                            )}
                          />
                        )}
                        {!collapsed && (
                          <span className="truncate transition-all">
                            {link.label}
                          </span>
                        )}
                        {!collapsed &&
                          (openSubItems[navbarLink.title]?.includes(
                            link.label,
                          ) ? (
                            <ChevronUp
                              size={14}
                              className="ml-auto text-slate-400"
                            />
                          ) : (
                            <ChevronDown
                              size={14}
                              className="ml-auto text-slate-400"
                            />
                          ))}
                      </div>
                      {/* Sub-menu links */}
                      <div
                        className={cn(
                          "ml-6 border-l border-slate-200 dark:border-slate-700 pl-2 transition-all duration-300",
                          openSubItems[navbarLink.title]?.includes(link.label)
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0 overflow-hidden",
                        )}
                      >
                        {link.children.map((subLink) => (
                          <NavLink
                            key={subLink.label}
                            to={subLink.path}
                            className={({ isActive }) =>
                              cn(
                                "group flex items-center gap-2 rounded-lg p-2 text-xs font-medium transition-all",
                                "hover:bg-slate-100 dark:hover:bg-slate-800",
                                isActive
                                  ? "bg-pink-100/70 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                                  : "text-slate-700 dark:text-slate-300",
                                collapsed ? "justify-center" : "px-2",
                              )
                            }
                            title={collapsed ? subLink.label : undefined}
                          >
                            {subLink.icon && (
                              <subLink.icon
                                size={16}
                                className={cn(
                                  "flex-shrink-0",
                                  collapsed ? "mx-auto" : "",
                                )}
                              />
                            )}
                            {!collapsed && (
                              <span className="truncate">{subLink.label}</span>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        cn(
                          "group flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200",
                          "hover:bg-slate-100 dark:hover:bg-slate-800",
                          isActive
                            ? "bg-pink-100/50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                            : "text-slate-700 dark:text-slate-300",
                          collapsed ? "justify-center" : "px-3",
                        )
                      }
                      title={collapsed ? link.label : undefined}
                    >
                      {link.icon && (
                        <link.icon
                          size={20}
                          className={cn(
                            "flex-shrink-0",
                            collapsed ? "mx-auto" : "",
                          )}
                        />
                      )}
                      {!collapsed && (
                        <span className="truncate transition-all">
                          {link.label}
                        </span>
                      )}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
