import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../../src/components/ui/Header";
import { useWorkoutStore } from "../../../src/store/workoutStore";

const bodyParts = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
  "Cardio",
];

export default function NewExerciseModal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [bodyPart, setBodyPart] = useState(bodyParts[0]);
  const [defaultSets, setDefaultSets] = useState("3");
  const [defaultReps, setDefaultReps] = useState("10");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addCustomExercise = useWorkoutStore((state) => state.addCustomExercise);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Exercise name is required";
    }
    if (isNaN(Number(defaultSets)) || Number(defaultSets) < 1) {
      newErrors.defaultSets = "Sets must be a positive number";
    }
    if (isNaN(Number(defaultReps)) || Number(defaultReps) < 1) {
      newErrors.defaultReps = "Reps must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    addCustomExercise({
      name: name.trim(),
      bodyPart,
      defaultSets: Number(defaultSets),
      defaultReps: Number(defaultReps),
    });

    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-900"
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center justify-between px-4 py-4">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-lg active:bg-gray-800"
          >
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-xl font-medium text-white">New Exercise</Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!name.trim()}
          className={`px-5 h-10 items-center justify-center rounded-lg ${
            !name.trim() ? "bg-gray-800" : "bg-black active:bg-gray-900"
          }`}
        >
          <Text
            className={`font-medium ${
              !name.trim() ? "text-gray-600" : "text-white"
            }`}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="space-y-6">
          <View className="space-y-2">
            <Text className="text-base font-medium text-white">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Bench Press"
              placeholderTextColor="#4b5563"
              className="rounded-lg p-4 bg-gray-800 text-white"
            />
            {errors.name && (
              <Text className="text-red-500 text-sm">{errors.name}</Text>
            )}
          </View>

          <View className="space-y-2">
            <Text className="text-base font-medium text-white">Body Part</Text>
            <View className="flex-row flex-wrap gap-2">
              {bodyParts.map((part) => (
                <TouchableOpacity
                  key={part}
                  onPress={() => setBodyPart(part)}
                  className={`px-4 py-2 rounded-lg ${
                    bodyPart === part ? "bg-black" : "bg-gray-800"
                  }`}
                >
                  <Text
                    className={`${
                      bodyPart === part ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {part}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row space-x-4">
            <View className="flex-1 space-y-2">
              <Text className="text-base font-medium text-white">
                Default Sets
              </Text>
              <TextInput
                value={defaultSets}
                onChangeText={setDefaultSets}
                placeholder="3"
                placeholderTextColor="#4b5563"
                keyboardType="number-pad"
                className="rounded-lg p-4 bg-gray-800 text-white"
              />
              {errors.defaultSets && (
                <Text className="text-red-500 text-sm">
                  {errors.defaultSets}
                </Text>
              )}
            </View>

            <View className="flex-1 space-y-2">
              <Text className="text-base font-medium text-white">
                Default Reps
              </Text>
              <TextInput
                value={defaultReps}
                onChangeText={setDefaultReps}
                placeholder="10"
                placeholderTextColor="#4b5563"
                keyboardType="number-pad"
                className="rounded-lg p-4 bg-gray-800 text-white"
              />
              {errors.defaultReps && (
                <Text className="text-red-500 text-sm">
                  {errors.defaultReps}
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="px-4 py-4" />
    </SafeAreaView>
  );
}
