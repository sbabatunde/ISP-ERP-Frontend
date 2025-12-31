import { forwardRef } from "react";
import { cn } from "../lib/cn";
import { MdDashboard } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { navbarLinks } from "../constants";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/use-theme";
import {
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  Shield,
  Database,
  Layers,
  Package,
  ShoppingBag,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedSubMenus, setExpandedSubMenus] = useState({});

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Initialize expanded sections based on current path
  useEffect(() => {
    const newExpandedSections = {};
    const newExpandedSubMenus = {};

    navbarLinks.forEach((section) => {
      section.links.forEach((link) => {
        // Check if this link is active
        const isActive =
          location.pathname === link.path ||
          (link.children &&
            link.children.some((child) => location.pathname === child.path));

        if (isActive) {
          // Expand the section
          newExpandedSections[section.title] = true;

          // If it has children and one of them is active, expand the submenu
          if (
            link.children &&
            link.children.some((child) => location.pathname === child.path)
          ) {
            newExpandedSubMenus[link.label] = true;
          }
        }
      });
    });

    setExpandedSections(newExpandedSections);
    setExpandedSubMenus(newExpandedSubMenus);
  }, [location.pathname]);

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const toggleSubMenu = (linkLabel) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [linkLabel]: !prev[linkLabel],
    }));
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] h-full flex flex-col",
        "bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/80",
        "border-r border-gray-100 dark:border-gray-800",
        "backdrop-blur-sm bg-opacity-95",
        "transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[250px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0",
      )}
    >
      {/* Header with gradient */}
      <div
        className={cn(
          "px-4 py-5 mb-2 border-b border-gray-100/50 dark:border-gray-800/50",
          collapsed && "flex justify-center px-0",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "flex-col gap-2",
          )}
        >
          {/* <div
            className={cn(
              "relative flex items-center justify-center rounded-xl",
              "bg-gradient-to-br from-pink-500 to-pink-600 p-2.5",
              "shadow-lg shadow-pink-500/20",
            )}
          >
            {isDark ? (
              <MdOutlineDashboard size={24} className="text-white" />
            ) : (
              <MdDashboard size={24} className="text-white" />
            )}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 blur opacity-30"></div>
          </div> */}

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Syscodes Inventory
              </h1>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className={cn("mt-4", collapsed && "flex justify-center")}>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "relative overflow-hidden group",
              "rounded-xl p-2 transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900",
              "shadow-sm hover:shadow-md",
              collapsed
                ? "w-10 h-10"
                : "w-full flex items-center justify-center gap-2",
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/0 to-pink-500/0 group-hover:via-pink-500/20 group-hover:from-pink-500/10 group-hover:to-pink-500/10 transition-all duration-1000"></div>

            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-yellow-400" />
                {!collapsed && (
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Light Mode
                  </span>
                )}
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                {!collapsed && (
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {navbarLinks.map((section) => (
          <div
            key={section.title}
            className={cn("mb-4", collapsed && "flex flex-col items-center")}
          >
            {/* Section title - only when not collapsed */}
            {!collapsed && section.title && (
              <div
                className="px-3 mb-2 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(section.title)}
              >
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-3 bg-gradient-to-r from-pink-500 to-transparent"></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {section.title}
                  </span>
                </div>
                {expandedSections[section.title] ? (
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                )}
              </div>
            )}

            {/* Links - Show only if section is expanded or sidebar is collapsed */}
            <div
              className={cn(
                "space-y-1 transition-all duration-300 ease-in-out",
                collapsed || expandedSections[section.title]
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden",
                collapsed && "space-y-2",
              )}
            >
              {section.links.map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.children &&
                    link.children.some(
                      (child) => location.pathname === child.path,
                    ));

                return (
                  <div key={link.label}>
                    {/* Main link */}
                    {link.children && link.children.length > 0 ? (
                      // Link with children - click to expand/collapse submenu
                      <div>
                        <button
                          onClick={() => toggleSubMenu(link.label)}
                          className={cn(
                            "group w-full relative flex items-center gap-3 rounded-xl p-2.5",
                            "transition-all duration-200 hover:shadow-sm",
                            collapsed ? "justify-center" : "px-3",
                            isActive &&
                              "bg-gradient-to-r from-pink-50 to-pink-50 dark:from-pink-900/20 dark:to-pink-900/20",
                            !isActive &&
                              "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                          )}
                        >
                          {/* Active indicator */}
                          {!collapsed && isActive && (
                            <div className="absolute -left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-gradient-to-b from-pink-500 to-pink-500"></div>
                          )}

                          {/* Icon with badge */}
                          <div className="relative">
                            <div
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                isActive
                                  ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                              )}
                            >
                              {link.icon && <link.icon size={18} />}
                            </div>
                            {link.badge && (
                              <span
                                className={cn(
                                  "absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold",
                                  link.badge > 9 ? "h-5 w-5" : "h-4 w-4",
                                  link.badgeColor === "red" &&
                                    "bg-red-500 text-white",
                                  link.badgeColor === "blue" &&
                                    "bg-blue-500 text-white",
                                  link.badgeColor === "green" &&
                                    "bg-green-500 text-white",
                                  (!link.badgeColor ||
                                    link.badgeColor === "pink") &&
                                    "bg-pink-500 text-white",
                                )}
                              >
                                {link.badge > 9 ? "9+" : link.badge}
                              </span>
                            )}
                          </div>

                          {/* Label and chevron */}
                          {!collapsed && (
                            <div className="flex-1 min-w-0 text-left">
                              <span
                                className={cn(
                                  "text-sm font-medium block truncate",
                                  isActive
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-700 dark:text-gray-300",
                                )}
                              >
                                {link.label}
                              </span>
                              {link.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {link.description}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Chevron for collapsible items */}
                          {!collapsed && (
                            <ChevronRight
                              className={cn(
                                "h-3.5 w-3.5 transition-transform duration-200",
                                expandedSubMenus[link.label] ? "rotate-90" : "",
                              )}
                            />
                          )}
                        </button>

                        {/* Child links */}
                        {!collapsed && (
                          <div
                            className={cn(
                              "ml-6 border-l border-gray-200 dark:border-gray-800 pl-3 mt-1 space-y-1",
                              "transition-all duration-300 overflow-hidden",
                              expandedSubMenus[link.label]
                                ? "max-h-[500px] opacity-100"
                                : "max-h-0 opacity-0",
                            )}
                          >
                            {link.children.map((child) => {
                              const isChildActive =
                                location.pathname === child.path;
                              return (
                                <NavLink
                                  key={child.label}
                                  to={child.path}
                                  className={({ isActive: childIsActive }) =>
                                    cn(
                                      "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-all",
                                      "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                                      (childIsActive || isChildActive) &&
                                        "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 font-medium",
                                    )
                                  }
                                >
                                  <div
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-full transition-colors",
                                      "bg-gray-300 dark:bg-gray-700 group-hover:bg-pink-400",
                                      location.pathname === child.path &&
                                        "bg-pink-500",
                                    )}
                                  ></div>
                                  <span className="truncate">
                                    {child.label}
                                  </span>
                                  {child.badge && (
                                    <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-gray-200 dark:bg-gray-800">
                                      {child.badge}
                                    </span>
                                  )}
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular link without children
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          cn(
                            "group relative flex items-center gap-3 rounded-xl p-2.5",
                            "transition-all duration-200 hover:shadow-sm",
                            collapsed ? "justify-center" : "px-3",
                            isActive &&
                              "bg-gradient-to-r from-pink-50 to-pink-50 dark:from-pink-900/20 dark:to-pink-900/20",
                            !isActive &&
                              "hover:bg-gray-100/50 dark:hover:bg-gray-800/50",
                          )
                        }
                      >
                        {/* Active indicator */}
                        {!collapsed && (
                          <div
                            className={cn(
                              "absolute -left-2 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-gradient-to-b from-pink-500 to-pink-500 transition-all",
                              location.pathname === link.path
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          ></div>
                        )}

                        {/* Icon with badge */}
                        <div className="relative">
                          <div
                            className={cn(
                              "p-1.5 rounded-lg transition-colors",
                              location.pathname === link.path
                                ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                            )}
                          >
                            {link.icon && <link.icon size={18} />}
                          </div>
                          {link.badge && (
                            <span
                              className={cn(
                                "absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold",
                                link.badge > 9 ? "h-5 w-5" : "h-4 w-4",
                                link.badgeColor === "red" &&
                                  "bg-red-500 text-white",
                                link.badgeColor === "blue" &&
                                  "bg-blue-500 text-white",
                                link.badgeColor === "green" &&
                                  "bg-green-500 text-white",
                                (!link.badgeColor ||
                                  link.badgeColor === "pink") &&
                                  "bg-pink-500 text-white",
                              )}
                            >
                              {link.badge > 9 ? "9+" : link.badge}
                            </span>
                          )}
                        </div>

                        {/* Label */}
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <span
                              className={cn(
                                "text-sm font-medium block truncate",
                                location.pathname === link.path
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300",
                              )}
                            >
                              {link.label}
                            </span>
                            {link.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {link.description}
                              </p>
                            )}
                          </div>
                        )}
                      </NavLink>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile - bottom section */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-100/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-500"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                user name ....(Gidado)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                user role/dept ...(Admin)
              </p>
            </div>
            <button className=" cursor-pointer p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800">
              <LogOut className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsed user profile */}
      {collapsed && (
        <div className="p-3 border-t border-gray-100/50 dark:border-gray-800/50">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 bg-green-500"></div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
