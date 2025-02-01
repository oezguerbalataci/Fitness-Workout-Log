import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore } from "../../src/store/workoutStore";
import { useThemeStore } from "../../src/store/themeStore";
import { ProfileHeader } from "../../src/components/profile/ProfileHeader";
import { StatsOverview } from "../../src/components/profile/StatsOverview";
import { PersonalRecords } from "../../src/components/profile/PersonalRecords";
import { ThemeToggle } from "../../src/components/profile/ThemeToggle";
import { useCallback } from "react";

export default function ProfileScreen() {
  const clearStorage = useWorkoutStore((state) => state.clearStorage);
  const personalBests = useWorkoutStore((state) => state.personalBests);
  const workoutLogs = useWorkoutStore((state) => state.workoutLogs);
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handleResetData = useCallback(() => {
    Alert.alert(
      "Reset All Data",
      "Are you sure you want to reset all data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            clearStorage();
          },
        },
      ]
    );
  }, [clearStorage]);

  const StaticContent = useCallback(
    () => (
      <View>
        <ProfileHeader />
        <ThemeToggle />
        <StatsOverview
          personalBestsCount={personalBests.length}
          workoutLogsCount={workoutLogs.length}
        />
      </View>
    ),
    [personalBests.length, workoutLogs.length]
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      edges={["bottom", "top"]}
    >
      <PersonalRecords
        personalBests={personalBests}
        onResetData={handleResetData}
        ListHeaderComponent={StaticContent}
      />
    </SafeAreaView>
  );
}
