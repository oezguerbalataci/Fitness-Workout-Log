import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Layout,
  SlideOutRight,
  FadeIn,
  SlideInRight,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { DraggableExerciseCard } from "./DraggableExerciseCard";

interface Exercise {
  id: string;
  name: string;
  bodyPart?: string;
  sets?: number;
  reps?: number;
}

interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
}

interface ExerciseListProps {
  isDarkMode: boolean;
  isEditMode: boolean;
  activeExercises: Exercise[];
  exerciseSets: Record<string, SetData[]>;
  localInputs: Record<
    string,
    Record<number, { weight: string; reps: string; rpe: string }>
  >;
  positions: Animated.SharedValue<Record<string, number>>;
  scrollY: Animated.SharedValue<number>;
  onSetInputChange: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "rpe",
    value: string
  ) => void;
  onSetInputBlur: (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "rpe",
    value: string
  ) => void;
  onSetAdd: (exerciseId: string) => void;
  onSetRemove: (exerciseId: string, setIndex: number) => void;
  onRemoveExercise: (exerciseId: string) => void;
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
});

export function ExerciseList({
  isDarkMode,
  isEditMode,
  activeExercises,
  exerciseSets,
  localInputs,
  positions,
  scrollY,
  onSetInputChange,
  onSetInputBlur,
  onSetAdd,
  onSetRemove,
  onRemoveExercise,
}: ExerciseListProps) {
  return (
    <View
      style={{
        height: isEditMode ? activeExercises.length * 56 + 16 : "auto",
        paddingBottom: 24,
      }}
    >
      {isEditMode ? (
        <View style={{ position: "relative" }}>
          {activeExercises.map((exercise, index) => (
            <DraggableExerciseCard
              key={exercise.id}
              exercise={exercise}
              positions={positions}
              scrollY={scrollY}
              isDarkMode={isDarkMode}
              index={index}
              count={activeExercises.length}
            />
          ))}
        </View>
      ) : (
        <View className="gap-4 px-4">
          {activeExercises.map((exercise, index) => (
            <Animated.View
              key={exercise.id}
              entering={FadeIn.delay(index * 100)}
              layout={Layout.springify()}
              className={`p-5 rounded-2xl overflow-hidden ${
                isDarkMode ? "bg-gray-800/80" : "bg-white"
              }`}
              style={isDarkMode ? {} : styles.lightShadow}
            >
              {/* Decorative Circle */}
              <View
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
                style={{
                  backgroundColor: isDarkMode ? "#ffffff" : "#000000",
                }}
              />

              {/* Exercise Header */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {exercise.name}
                  </Text>
                  <Text
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {exerciseSets[exercise.id]?.length || 0} sets completed
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => onRemoveExercise(exercise.id)}
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                  }`}
                >
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {/* Sets */}
              <View className="gap-3">
                {exerciseSets[exercise.id]?.map((set, setIndex) => (
                  <Animated.View
                    key={setIndex}
                    entering={SlideInRight.delay(setIndex * 50)}
                    exiting={SlideOutRight}
                    layout={Layout.springify()}
                    className={`flex-row items-center gap-3 p-3 rounded-xl ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <Text
                      className={`w-8 text-center font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {setIndex + 1}
                    </Text>
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className="flex-1">
                        <TextInput
                          value={localInputs[exercise.id]?.[setIndex]?.weight}
                          onChangeText={(value) =>
                            onSetInputChange(
                              exercise.id,
                              setIndex,
                              "weight",
                              value
                            )
                          }
                          onBlur={() =>
                            onSetInputBlur(
                              exercise.id,
                              setIndex,
                              "weight",
                              localInputs[exercise.id]?.[setIndex]?.weight || ""
                            )
                          }
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={
                            isDarkMode ? "#6B7280" : "#9CA3AF"
                          }
                          className={`text-base text-center py-2 px-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-900"
                          }`}
                        />
                        <Text
                          className={`text-xs text-center mt-1 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          kg
                        </Text>
                      </View>
                      <View className="flex-1">
                        <TextInput
                          value={localInputs[exercise.id]?.[setIndex]?.reps}
                          onChangeText={(value) =>
                            onSetInputChange(
                              exercise.id,
                              setIndex,
                              "reps",
                              value
                            )
                          }
                          onBlur={() =>
                            onSetInputBlur(
                              exercise.id,
                              setIndex,
                              "reps",
                              localInputs[exercise.id]?.[setIndex]?.reps || ""
                            )
                          }
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={
                            isDarkMode ? "#6B7280" : "#9CA3AF"
                          }
                          className={`text-base text-center py-2 px-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-900"
                          }`}
                        />
                        <Text
                          className={`text-xs text-center mt-1 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          reps
                        </Text>
                      </View>
                      <View className="flex-1">
                        <TextInput
                          value={localInputs[exercise.id]?.[setIndex]?.rpe}
                          onChangeText={(value) =>
                            onSetInputChange(
                              exercise.id,
                              setIndex,
                              "rpe",
                              value
                            )
                          }
                          onBlur={() =>
                            onSetInputBlur(
                              exercise.id,
                              setIndex,
                              "rpe",
                              localInputs[exercise.id]?.[setIndex]?.rpe || ""
                            )
                          }
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={
                            isDarkMode ? "#6B7280" : "#9CA3AF"
                          }
                          className={`text-base text-center py-2 px-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-900"
                          }`}
                          maxLength={2}
                        />
                        <Text
                          className={`text-xs text-center mt-1 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          RPE
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => onSetRemove(exercise.id, setIndex)}
                      className={`h-8 w-8 items-center justify-center rounded-full ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <MaterialIcons
                        name="remove"
                        size={20}
                        color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>

              {/* Add Set Button */}
              <TouchableOpacity
                onPress={() => onSetAdd(exercise.id)}
                className={`mt-3 flex-row items-center justify-center py-3 rounded-xl ${
                  isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
                }`}
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={isDarkMode ? "#fff" : "#000"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add Set
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
}
