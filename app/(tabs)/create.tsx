import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore } from "../../src/store/workoutStore";
import { generateAIPrompt, parseAIResponse } from "../../src/utils/aiUtils";
import { generateWorkoutTemplate } from "../../src/services/aiService";
import { generateWorkoutTemplateWithGemini } from "../../src/services/geminiService";
import { TemplatePreview } from "../../src/components/create/TemplatePreview";
import { StepIndicator } from "../../src/components/create/StepIndicator";
import { StepContent } from "../../src/components/create/StepContent";
import { FORM_STEPS } from "../../src/components/create/StepperTypes";
import type { Template } from "../../src/store/workoutStore";
import type { FormState } from "../../src/components/create/types";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "../../src/store/themeStore";
import type { AIProvider } from "../../src/services/aiService";

function AITemplateGenerator() {
  const isDark = useThemeStore((state) => state.isDarkMode);
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = useSharedValue((currentStep - 1) / (FORM_STEPS.length - 1));
  const [formState, setFormState] = useState<FormState>({
    selectedLevel: "",
    selectedSplit: "",
    selectedGoal: "",
    selectedFrequency: "",
    selectedDuration: "",
    selectedEquipment: [],
    limitations: "",
    selectedProvider: "gemini",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [error, setError] = useState<string>("");
  const addTemplate = useWorkoutStore((state) => state.addTemplate);
  const [selectedProvider] = useState<AIProvider>("gemini");

  const handleUpdateForm = (key: keyof FormState, value: string | string[]) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    const currentStepData = FORM_STEPS[currentStep - 1];
    const value = formState[currentStepData.key];

    if (!value && currentStepData.key !== "limitations") {
      setError("Please make a selection to continue");
      return;
    }

    if (currentStep === FORM_STEPS.length) {
      handleGenerateTemplate();
    } else {
      setCurrentStep((prev) => prev + 1);
      progress.value = currentStep / (FORM_STEPS.length - 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      progress.value = (currentStep - 2) / (FORM_STEPS.length - 1);
      setError("");
    }
  };

  const handleGenerateTemplate = async () => {
    if (
      !formState.selectedLevel ||
      !formState.selectedSplit ||
      !formState.selectedGoal ||
      !formState.selectedFrequency ||
      !formState.selectedDuration ||
      formState.selectedEquipment.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const prompt = generateAIPrompt({
        experienceLevel: formState.selectedLevel,
        splitType: formState.selectedSplit,
        trainingFrequency: parseInt(formState.selectedFrequency),
        trainingGoal: formState.selectedGoal,
        equipment: formState.selectedEquipment,
        sessionDuration: parseInt(formState.selectedDuration),
        limitations: formState.limitations.trim() || undefined,
      });

      let response;
      if (selectedProvider === "gemini") {
        response = await generateWorkoutTemplateWithGemini(prompt);
      } else {
        response = await generateWorkoutTemplate(prompt, selectedProvider);
      }

      const parsedTemplate = parseAIResponse(response);
      setTemplate(parsedTemplate);
    } catch (error) {
      console.error("Error generating template:", error);
      setError(
        "Failed to generate template. Please try again or try a different AI provider."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setTemplate(null);
  };

  const handleAddTemplate = (updatedTemplate: Template) => {
    if (!updatedTemplate) return;

    try {
      const success = addTemplate(updatedTemplate);
      if (success) {
        Alert.alert("Success", "Template added to your collection!", [
          {
            text: "OK",
            onPress: () => {
              setTemplate(null);
              setFormState({
                selectedLevel: "",
                selectedSplit: "",
                selectedGoal: "",
                selectedFrequency: "",
                selectedDuration: "",
                selectedEquipment: [],
                limitations: "",
                selectedProvider: "gemini",
              });
              setCurrentStep(1);
              progress.value = 0;
              setError("");
            },
          },
        ]);
      } else {
        setError(
          "A template with this name already exists. Please try a different name."
        );
      }
    } catch (error) {
      console.error("Error adding template:", error);
      setError("Failed to add template. Please try again.");
    }
  };

  const currentStepData = FORM_STEPS[currentStep - 1];

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {!template ? (
        <View className="flex-1">
          <View
            className={`px-6 py-4 z-10 ${
              isDark ? "bg-gray-900" : "bg-gray-50"
            }`}
            style={{
              shadowColor: isDark ? "#000" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.5 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="mb-4">
              <Text
                className={`text-[34px] font-bold leading-tight tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Create Workout
              </Text>
              <Text
                className={`text-base mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Let AI design your perfect workout routine
              </Text>
            </View>

            <View className="mt-2">
              <Text
                className={`text-sm font-medium mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-700"
                }`}
              >
                Step {currentStep} of {FORM_STEPS.length}
              </Text>
              <StepIndicator
                steps={FORM_STEPS}
                currentStep={currentStep}
                progress={progress}
              />
            </View>
          </View>

          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 24 }}
          >
            <StepContent
              step={currentStepData}
              formState={formState}
              onUpdateForm={handleUpdateForm}
            />
          </ScrollView>

          <View
            className={`border-t px-6 py-4 ${
              isDark
                ? "border-gray-800 bg-gray-900"
                : "border-gray-200 bg-gray-50"
            }`}
            style={{
              paddingBottom: Math.max(insets.bottom, 16),
            }}
          >
            {error ? (
              <View className="pb-4">
                <Text
                  className={`text-[15px] font-medium ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <View className="flex flex-row gap-4">
              <TouchableOpacity
                onPress={handleBack}
                disabled={currentStep === 1}
                className={`flex-1 py-4 rounded-2xl border ${
                  currentStep === 1
                    ? isDark
                      ? "bg-gray-700/50 border-gray-700"
                      : "bg-gray-100/50 border-gray-200"
                    : isDark
                    ? "bg-gray-700 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                style={{
                  shadowColor: isDark ? "#000" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  className={`text-center font-semibold text-[17px] ${
                    currentStep === 1
                      ? isDark
                        ? "text-gray-500"
                        : "text-gray-400"
                      : isDark
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                disabled={isLoading}
                className={`flex-1 py-4 rounded-2xl ${
                  isLoading
                    ? isDark
                      ? "bg-blue-600/70"
                      : "bg-blue-400"
                    : "bg-blue-500"
                }`}
                style={{
                  shadowColor: "#3B82F6",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 4,
                }}
              >
                <Text
                  className={`text-center font-semibold text-[17px] ${
                    isLoading ? "text-white/90" : "text-white"
                  }`}
                >
                  {isLoading
                    ? "Loading..."
                    : currentStep === FORM_STEPS.length
                    ? "Generate"
                    : "Next"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <TemplatePreview
          template={template}
          onAddTemplate={handleAddTemplate}
          onDismiss={handleDismiss}
        />
      )}
    </SafeAreaView>
  );
}

export default AITemplateGenerator;
