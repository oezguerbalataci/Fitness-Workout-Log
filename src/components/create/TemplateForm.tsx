import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { cn } from "../../lib/utils";
import { OptionButton } from "./OptionButton";
import type { FormState, FormOption } from "./types";
import {
  experienceLevels,
  splitTypes,
  trainingGoals,
  frequencyOptions,
  durationOptions,
  availableEquipment,
  aiProviders,
} from "./types";

interface TemplateFormProps {
  formState: FormState;
  onUpdateForm: (key: keyof FormState, value: string | string[]) => void;
  onGenerateTemplate: () => void;
  isLoading: boolean;
  error?: string;
}

export function TemplateForm({
  formState,
  onUpdateForm,
  onGenerateTemplate,
  isLoading,
  error,
}: TemplateFormProps) {
  const handleEquipmentToggle = (value: string) => {
    const newEquipment = formState.selectedEquipment.includes(value)
      ? formState.selectedEquipment.filter((item) => item !== value)
      : [...formState.selectedEquipment, value];
    onUpdateForm("selectedEquipment", newEquipment);
  };

  const renderSection = (
    title: string,
    options: FormOption[],
    selectedValue: string,
    updateKey: keyof FormState,
    isMulti?: boolean
  ) => (
    <View className="mb-8">
      <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      {isMulti && (
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Select all that apply
        </Text>
      )}
      {options.map((option) => (
        <OptionButton
          key={option.value}
          option={option}
          isSelected={
            isMulti
              ? formState.selectedEquipment.includes(option.value)
              : selectedValue === option.value
          }
          onSelect={
            isMulti
              ? handleEquipmentToggle
              : (value) => onUpdateForm(updateKey, value)
          }
          isMulti={isMulti}
        />
      ))}
    </View>
  );

  const isFormValid =
    formState.selectedLevel &&
    formState.selectedSplit &&
    formState.selectedGoal &&
    formState.selectedFrequency &&
    formState.selectedDuration &&
    formState.selectedEquipment.length > 0;

  return (
    <>
      {renderSection(
        "Choose AI Provider:",
        aiProviders,
        formState.selectedProvider,
        "selectedProvider"
      )}

      {renderSection(
        "What's your experience level?",
        experienceLevels,
        formState.selectedLevel,
        "selectedLevel"
      )}

      {renderSection(
        "Choose your preferred split:",
        splitTypes,
        formState.selectedSplit,
        "selectedSplit"
      )}

      {renderSection(
        "What's your main goal?",
        trainingGoals,
        formState.selectedGoal,
        "selectedGoal"
      )}

      {renderSection(
        "How often can you train?",
        frequencyOptions,
        formState.selectedFrequency,
        "selectedFrequency"
      )}

      {renderSection(
        "How long can you train per session?",
        durationOptions,
        formState.selectedDuration,
        "selectedDuration"
      )}

      {renderSection(
        "What equipment do you have access to?",
        availableEquipment,
        "",
        "selectedEquipment",
        true
      )}

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Any injuries or limitations? (Optional)
        </Text>
        <TextInput
          value={formState.limitations}
          onChangeText={(value) => onUpdateForm("limitations", value)}
          placeholder="E.g., shoulder injury, knee pain..."
          placeholderTextColor="#9CA3AF"
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg"
          multiline
        />
      </View>

      {error ? (
        <View className="mb-4 p-4 bg-red-100 dark:bg-red-900 rounded-lg">
          <Text className="text-red-600 dark:text-red-100">{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={onGenerateTemplate}
        disabled={!isFormValid || isLoading}
        className={cn(
          "p-4 rounded-lg",
          !isFormValid || isLoading
            ? "bg-gray-300 dark:bg-gray-700"
            : "bg-blue-500"
        )}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-medium">
            Generate Template
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
}
