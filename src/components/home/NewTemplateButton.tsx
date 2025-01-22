import { TouchableOpacity } from "react-native";
import { Text } from "../../components/Text";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export function NewTemplateButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/template/new")}
      className="flex-row items-center justify-center space-x-2 bg-blue-500 mx-4 p-4 rounded-xl shadow-sm active:opacity-70"
    >
      <MaterialIcons name="add" size={24} color="white" />
      <Text variant="bold" className="text-white font-semibold text-base">
        Create New Template
      </Text>
    </TouchableOpacity>
  );
}
