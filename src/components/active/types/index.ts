import type Animated from "react-native-reanimated";

export interface SetData {
  weight: number;
  reps: number;
  rpe?: number;
}

export interface DraggableExerciseCardProps {
  exercise: {
    id: string;
    name: string;
  };
  positions: Animated.SharedValue<Record<string, number>>;
  scrollY: Animated.SharedValue<number>;
  isDarkMode: boolean;
  index: number;
  count: number;
}

export interface LocalInput {
  weight: string;
  reps: string;
  rpe: string;
}

export interface LocalInputs {
  [exerciseId: string]: {
    [setIndex: number]: LocalInput;
  };
}

export interface ExerciseSet {
  id: string;
  name: string;
  bodyPart: string;
  sets: number;
  reps: number;
} 