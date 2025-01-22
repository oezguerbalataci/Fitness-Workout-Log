import { TouchableOpacity } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="bg-background border border-input rounded-md p-2 active:opacity-70"
    >
      {isDark ? (
        <MoonStar className="text-foreground" size={20} />
      ) : (
        <Sun className="text-foreground" size={20} />
      )}
    </TouchableOpacity>
  );
}
