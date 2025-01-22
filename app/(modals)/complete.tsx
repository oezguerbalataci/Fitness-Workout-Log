import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function WorkoutCompleteModal() {
  const router = useRouter();

  const handleViewHistory = () => {
    router.push("../tabs/logs" as const);
  };

  const handleReturnHome = () => {
    router.push("../tabs/index" as const);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <View style={{ alignItems: "center", gap: 16 }}>
        <MaterialIcons name="fitness-center" size={64} color="#0284c7" />
        <Text
          variant="bold"
          style={{
            fontSize: 24,
            color: "#0f172a",
            textAlign: "center",
          }}
        >
          Workout Complete!
        </Text>
        <Text
          variant="regular"
          style={{ fontSize: 16, color: "#64748b", textAlign: "center" }}
        >
          Great job! Your workout has been logged and you're one step closer to
          your goals.
        </Text>

        <View style={{ width: "100%", gap: 12, marginTop: 32 }}>
          <TouchableOpacity
            onPress={handleViewHistory}
            style={{
              backgroundColor: "#0284c7",
              borderRadius: 8,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="history" size={24} color="#fff" />
            <Text
              variant="medium"
              style={{ color: "#fff", textAlign: "center" }}
            >
              View History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleReturnHome}
            style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <MaterialIcons name="home" size={24} color="#0284c7" />
            <Text
              variant="medium"
              style={{
                color: "#0284c7",
                textAlign: "center",
              }}
            >
              Return Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
