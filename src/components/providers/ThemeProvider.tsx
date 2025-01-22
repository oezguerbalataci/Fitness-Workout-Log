import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useThemeStore } from "../../store/themeStore";

export function ThemeProvider() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Sync with system theme on first load
  useEffect(() => {
    if (systemColorScheme === "dark" && !isDarkMode) {
      toggleTheme();
    }
  }, []);

  return null;
}
