import { View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
  Layout,
} from "react-native-reanimated";
import { WorkoutTimer } from "../workout/WorkoutTimer";

interface WorkoutTimerSectionProps {
  isDarkMode: boolean;
  scrollY: SharedValue<number>;
  headerHeight: number;
}

export const WorkoutTimerSection = ({
  isDarkMode,
  scrollY,
  headerHeight,
}: WorkoutTimerSectionProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    );

    const height = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [80, 0],
      Extrapolate.CLAMP
    );

    return {
      height,
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View
      className={`${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      style={animatedStyle}
    >
      <Animated.View className="px-6" style={opacityStyle} layout={Layout}>
        <View className="py-4">
          <WorkoutTimer />
        </View>
      </Animated.View>
    </Animated.View>
  );
};
