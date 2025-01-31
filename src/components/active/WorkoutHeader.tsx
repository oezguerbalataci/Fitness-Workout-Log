import { View, TouchableOpacity } from "react-native";
import { Text } from "../Text";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
  Layout,
} from "react-native-reanimated";
import { WorkoutTimer } from "../workout/WorkoutTimer";
import { haptics } from "../../utils/haptics";

interface WorkoutHeaderProps {
  title: string;
  onLeave: () => void;
  onComplete: () => void;
  scrollY: SharedValue<number>;
  headerHeight: number;
  isDarkMode: boolean;
}

export const WorkoutHeader = ({
  title,
  onLeave,
  onComplete,
  scrollY,
  headerHeight,
  isDarkMode,
}: WorkoutHeaderProps) => {
  const handleLeave = () => {
    haptics.warning();
    onLeave();
  };

  const handleComplete = () => {
    haptics.success();
    onComplete();
  };

  const timerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [20, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight * 0.5],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View
      className={`px-4 py-2 border-b ${
        isDarkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={handleLeave}
          className={`p-2 -ml-2 rounded-lg ${
            isDarkMode
              ? "bg-red-900/30 active:bg-red-900/50"
              : "bg-red-50 active:bg-red-100"
          }`}
        >
          <MaterialIcons
            name="close"
            size={24}
            color={isDarkMode ? "#f87171" : "#ef4444"}
          />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Animated.View style={titleStyle}>
            <Text
              variant="bold"
              className={`text-lg font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              numberOfLines={1}
            >
              {title}
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              {
                position: "absolute",
                width: "100%",
                alignItems: "center",
              },
              timerStyle,
            ]}
          >
            <WorkoutTimer isDarkMode={isDarkMode} compact />
          </Animated.View>
        </View>

        <TouchableOpacity
          onPress={handleComplete}
          className={`p-2 -mr-2 rounded-lg ${
            isDarkMode
              ? "bg-green-900/30 active:bg-green-900/50"
              : "bg-green-50 active:bg-green-100"
          }`}
        >
          <MaterialIcons
            name="check"
            size={24}
            color={isDarkMode ? "#4ade80" : "#22c55e"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
