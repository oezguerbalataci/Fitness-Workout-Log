import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { styles } from "./styles";
import { DraggableExerciseCardProps } from "./types";

export function DraggableExerciseCard({
  exercise,
  positions,
  scrollY,
  isDarkMode,
  index,
  count,
}: DraggableExerciseCardProps) {
  const translateY = useSharedValue(0);
  const isActive = useSharedValue(false);
  const currentPosition = useSharedValue(index);
  const CARD_HEIGHT = 56;

  const gesture = Gesture.Pan()
    .onStart(() => {
      isActive.value = true;
      currentPosition.value = positions.value[exercise.id];
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
      const newPosition = Math.round(
        (currentPosition.value * CARD_HEIGHT + event.translationY) / CARD_HEIGHT
      );

      // Clamp the position between 0 and count-1
      const clampedPosition = Math.max(0, Math.min(count - 1, newPosition));

      if (clampedPosition !== positions.value[exercise.id]) {
        const oldPosition = positions.value[exercise.id];
        const newPositions = { ...positions.value };

        Object.keys(positions.value).forEach((key) => {
          const pos = positions.value[key];
          if (key === exercise.id) {
            newPositions[key] = clampedPosition;
          } else if (
            oldPosition < clampedPosition &&
            pos > oldPosition &&
            pos <= clampedPosition
          ) {
            newPositions[key] = pos - 1;
          } else if (
            oldPosition > clampedPosition &&
            pos < oldPosition &&
            pos >= clampedPosition
          ) {
            newPositions[key] = pos + 1;
          }
        });

        positions.value = newPositions;
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
      isActive.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const position = positions.value[exercise.id];
    const top = position * CARD_HEIGHT;

    return {
      position: "absolute",
      left: 0,
      right: 0,
      top,
      zIndex: isActive.value ? 1000 : 1,
      transform: [
        { translateY: translateY.value },
        {
          scale: withSpring(isActive.value ? 1.03 : 1, {
            mass: 0.5,
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isActive.value
        ? withSpring(
            isDarkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)",
            {
              mass: 0.5,
              damping: 15,
              stiffness: 200,
            }
          )
        : withSpring(
            isDarkMode ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 1)",
            {
              mass: 0.5,
              damping: 15,
              stiffness: 200,
            }
          ),
      transform: [
        {
          scale: withSpring(isActive.value ? 1.02 : 1, {
            mass: 0.5,
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle]} className="px-4 mb-1">
        <Animated.View
          className={`py-2.5 px-4 rounded-lg overflow-hidden ${
            isDarkMode ? "bg-gray-800/80" : "bg-white"
          }`}
          style={[isDarkMode ? {} : styles.draggableCard, containerStyle]}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text
                className={`text-sm font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {exercise.name}
              </Text>
            </View>
            <MaterialIcons
              name="drag-handle"
              size={20}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
