import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { cn } from "../../lib/utils";
import type { Template } from "../../store/workoutStore";
import { useWorkoutStore } from "../../store/workoutStore";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";

interface TemplatePreviewProps {
  template: Template;
  onAddTemplate: (updatedTemplate: Template) => void;
  onDismiss: () => void;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function TemplatePreview({
  template,
  onAddTemplate,
  onDismiss,
}: TemplatePreviewProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const [templateName, setTemplateName] = useState(template.name);
  const [isEditing, setIsEditing] = useState(false);
  const templates = useWorkoutStore((state) => state.templates);

  const handleSave = () => {
    if (templateName.trim()) {
      let finalName = templateName.trim();
      let counter = 1;

      // Check if name exists and add increment if needed
      while (
        templates.some((t) => t.name.toLowerCase() === finalName.toLowerCase())
      ) {
        finalName = `${templateName.trim()} (${counter})`;
        counter++;
      }

      onAddTemplate({
        ...template,
        name: finalName,
      });
    }
  };

  return (
    <View className="flex-1">
      <AnimatedBlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        entering={FadeIn.duration(400)}
        className={cn(
          "px-4 py-3 z-10",
          isDark ? "bg-gray-900/90" : "bg-gray-50/90"
        )}
        style={{
          shadowColor: isDark ? "#000" : "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.5 : 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Animated.Text
              entering={FadeInDown.duration(600).delay(200)}
              className={cn(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900"
              )}
            >
              Your Workout
            </Animated.Text>
          </View>
          <TouchableOpacity
            onPress={onDismiss}
            className={cn(
              "p-2 rounded-full",
              isDark ? "bg-gray-800" : "bg-gray-100"
            )}
          >
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={isDark ? "#9CA3AF" : "#4B5563"}
            />
          </TouchableOpacity>
        </View>
      </AnimatedBlurView>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          layout={Layout.springify()}
          className={cn(
            "rounded-2xl overflow-hidden",
            isDark ? "bg-gray-800/50" : "bg-white"
          )}
          style={{
            shadowColor: isDark ? "#000" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.5 : 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            className={cn(
              "p-3 border-b",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          >
            <View className="flex-row items-center justify-between">
              {isEditing ? (
                <TextInput
                  value={templateName}
                  onChangeText={setTemplateName}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  className={cn(
                    "flex-1 text-base font-semibold py-1.5 px-3 rounded-lg border",
                    isDark
                      ? "bg-gray-700/50 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  )}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                />
              ) : (
                <Text
                  className={cn(
                    "text-base font-semibold flex-1",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {templateName}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                className={cn(
                  "ml-2 p-1.5 rounded-lg",
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                )}
              >
                <MaterialCommunityIcons
                  name={isEditing ? "check" : "pencil"}
                  size={18}
                  color={isDark ? "#60A5FA" : "#3B82F6"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {template.workouts.map((workout, index) => (
            <Animated.View
              key={workout.id}
              entering={FadeInDown.duration(600).delay(500 + index * 100)}
              className={cn(
                "px-3 py-2",
                index !== template.workouts.length - 1 &&
                  (isDark
                    ? "border-b border-gray-700/50"
                    : "border-b border-gray-200")
              )}
            >
              <View className="flex-row items-center mb-2">
                <View
                  className={cn(
                    "w-8 h-8 rounded-lg items-center justify-center",
                    isDark ? "bg-gray-700" : "bg-blue-50"
                  )}
                >
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={16}
                    color={isDark ? "#60A5FA" : "#3B82F6"}
                  />
                </View>
                <Text
                  className={cn(
                    "text-base font-semibold ml-2",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {workout.name}
                </Text>
              </View>

              {workout.exercises.map((exercise, exerciseIndex) => (
                <View
                  key={exercise.id}
                  className={cn(
                    "ml-10 py-2 flex-row items-center justify-between",
                    exerciseIndex !== workout.exercises.length - 1 &&
                      (isDark
                        ? "border-b border-gray-700/30"
                        : "border-b border-gray-100")
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm flex-1",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    {exercise.name}
                  </Text>
                  <Text
                    className={cn(
                      "text-xs ml-2",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {exercise.sets}×{exercise.reps}
                  </Text>
                </View>
              ))}
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      <AnimatedBlurView
        intensity={100}
        tint={isDark ? "dark" : "light"}
        entering={FadeIn.duration(400)}
        className={cn(
          "border-t",
          isDark ? "border-gray-800" : "border-gray-200"
        )}
      >
        <View
          className="px-4 py-3"
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onDismiss}
              className={cn(
                "flex-1 py-3 rounded-xl border",
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              )}
              style={{
                shadowColor: isDark ? "#000" : "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Text
                className={cn(
                  "text-center font-medium text-base",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}
              >
                Dismiss
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 py-3 rounded-xl bg-blue-500 flex-row items-center justify-center"
              style={{
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <MaterialCommunityIcons name="plus" size={20} color="white" />
              <Text className="text-white text-center font-medium text-base ml-1.5">
                Add Template
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedBlurView>
    </View>
  );
}
