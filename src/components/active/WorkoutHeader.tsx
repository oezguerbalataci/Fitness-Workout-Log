import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

interface WorkoutHeaderProps {
  isDarkMode: boolean;
  workoutName: string;
  headerHeight: number;
  scrollY: Animated.SharedValue<number>;
  onLeaveWorkout: () => void;
  onComplete: () => void;
}

export function WorkoutHeader({
  isDarkMode,
  workoutName,
  headerHeight,
  scrollY,
  onLeaveWorkout,
  onComplete,
}: WorkoutHeaderProps) {
  return (
    <Animated.View
      className={`${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      style={[
        useAnimatedStyle(() => {
          const translateY = interpolate(
            scrollY.value,
            [0, headerHeight],
            [0, -headerHeight * 2],
            Extrapolate.CLAMP
          );
          return {
            transform: [{ translateY }],
          };
        }),
      ]}
    >
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={onLeaveWorkout}
              className={`h-10 w-10 items-center justify-center rounded-full ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <Text
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {workoutName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onComplete}
            className={`h-10 px-4 items-center justify-center rounded-full ${
              isDarkMode ? "bg-white" : "bg-black"
            }`}
          >
            <Text
              className={`font-medium ${
                isDarkMode ? "text-black" : "text-white"
              }`}
            >
              Finish
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}
