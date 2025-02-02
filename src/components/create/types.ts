import type { Template } from "../../store/workoutStore";

export interface FormOption {
  label: string;
  value: string;
}

export const experienceLevels: FormOption[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

export const splitTypes: FormOption[] = [
  { label: "Full Body", value: "full_body" },
  { label: "Push Pull Legs", value: "ppl" },
  { label: "Upper Lower", value: "upper_lower" },
  { label: "Body Part Split", value: "body_part" },
];

export const trainingGoals: FormOption[] = [
  { label: "Build Muscle", value: "muscle_gain" },
  { label: "Gain Strength", value: "strength" },
  { label: "Lose Fat", value: "fat_loss" },
  { label: "Improve Endurance", value: "endurance" },
  { label: "General Fitness", value: "general_fitness" },
];

export const availableEquipment: FormOption[] = [
  { label: "Full Gym", value: "full_gym" },
  { label: "Dumbbells Only", value: "dumbbells" },
  { label: "Bodyweight Only", value: "bodyweight" },
  { label: "Resistance Bands", value: "bands" },
  { label: "Basic Home Gym", value: "basic_home" },
];

export const frequencyOptions: FormOption[] = [
  { label: "2-3 days", value: "2" },
  { label: "3-4 days", value: "3" },
  { label: "4-5 days", value: "4" },
  { label: "5-6 days", value: "5" },
];

export const durationOptions: FormOption[] = [
  { label: "30 minutes", value: "30" },
  { label: "45 minutes", value: "45" },
  { label: "60 minutes", value: "60" },
  { label: "90 minutes", value: "90" },
];

export const aiProviders: FormOption[] = [
  { label: "Gemini", value: "gemini" },
];

export interface FormState {
  selectedLevel: string;
  selectedSplit: string;
  selectedGoal: string;
  selectedFrequency: string;
  selectedDuration: string;
  selectedEquipment: string[];
  limitations: string;
  selectedProvider: string;
} 