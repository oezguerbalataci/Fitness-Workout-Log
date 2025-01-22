import React, { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Alert, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore, Template } from "../../src/store/workoutStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, Redirect, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { exampleTemplates } from "../../src/data/exampleTemplates";
import { TemplateCard } from "../../src/components/template/TemplateCard";
import { EmptyTemplates } from "../../src/components/template/EmptyTemplates";
import { HomeHeader } from "../../src/components/template/HomeHeader";
import {
  checkTemplateNameExists,
  checkTemplateWorkoutsExist,
} from "../../src/utils/templateUtils";
import { useThemeStore } from "../../src/store/themeStore";
import { FlashList } from "@shopify/flash-list";

const ITEMS_PER_PAGE = 10;

/**
 * Main home screen of the application
 * Displays user's templates and example templates
 */
export default function HomeScreen() {
  const router = useRouter();
  const templates = useWorkoutStore((state) => state.templates);
  const currentWorkout = useWorkoutStore((state) => state.currentWorkout);
  const addTemplate = useWorkoutStore((state) => state.addTemplate);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [page, setPage] = useState(1);

  // Memoize paginated templates
  const paginatedTemplates = useMemo(() => {
    return templates.slice(0, page * ITEMS_PER_PAGE);
  }, [templates, page]);

  const handleEndReached = useCallback(() => {
    if (paginatedTemplates.length < templates.length) {
      setPage((prev) => prev + 1);
    }
  }, [paginatedTemplates.length, templates.length]);

  const renderItem = useCallback(
    ({ item: template, index }: { item: Template; index: number }) => (
      <TemplateCard
        key={template.id}
        template={template}
        onPress={() => router.push(`/template/${template.id}`)}
        isLast={index === paginatedTemplates.length - 1}
      />
    ),
    [router, paginatedTemplates.length]
  );

  const ListEmptyComponent = useCallback(() => <EmptyTemplates />, []);

  const ListHeaderComponent = useCallback(
    () => (
      <View className="flex-row items-center justify-between px-6 py-4">
        <Text
          className={`text-xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Templates
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/template/new")}
          className={`p-2 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <MaterialIcons
            name="add"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>
    ),
    [isDarkMode, router]
  );

  const handleUseTemplate = useCallback(
    (templateId: string) => {
      const template = exampleTemplates.find((t) => t.id === templateId);
      if (!template) return;

      // Check for duplicate name
      if (checkTemplateNameExists(templates, template.name)) {
        Alert.alert(
          "Name Already Exists",
          "You already have a routine with this name. Please rename your existing routine first."
        );
        return;
      }

      // Check for duplicate workouts
      if (checkTemplateWorkoutsExist(templates, template)) {
        Alert.alert(
          "Template Already Exists",
          "You already have this routine in your templates."
        );
        return;
      }

      // Create new template with unique ID
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
      };

      // Add template and handle errors
      const success = addTemplate(newTemplate);
      if (!success) {
        Alert.alert(
          "Error",
          "Failed to add template. A template with this name already exists."
        );
        return;
      }

      router.push(`../template/${newTemplate.id}`);
    },
    [templates, addTemplate, router]
  );

  // Redirect to active workout if one exists
  if (currentWorkout) {
    return (
      <Redirect
        href={{
          pathname: "../workout/active",
          params: {
            templateId: currentWorkout.templateId,
            workoutId: currentWorkout.workoutId,
          },
        }}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        edges={["top"]}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <HomeHeader />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="px-4 pt-6">
            <Text
              className={`text-base font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-3`}
            >
              My Routines
            </Text>

            {templates.length === 0 ? (
              <EmptyTemplates />
            ) : (
              <View>
                <FlashList
                  data={paginatedTemplates}
                  renderItem={renderItem}
                  estimatedItemSize={150}
                  ListHeaderComponent={ListHeaderComponent}
                  ListEmptyComponent={ListEmptyComponent}
                  contentContainerStyle={{ paddingBottom: 24 }}
                  ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                  onEndReached={handleEndReached}
                  onEndReachedThreshold={0.5}
                />
              </View>
            )}
          </View>

          {/* Example Templates Section */}
          <View className="px-4 pt-6">
            <Text
              className={`text-base font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-3`}
            >
              Example Routines
            </Text>
            <View>
              {exampleTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPress={() => handleUseTemplate(template.id)}
                  isLast={index === exampleTemplates.length - 1}
                  showAddIcon
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
