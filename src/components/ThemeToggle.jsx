import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Check if theme is stored in localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      const storedTheme = window.localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme;
      }

      // Check if user prefers dark mode
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }

    return "light"; // Default theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Save theme preference to localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}

export default ThemeToggle;
