import {
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
  TextInput,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/Text";
import { exercises, bodyParts, type BodyPart } from "../../data/exercises";
import {
  useWorkoutStore,
  type ExerciseDefinition,
  type WorkoutSet,
} from "../../store/workoutStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useMemo } from "react";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  setExerciseSets: React.Dispatch<
    React.SetStateAction<Record<string, WorkoutSet[]>>
  >;
  setLocalInputs: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        Record<number, { weight: string; reps: string; rpe: string }>
      >
    >
  >;
}

export const AddExerciseModal = ({
  visible,
  onClose,
  isDarkMode,
  setExerciseSets,
  setLocalInputs,
}: AddExerciseModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    bodyPart: "" as BodyPart,
    defaultSets: "3",
    defaultReps: "10",
  });

  const addExerciseToCurrentWorkout = useWorkoutStore(
    (state) => state.addExerciseToCurrentWorkout
  );
  const addCustomExercise = useWorkoutStore((state) => state.addCustomExercise);
  const customExercises = useWorkoutStore((state) => state.customExercises);

  const filteredExercises = useMemo(() => {
    const allExercises = [...exercises, ...customExercises];
    if (!searchQuery.trim()) return allExercises;

    const query = searchQuery.toLowerCase().trim();
    return allExercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        exercise.bodyPart.toLowerCase().includes(query)
    );
  }, [searchQuery, customExercises]);

  const handleSelectExercise = (exercise: ExerciseDefinition) => {
    // Add to current workout first to get the generated ID
    addExerciseToCurrentWorkout({
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      sets: exercise.defaultSets,
      reps: exercise.defaultReps,
    });

    // Get the current workout to find the newly added exercise's ID
    const currentWorkout = useWorkoutStore.getState().currentWorkout;
    if (!currentWorkout) return;

    // Find the ID of the newly added exercise (it will be the last one added)
    const exerciseIds = Object.keys(currentWorkout.exerciseData);
    const newExerciseId = exerciseIds[exerciseIds.length - 1];

    const sets = Array(exercise.defaultSets)
      .fill(null)
      .map(() => ({ weight: 0, reps: exercise.defaultReps, rpe: 0 }));

    // Update local state with the same ID from the store
    setExerciseSets((prev) => ({
      ...prev,
      [newExerciseId]: sets,
    }));

    setLocalInputs((prev) => ({
      ...prev,
      [newExerciseId]: Object.fromEntries(
        sets.map((_, index) => [
          index,
          { weight: "0", reps: exercise.defaultReps.toString(), rpe: "" },
        ])
      ),
    }));

    onClose();
  };

  const handleCreateExercise = () => {
    if (!newExercise.name || !newExercise.bodyPart) return;

    const defaultSets = parseInt(newExercise.defaultSets) || 3;
    const defaultReps = parseInt(newExercise.defaultReps) || 10;

    // Add custom exercise and get ID
    const exerciseId = addCustomExercise({
      name: newExercise.name,
      bodyPart: newExercise.bodyPart,
      defaultSets,
      defaultReps,
    });

    // Add to current workout first
    addExerciseToCurrentWorkout({
      id: exerciseId,
      name: newExercise.name,
      bodyPart: newExercise.bodyPart,
      sets: defaultSets,
      reps: defaultReps,
    });

    // Get the current workout to find the newly added exercise's ID
    const currentWorkout = useWorkoutStore.getState().currentWorkout;
    if (!currentWorkout) return;

    // Find the ID of the newly added exercise (it will be the last one added)
    const exerciseIds = Object.keys(currentWorkout.exerciseData);
    const newExerciseId = exerciseIds[exerciseIds.length - 1];

    const sets = Array(defaultSets)
      .fill(null)
      .map(() => ({ weight: 0, reps: defaultReps, rpe: 0 }));

    // Update local state with the same ID from the store
    setExerciseSets((prev) => ({
      ...prev,
      [newExerciseId]: sets,
    }));

    setLocalInputs((prev) => ({
      ...prev,
      [newExerciseId]: Object.fromEntries(
        sets.map((_, index) => [
          index,
          { weight: "0", reps: defaultReps.toString(), rpe: "" },
        ])
      ),
    }));

    // Reset form and close
    setNewExercise({
      name: "",
      bodyPart: "" as BodyPart,
      defaultSets: "3",
      defaultReps: "10",
    });
    setShowCreateForm(false);
    onClose();
  };

  const renderExerciseItem = ({ item }: { item: ExerciseDefinition }) => (
    <TouchableOpacity
      onPress={() => handleSelectExercise(item)}
      className={`py-4 px-4 border-b ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="space-y-1">
          <Text
            variant="medium"
            className={`text-base ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="fitness-center"
                size={14}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
              <Text
                variant="regular"
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.bodyPart}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="repeat"
                size={14}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              />
              <Text
                variant="regular"
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.defaultSets} × {item.defaultReps}
              </Text>
            </View>
          </View>
        </View>
        {item.isCustom ? (
          <View className="bg-blue-500/90 px-2.5 py-1 rounded">
            <Text variant="regular" className="text-xs font-medium text-white">
              Custom
            </Text>
          </View>
        ) : (
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={isDarkMode ? "#6B7280" : "#9CA3AF"}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (showCreateForm) {
      return (
        <ScrollView className="flex-1">
          <View className="space-y-4">
            <View>
              <Text
                variant="medium"
                className={`text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Exercise Name
              </Text>
              <TextInput
                value={newExercise.name}
                onChangeText={(text) =>
                  setNewExercise((prev) => ({ ...prev, name: text }))
                }
                placeholder="Enter exercise name"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              />
            </View>

            <View>
              <Text
                variant="regular"
                className={`text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Body Part
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {bodyParts.map((part) => (
                  <TouchableOpacity
                    key={part}
                    onPress={() =>
                      setNewExercise((prev) => ({ ...prev, bodyPart: part }))
                    }
                    className={`px-3 py-1 rounded-full ${
                      newExercise.bodyPart === part
                        ? isDarkMode
                          ? "bg-blue-500"
                          : "bg-blue-600"
                        : isDarkMode
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      variant="regular"
                      className={`${
                        newExercise.bodyPart === part
                          ? "text-white"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {part}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text
                  variant="regular"
                  className={`text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Default Sets
                </Text>
                <TextInput
                  value={newExercise.defaultSets}
                  onChangeText={(text) =>
                    setNewExercise((prev) => ({ ...prev, defaultSets: text }))
                  }
                  placeholder="3"
                  keyboardType="number-pad"
                  placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
              </View>

              <View className="flex-1">
                <Text
                  variant="regular"
                  className={`text-sm font-medium mb-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Default Reps
                </Text>
                <TextInput
                  value={newExercise.defaultReps}
                  onChangeText={(text) =>
                    setNewExercise((prev) => ({ ...prev, defaultReps: text }))
                  }
                  placeholder="10"
                  keyboardType="number-pad"
                  placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <>
        <View className="mb-4">
          <View
            className={`flex-row items-center px-4 py-2 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
            <TextInput
              placeholder="Search exercises..."
              placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className={`flex-1 ml-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          ListHeaderComponent={
            <TouchableOpacity
              onPress={() => setShowCreateForm(true)}
              className={`mb-4 p-4 rounded-lg flex-row items-center justify-center ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <MaterialIcons
                name="add"
                size={24}
                color={isDarkMode ? "white" : "black"}
              />
              <Text
                variant="medium"
                className={`ml-2 font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Create Custom Exercise
              </Text>
            </TouchableOpacity>
          }
        />
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        edges={["top", "left", "right"]}
      >
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              onPress={onClose}
              className={`w-10 h-10 items-center justify-center rounded-lg ${
                isDarkMode ? "active:bg-gray-800" : "active:bg-gray-50"
              }`}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
            <Text
              variant="bold"
              className={`text-xl ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {showCreateForm ? "New Exercise" : "Add Exercise"}
            </Text>
          </View>
        </View>

        <View className="flex-1 px-4">{renderContent()}</View>

        <SafeAreaView edges={["bottom"]} className="px-4 py-4">
          {showCreateForm && (
            <TouchableOpacity
              onPress={handleCreateExercise}
              disabled={!newExercise.name || !newExercise.bodyPart}
              className={`p-4 rounded-lg ${
                !newExercise.name || !newExercise.bodyPart
                  ? isDarkMode
                    ? "bg-gray-800"
                    : "bg-gray-100"
                  : isDarkMode
                  ? "bg-blue-500"
                  : "bg-blue-600"
              }`}
            >
              <Text
                variant="medium"
                className={`text-center font-medium ${
                  !newExercise.name || !newExercise.bodyPart
                    ? isDarkMode
                      ? "text-gray-600"
                      : "text-gray-400"
                    : "text-white"
                }`}
              >
                Create Exercise
              </Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
};
