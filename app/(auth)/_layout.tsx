import { Stack } from "expo-router";
import { useThemeStore } from "../../src/store/themeStore";

export default function AuthLayout() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
        },
      }}
    />
  );
}
