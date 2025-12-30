import { createContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

const initialState = {
    theme: "system",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "vite-ui-theme", ...props }) {
    const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

            root.classList.add(systemTheme);
            console.debug("ThemeProvider: applied system theme ->", systemTheme, "html.classList=", root.className);
            return;
        }

        root.classList.add(theme);
        console.debug("ThemeProvider: applied theme ->", theme, "html.classList=", root.className);
    }, [theme]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            console.debug("ThemeProvider.setTheme called with ->", newTheme);
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={value}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
    defaultTheme: PropTypes.string,
    storageKey: PropTypes.string,
};