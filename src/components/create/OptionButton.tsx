import { TouchableOpacity, Text } from "react-native";
import type { FormOption } from "./types";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useThemeStore } from "../../store/themeStore";

interface OptionButtonProps {
  option: FormOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
  isMulti?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function OptionButton({
  option,
  isSelected,
  onSelect,
  isMulti,
}: OptionButtonProps) {
  const isDark = useThemeStore((state) => state.isDarkMode);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      mass: 0.5,
      damping: 15,
      stiffness: 200,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      mass: 0.5,
      damping: 15,
      stiffness: 200,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={() => onSelect(option.value)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle]}
      className={`py-4 px-5 rounded-2xl border mb-3 ${
        isSelected
          ? isDark
            ? "bg-blue-500 border-blue-400"
            : "bg-blue-500 border-blue-600"
          : isDark
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
      activeOpacity={0.9}
    >
      <Text
        className={`text-center font-semibold text-[17px] ${
          isSelected ? "text-white" : isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {option.label}
      </Text>
      {isMulti && (
        <Text
          className={`text-center text-[13px] mt-1 ${
            isSelected
              ? "text-blue-100"
              : isDark
              ? "text-gray-300"
              : "text-gray-500"
          }`}
        >
          Tap to {isSelected ? "remove" : "select"}
        </Text>
      )}
    </AnimatedTouchable>
  );
}
