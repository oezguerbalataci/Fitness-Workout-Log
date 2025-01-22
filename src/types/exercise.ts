export type BodyPart =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Full Body"
  | "Cardio";

export interface ExerciseDefinition {
  id: string;
  name: string;
  bodyPart: BodyPart;
  defaultSets: number;
  defaultReps: number;
} 