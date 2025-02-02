import React from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import type { Step } from "./StepperTypes";
import { useThemeStore } from "../../store/themeStore";

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  progress: Animated.SharedValue<number>;
}

export function StepIndicator({
  steps,
  currentStep,
  progress,
}: StepIndicatorProps) {
  const { width } = useWindowDimensions();
  const isDark = useThemeStore((state) => state.isDarkMode);
  const stepWidth = width / steps.length;

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(progress.value * width, {
      damping: 25,
      stiffness: 120,
      mass: 0.8,
    }),
  }));

  return (
    <View className="py-2">
      <View className="flex-row items-center px-4 relative h-2">
        <Animated.View
          style={[
            progressStyle,
            {
              position: "absolute",
              left: 0,
              height: 2,
              backgroundColor: isDark ? "#60A5FA" : "#3B82F6",
              borderRadius: 1,
            },
          ]}
        />
        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isCompleted = currentStep > step.id;
          const isLast = index === steps.length - 1;

          return (
            <View key={step.id} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                <View
                  className={`h-[2px] flex-1 ${
                    isActive
                      ? isDark
                        ? "bg-blue-400/20"
                        : "bg-blue-100"
                      : isDark
                      ? "bg-gray-800"
                      : "bg-gray-100"
                  }`}
                />
                {!isLast && (
                  <View
                    className={`h-[2px] flex-1 ${
                      currentStep > step.id
                        ? isDark
                          ? "bg-blue-400/20"
                          : "bg-blue-100"
                        : isDark
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    }`}
                  />
                )}
              </View>
              <Animated.View
                entering={FadeIn.duration(400)}
                exiting={FadeOut.duration(200)}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 ${
                  isCompleted
                    ? isDark
                      ? "bg-blue-400 border-blue-400"
                      : "bg-blue-500 border-blue-500"
                    : isActive
                    ? isDark
                      ? "bg-blue-900 border-blue-400"
                      : "bg-white border-blue-500"
                    : isDark
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
