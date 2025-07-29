import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
}

const getInitialTheme = (): Theme => {
	if (typeof window !== "undefined") {
		const saved = localStorage.getItem("theme") as Theme | null;
		if (saved) return saved;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		return prefersDark ? "dark" : "light";
	}
	return "dark";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme());
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const saved = (typeof window !== "undefined" &&
			localStorage.getItem("theme")) as Theme | null;
		if (saved) {
			document.documentElement.setAttribute("data-theme", saved);
			setTheme(saved);
		} else if (typeof window !== "undefined") {
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
		const newTheme: Theme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("data-theme", newTheme);
		}
		if (typeof window !== "undefined") {
			localStorage.setItem("theme", newTheme);
		}
	};

	if (!isReady) return null;

	const value = { theme, toggleTheme };

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
};

export const UseTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("UseTheme must be used within ThemeProvider");
	return ctx;
};
