"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext({
	theme: "dark" as Theme,
	toggleTheme: () => {},
});

const getInitialTheme = (): Theme => {
	if (typeof window !== "undefined") {
		const saved = localStorage.getItem("theme") as Theme | null;
		if (saved) return saved;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		return prefersDark ? "dark" : "light";
	}
	// Default for SSR
	return "dark";
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme());
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Check localStorage first
		const saved = localStorage.getItem("theme") as Theme | null;
		if (saved) {
			document.documentElement.setAttribute("data-theme", saved);
			setTheme(saved);
		} else {
			// Fallback to system preference
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			const systemTheme: Theme = prefersDark ? "dark" : "light";
			document.documentElement.setAttribute("data-theme", systemTheme);
			setTheme(systemTheme);
		}
		setIsReady(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		try {
			localStorage.setItem("theme", newTheme);
		} catch (error) {
			console.warn("Failed to save theme preference:", error);
		}
	};

	if (!isReady) return null;

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
