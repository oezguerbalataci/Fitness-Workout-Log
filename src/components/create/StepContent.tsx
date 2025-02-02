import React from "react";
import { View, Text, TextInput, useColorScheme } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Layout,
} from "react-native-reanimated";
import { OptionButton } from "./OptionButton";
import type { Step } from "./StepperTypes";
import type { FormState, FormOption } from "./types";
import {
  experienceLevels,
  splitTypes,
  trainingGoals,
  frequencyOptions,
  durationOptions,
  availableEquipment,
} from "./types";
import { cn } from "../../lib/utils";

interface StepContentProps {
  step: Step;
  formState: FormState;
  onUpdateForm: (key: keyof FormState, value: string | string[]) => void;
}

const optionsMap: Record<string, FormOption[]> = {
  selectedLevel: experienceLevels,
  selectedSplit: splitTypes,
  selectedGoal: trainingGoals,
  selectedFrequency: frequencyOptions,
  selectedDuration: durationOptions,
  selectedEquipment: availableEquipment,
};

export function StepContent({
  step,
  formState,
  onUpdateForm,
}: StepContentProps) {
  const isDark = useColorScheme() === "dark";

  const handleEquipmentToggle = (value: string) => {
    const newEquipment = formState.selectedEquipment.includes(value)
      ? formState.selectedEquipment.filter((item) => item !== value)
      : [...formState.selectedEquipment, value];
    onUpdateForm("selectedEquipment", newEquipment);
  };

  return (
    <Animated.View
      entering={SlideInRight.springify().damping(25).stiffness(120)}
      exiting={SlideOutLeft.springify().damping(25).stiffness(120)}
      layout={Layout.springify()}
      className="flex-1"
    >
      <View className="mb-8">
        <Animated.Text
          entering={FadeIn.duration(400).delay(200)}
          className={cn(
            "text-[28px] font-bold tracking-tight leading-tight mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          {step.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.duration(400).delay(300)}
          className={cn(
            "text-[17px] leading-relaxed",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          {step.description}
        </Animated.Text>
      </View>

      <Animated.View
        entering={FadeIn.duration(400).delay(400)}
        className="flex-1"
      >
        {step.key === "limitations" ? (
          <View className="flex-1">
            <TextInput
              value={formState[step.key]}
              onChangeText={(value) => onUpdateForm(step.key, value)}
              placeholder="E.g., shoulder injury, knee pain..."
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              className={cn(
                "p-4 rounded-2xl min-h-[120px] text-[17px] border",
                isDark
                  ? "bg-gray-800/50 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              )}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              style={{
                shadowColor: isDark ? "#000" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
            <Text
              className={cn(
                "mt-3 text-[13px]",
                isDark ? "text-gray-500" : "text-gray-500"
              )}
            >
              This helps us customize your workout plan to avoid any potential
              injuries
            </Text>
          </View>
        ) : (
          <View className="flex-1">
            {optionsMap[step.key]?.map((option) => (
              <OptionButton
                key={option.value}
                option={option}
                isSelected={
                  step.isMulti
                    ? formState.selectedEquipment.includes(option.value)
                    : formState[step.key] === option.value
                }
                onSelect={
                  step.isMulti
                    ? handleEquipmentToggle
                    : (value) => onUpdateForm(step.key, value)
                }
                isMulti={step.isMulti}
              />
            ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}
