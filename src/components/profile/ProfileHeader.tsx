import { View, TouchableOpacity, Alert } from "react-native";
import { Text } from "../../components/Text";
import { useThemeStore } from "../../store/themeStore";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function ProfileHeader() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Get display name based on sign-up method
  const displayName = user
    ? user.username ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Profile"
    : "Profile";

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Error signing out:", error);
          }
        },
      },
    ]);
  };

  return (
    <View
      className={`px-6 pt-6 pb-8 border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-100"
      }`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text
          variant="bold"
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {displayName}
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className={`p-2 rounded-full ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <MaterialIcons
            name="logout"
            size={24}
            color={isDarkMode ? "#9ca3af" : "#4b5563"}
          />
        </TouchableOpacity>
      </View>
      <Text
        variant="regular"
        className={`text-base ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {user?.username
          ? "@" + user.username
          : "Track your progress and achievements"}
      </Text>
    </View>
  );
}
