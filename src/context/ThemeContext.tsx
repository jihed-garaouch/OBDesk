import { createContext, useContext } from "react";

type Theme = "light" | "dark";

export const ThemeContext = createContext({
  theme: "dark" as Theme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
