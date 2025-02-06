import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { WorkoutTimer } from "../workout/WorkoutTimer";
import { StyleSheet } from "react-native";

interface TimerContainerProps {
  isDarkMode: boolean;
  headerHeight: number;
  scrollY: Animated.SharedValue<number>;
  insetTop: number;
}

const styles = StyleSheet.create({
  lightShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  floatingTimer: {
    position: "absolute",
    right: 16,
    zIndex: 50,
  },
  floatingShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});

export function TimerContainer({
  isDarkMode,
  headerHeight,
  scrollY,
  insetTop,
}: TimerContainerProps) {
  return (
    <>
      {/* Timer Container */}
      <Animated.View
        style={[
          useAnimatedStyle(() => {
            const height = interpolate(
              scrollY.value,
              [0, headerHeight],
              [120, 0],
              Extrapolate.CLAMP
            );
            return {
              height,
              overflow: "hidden",
            };
          }),
        ]}
      >
        {/* Timer Section - Full Size */}
        <Animated.View
          className={`px-4 py-6 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
          style={[
            isDarkMode ? {} : styles.lightShadow,
            useAnimatedStyle(() => {
              const opacity = interpolate(
                scrollY.value,
                [0, headerHeight],
                [1, 0],
                Extrapolate.CLAMP
              );
              return {
                opacity,
              };
            }),
          ]}
        >
          <WorkoutTimer />
        </Animated.View>
      </Animated.View>

      {/* Floating Timer - Compact */}
      <Animated.View
        className="absolute right-4 z-50"
        style={[
          styles.floatingTimer,
          useAnimatedStyle(() => {
            const opacity = interpolate(
              scrollY.value,
              [0, headerHeight],
              [0, 1],
              Extrapolate.CLAMP
            );
            const translateY = interpolate(
              scrollY.value,
              [0, headerHeight],
              [100, insetTop + 10],
              Extrapolate.CLAMP
            );
            return {
              opacity,
              transform: [{ translateY }],
            };
          }),
        ]}
      >
        <View
          className={`px-4 py-2 rounded-full ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          style={styles.floatingShadow}
        >
          <WorkoutTimer compact />
        </View>
      </Animated.View>
    </>
  );
}
