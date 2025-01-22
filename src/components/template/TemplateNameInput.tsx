import { View, Text, TextInput } from "react-native";
import { useTempWorkoutStore } from "../../store/workoutStore";

export function TemplateNameInput() {
  const { tempTemplateName, setTempTemplateName } = useTempWorkoutStore(
    (state) => ({
      tempTemplateName: state.tempTemplateName || "",
      setTempTemplateName: state.setTempTemplateName,
    })
  );

  return (
    <View className="space-y-2">
      <Text className="text-lg font-semibold text-foreground">
        Template Name
      </Text>
      <TextInput
        value={tempTemplateName}
        onChangeText={(text) => setTempTemplateName(text || "")}
        placeholder="e.g., Full Body Workout"
        placeholderTextColor="#64748b"
        className="bg-card rounded-xl p-4 border border-input text-foreground"
      />
    </View>
  );
}
