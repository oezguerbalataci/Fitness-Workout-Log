import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore, Template } from "../../src/store/workoutStore";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, Redirect, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  FadeInUp,
  Layout,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { exampleTemplates } from "../../src/data/exampleTemplates";
import { TemplateCard } from "../../src/components/template/TemplateCard";
import { EmptyTemplates } from "../../src/components/template/EmptyTemplates";
import {
  checkTemplateNameExists,
  checkTemplateWorkoutsExist,
} from "../../src/utils/templateUtils";
import { useThemeStore } from "../../src/store/themeStore";
import { useAuth } from "../../src/hooks/useAuth";

const HEADER_HEIGHT = 120;
const SCROLL_DISTANCE = 100;
const ITEMS_PER_PAGE = 10;

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function Section({ title, subtitle, children, action }: SectionProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-2">
        <View>
          <Text
            className={`text-2xl font-bold mb-1 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "SF Pro Display" }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
              style={{ fontFamily: "SF Pro Text" }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

function AddButton({ onPress }: { onPress: () => void }) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-full ${
        isDarkMode ? "bg-blue-500" : "bg-black"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <MaterialIcons name="add" size={20} color="#fff" />
      <Text className="text-white font-medium ml-1">New Template</Text>
    </TouchableOpacity>
  );
}

function TemplateGrid({
  templates,
  onPress,
  showAddIcon = false,
}: {
  templates: Template[];
  onPress: (id: string) => void;
  showAddIcon?: boolean;
}) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { width } = useWindowDimensions();
  const cardWidth = (width - 48 - 16) / 2; // 48 for padding, 16 for gap

  return (
    <View className="flex-row flex-wrap" style={{ gap: 16 }}>
      {templates.map((template, index) => (
        <Animated.View
          key={template.id}
          entering={FadeInUp.delay(index * 50)}
          layout={Layout.springify()}
          style={{ width: cardWidth }}
        >
          <TouchableOpacity
            onPress={() => onPress(template.id)}
            className={`p-4 rounded-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDarkMode ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="items-center justify-center mb-3 h-20">
              <Ionicons
                name={showAddIcon ? "duplicate" : "barbell-outline"}
                size={32}
                color={isDarkMode ? "#fff" : "#374151"}
              />
            </View>
            <Text
              className={`text-base font-semibold text-center mb-1 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              numberOfLines={1}
            >
              {template.name}
            </Text>
            <Text
              className={`text-sm text-center ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
              numberOfLines={1}
            >
              {template.workouts.length} workouts
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
}

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
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -HEADER_HEIGHT],
      "clamp"
    );

    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [1, 0],
      "clamp"
    );

    return {
      transform: [{ translateY }],
      opacity,
      position: "relative",
      zIndex: 1,
    };
  });

  const handleEndReached = useCallback(() => {
    if (templates.length < page * ITEMS_PER_PAGE) {
      setPage((prev) => prev + 1);
    }
  }, [templates.length]);

  const renderItem = useCallback(
    ({ item: template, index }: { item: Template; index: number }) => (
      <Animated.View
        entering={FadeInUp.delay(index * 100)}
        layout={Layout.springify()}
      >
        <TemplateCard
          key={template.id}
          template={template}
          onPress={() => router.push(`/template/${template.id}`)}
          isLast={index === templates.length - 1}
        />
      </Animated.View>
    ),
    [router, templates.length]
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

  const paginatedTemplates = templates.slice(0, page * ITEMS_PER_PAGE);

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

        <Animated.ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Animated.View style={headerStyle}>
            <View className="py-6 px-6">
              <Text
                className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
                style={{ fontFamily: "SF Pro Display" }}
              >
                Workout Templates
              </Text>
              <Text
                className={`text-base ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
                style={{ fontFamily: "SF Pro Text" }}
              >
                Create and manage your workout routines
              </Text>
            </View>
          </Animated.View>

          <View className="px-6">
            <Section
              title="My Routines"
              subtitle={`${templates.length} custom templates`}
              action={
                <AddButton onPress={() => router.push("/template/new")} />
              }
            >
              {templates.length === 0 ? (
                <Animated.View entering={FadeInUp}>
                  <EmptyTemplates />
                </Animated.View>
              ) : (
                <TemplateGrid
                  templates={paginatedTemplates}
                  onPress={(id) => router.push(`/template/${id}`)}
                />
              )}
            </Section>

            <Section
              title="Example Routines"
              subtitle="Pre-made templates to get you started"
            >
              <TemplateGrid
                templates={exampleTemplates}
                onPress={handleUseTemplate}
                showAddIcon
              />
            </Section>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
