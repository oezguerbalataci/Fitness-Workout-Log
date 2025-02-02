import type { FormState } from "./types";

export interface Step {
  id: number;
  title: string;
  description: string;
  key: keyof FormState;
  isMulti?: boolean;
}

export const FORM_STEPS: Step[] = [
  {
    id: 1,
    title: "Experience Level",
    description: "Tell us about your fitness journey",
    key: "selectedLevel",
  },
  {
    id: 2,
    title: "Training Split",
    description: "How would you like to structure your workouts?",
    key: "selectedSplit",
  },
  {
    id: 3,
    title: "Training Goal",
    description: "What do you want to achieve?",
    key: "selectedGoal",
  },
  {
    id: 4,
    title: "Training Frequency",
    description: "How often can you train?",
    key: "selectedFrequency",
  },
  {
    id: 5,
    title: "Session Duration",
    description: "How long can you train per session?",
    key: "selectedDuration",
  },
  {
    id: 6,
    title: "Equipment",
    description: "What equipment do you have access to?",
    key: "selectedEquipment",
    isMulti: true,
  },
  {
    id: 7,
    title: "Limitations",
    description: "Any injuries or limitations we should know about?",
    key: "limitations",
  },
]; 