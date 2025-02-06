import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";

interface FloatingFinishButtonProps {
  isDarkMode: boolean;
  headerHeight: number;
  scrollY: Animated.SharedValue<number>;
  onPress: () => void;
}

const styles = StyleSheet.create({
  floatingFinish: {
    position: "absolute",
    right: 16,
    bottom: 60,
    zIndex: 50,
  },
  floatingShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});

export function FloatingFinishButton({
  isDarkMode,
  headerHeight,
  scrollY,
  onPress,
}: FloatingFinishButtonProps) {
  return (
    <Animated.View
      style={[
        styles.floatingFinish,
        useAnimatedStyle(() => {
          const opacity = interpolate(
            scrollY.value,
            [0, headerHeight],
            [0, 1],
            Extrapolate.CLAMP
          );
          return {
            opacity,
          };
        }),
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        className={`h-14 w-14 items-center justify-center rounded-full ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
        style={styles.floatingShadow}
      >
        <MaterialIcons
          name="check"
          size={28}
          color={isDarkMode ? "#000" : "#fff"}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}
