import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";
import { storage, zustandStorage } from '../storage/mmkv';
import type { BodyPart } from "../data/exercises";

const CURRENT_WORKOUT_KEY = "current_workout";

export interface ExerciseDefinition {
  id: string;
  name: string;
  bodyPart: string;
  defaultSets: number;
  defaultReps: number;
  isCustom?: boolean;
}

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  bodyPart: string;
};

export interface WorkoutSet {
  weight: number;
  reps: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Template {
  id: string;
  name: string;
  workouts: Workout[];
  createdAt: number;
  updatedAt: number;
}

export interface PersonalBest {
  id: string;
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  weight: number;
  reps: number;
  date: number;
}

export interface ActiveWorkout {
  templateId: string;
  workoutId: string;
  exercises: Record<string, WorkoutSet[]>;
  exerciseData: Record<string, {
    name: string;
    bodyPart: string;
    sets: number;
    reps: number;
  }>;
  startTime: number;
}

export interface LogExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutLog {
  id: string;
  templateId: string;
  templateName: string;
  workoutName: string;
  date: number;
  duration: number; // Duration in milliseconds
  exercises: LogExercise[];
}

interface TempState {
  tempWorkouts: Workout[];
  tempWorkoutName: string;
  tempTemplateName: string;
  
  // Temporary state actions
  addTempWorkout: (workout: Workout) => void;
  updateTempWorkout: (workout: Workout) => void;
  removeTempWorkout: (id: string) => void;
  clearTempWorkouts: () => void;
  setTempWorkoutName: (name: string) => void;
  setTempTemplateName: (name: string) => void;
  setTempWorkouts: (workouts: Workout[]) => void;
}

interface PersistedState {
  templates: Template[];
  workoutLogs: WorkoutLog[];
  personalBests: PersonalBest[];
  currentWorkout: ActiveWorkout | null;
  customExercises: ExerciseDefinition[];
  
  // Template actions
  addTemplate: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => boolean;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (templateId: string) => void;
  
  // Workout log actions
  addWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;
  deleteWorkoutLog: (logId: string) => void;
  
  // Personal best actions
  updatePersonalBest: (personalBest: PersonalBest) => void;
  
  // Current workout actions
  startCurrentWorkout: (templateId: string, workoutId: string) => void;
  updateCurrentSet: (exerciseId: string, setIndex: number, field: "weight" | "reps" | "rpe", value: number) => void;
  completeCurrentWorkout: () => void;
  quitCurrentWorkout: () => void;
  loadCurrentWorkout: () => void;
  addExerciseToCurrentWorkout: (exercise: Exercise) => void;
  removeExerciseFromCurrentWorkout: (exerciseId: string) => void;
  
  clearStorage: () => void;

  // Custom exercise actions
  addCustomExercise: (exercise: Omit<ExerciseDefinition, 'id' | 'isCustom'>) => string;
  updateCustomExercise: (exercise: ExerciseDefinition) => void;
  deleteCustomExercise: (id: string) => void;
  getCustomExercises: () => ExerciseDefinition[];
  getCustomExerciseById: (id: string) => ExerciseDefinition | undefined;

  // New actions
  addSetToExercise: (exerciseId: string, newSet: WorkoutSet) => void;
  removeSetFromExercise: (exerciseId: string, setIndex: number) => void;
}

// Create a separate store for temporary state with its own actions
export const useTempWorkoutStore = create<TempState>((set, get) => ({
  tempWorkouts: [],
  tempWorkoutName: "",
  tempTemplateName: "",
  
  addTempWorkout: (workout) => {
    console.log('Adding temp workout:', workout);
    set((state) => {
      const newWorkouts = [...state.tempWorkouts, workout];
      console.log('New temp workouts state:', newWorkouts);
      return {
        tempWorkouts: newWorkouts,
        tempWorkoutName: "",
      };
    });
  },

  updateTempWorkout: (workout) =>
    set((state) => ({
      tempWorkouts: state.tempWorkouts.map((w) =>
        w.id === workout.id ? workout : w
      ),
    })),

  removeTempWorkout: (id) =>
    set((state) => ({
      tempWorkouts: state.tempWorkouts.filter((w) => w.id !== id),
    })),

  clearTempWorkouts: () =>
    set({
      tempWorkouts: [],
      tempWorkoutName: "",
      tempTemplateName: "",
    }),

  setTempWorkoutName: (name) =>
    set({
      tempWorkoutName: name,
    }),

  setTempTemplateName: (name) =>
    set({
      tempTemplateName: name,
    }),

  setTempWorkouts: (workouts) =>
    set({
      tempWorkouts: workouts,
    }),
}));

// Create the main persisted store without temporary state
export const useWorkoutStore = create<PersistedState>()(
  persist(
    (set, get) => ({
      templates: [],
      workoutLogs: [],
      personalBests: [],
      currentWorkout: null,
      customExercises: [],

      // Load current workout from storage on app start
      loadCurrentWorkout: () => {
        try {
          const savedWorkout = storage.getString(CURRENT_WORKOUT_KEY);
          if (savedWorkout) {
            const parsedWorkout = JSON.parse(savedWorkout);
            set({ currentWorkout: parsedWorkout });
          }
        } catch (error) {
          console.error('Error loading current workout:', error);
        }
      },

      startCurrentWorkout: (templateId: string, workoutId: string) => {
        set((state) => {
          console.log('Starting workout...');
          const template = state.templates.find((t) => t.id === templateId);
          const workout = template?.workouts.find((w) => w.id === workoutId);

          if (!workout) return state;

          // Find the most recent workout log for this template and workout
          const lastWorkoutLog = state.workoutLogs.find(
            log => log.templateId === templateId && log.workoutName === workout.name
          );

          const exercises: Record<string, WorkoutSet[]> = {};
          const exerciseData: Record<string, {
            name: string;
            bodyPart: string;
            sets: number;
            reps: number;
          }> = {};

          workout.exercises.forEach((exercise) => {
            // Find the exercise in the last workout log
            const lastExercise = lastWorkoutLog?.exercises.find(e => e.name === exercise.name);
            
            if (lastExercise && lastExercise.sets.length > 0) {
              // Initialize with values from the last workout
              exercises[exercise.id] = Array(exercise.sets)
                .fill(null)
                .map((_, index) => {
                  // Use the last workout's set if available, otherwise use default values
                  const lastSet = lastExercise.sets[Math.min(index, lastExercise.sets.length - 1)];
                  return {
                    weight: lastSet.weight,
                    reps: lastSet.reps,
                    rpe: lastSet.rpe || 0
                  };
                });
            } else {
              // Initialize with default values if no previous workout data
              exercises[exercise.id] = Array(exercise.sets)
                .fill(null)
                .map(() => ({ weight: 0, reps: exercise.reps, rpe: 0 }));
            }
            
            exerciseData[exercise.id] = {
              name: exercise.name,
              bodyPart: exercise.bodyPart,
              sets: exercise.sets,
              reps: exercise.reps,
            };
          });

          const startTime = Date.now();
          console.log('Setting workout start time:', startTime);

          const currentWorkout = {
            templateId,
            workoutId,
            exercises,
            exerciseData,
            startTime,
          };

          // Save to storage
          storage.set(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));
          console.log('Saved workout to storage:', JSON.stringify(currentWorkout));

          return {
            ...state,
            currentWorkout,
          };
        });
      },

      updateCurrentSet: (exerciseId: string, setIndex: number, field: "weight" | "reps" | "rpe", value: number) => {
        set((state: PersistedState) => {
          if (!state.currentWorkout) return state;

          const exercises = { ...state.currentWorkout.exercises };
          const currentSets = [...(exercises[exerciseId] || [])];
          
          if (!currentSets[setIndex]) {
            currentSets[setIndex] = { weight: 0, reps: 0, rpe: 0 };
          }
          
          currentSets[setIndex] = {
            ...currentSets[setIndex],
            [field]: value,
          };
          
          exercises[exerciseId] = currentSets;

          const currentWorkout = {
            ...state.currentWorkout,
            exercises,
          };

          // Debounce storage update
          setTimeout(() => {
            storage.set(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));
          }, 500);

          return {
            ...state,
            currentWorkout,
          };
        });
      },

      completeCurrentWorkout: () => {
        try {
          console.log('Completing workout...');
          // Verify we have a current workout before cleanup
          const currentWorkout = get().currentWorkout;
          if (!currentWorkout) {
            console.log('No active workout to complete');
            return;
          }

          console.log('Current workout state:', currentWorkout);
          console.log('Start time from workout:', currentWorkout.startTime);

          const template = get().templates.find(t => t.id === currentWorkout.templateId);
          const workout = template?.workouts.find(w => w.id === currentWorkout.workoutId);

          if (!template || !workout) {
            console.log('Template or workout not found');
            return;
          }

          // Calculate duration
          const endTime = Date.now();
          console.log('End time:', endTime);
          const duration = currentWorkout.startTime ? endTime - currentWorkout.startTime : 0;
          console.log('Calculated duration:', duration, 'ms');
          console.log('Duration in minutes:', Math.floor(duration / 60000));

          // Create workout log
          const exercises: LogExercise[] = Object.entries(currentWorkout.exercises).map(
            ([exerciseId, sets]) => ({
              id: exerciseId,
              name: currentWorkout.exerciseData[exerciseId]?.name || "Exercise",
              sets: sets,
            })
          );

          const log: Omit<WorkoutLog, 'id'> = {
            templateId: template.id,
            templateName: template.name,
            workoutName: workout.name,
            date: endTime,
            duration: duration,
            exercises: exercises,
          };

          console.log('Creating workout log:', log);

          // Add the log
          get().addWorkoutLog(log);

          // Clear from storage first
          storage.delete(CURRENT_WORKOUT_KEY);
          console.log('Cleared workout from storage');
          
          // Then clear from state
          set((state) => ({
            ...state,
            currentWorkout: null
          }));

          console.log('Workout completed successfully with duration:', duration);
        } catch (error) {
          console.error('Error completing workout:', error);
          // Force cleanup in case of error
          storage.delete(CURRENT_WORKOUT_KEY);
          set((state) => ({
            ...state,
            currentWorkout: null
          }));
        }
      },

      quitCurrentWorkout: () => {
        try {
          console.log('Quitting workout...');
          // Clear from storage first
          storage.delete(CURRENT_WORKOUT_KEY);
          console.log('Cleared workout from storage');
          
          // Then clear from state
          set((state) => ({
            ...state,
            currentWorkout: null
          }));
        } catch (error) {
          console.error('Error quitting workout:', error);
          // Force cleanup in case of error
          storage.delete(CURRENT_WORKOUT_KEY);
          set((state) => ({
            ...state,
            currentWorkout: null
          }));
        }
      },

      clearStorage: () => {
        console.log('Starting storage clear process...');
        
        try {
          // Clear MMKV storage
          storage.delete(CURRENT_WORKOUT_KEY);

          // Reset state
          set({
            templates: [],
            workoutLogs: [],
            personalBests: [],
            currentWorkout: null,
            customExercises: [],
          });

          // Clear persisted storage
          zustandStorage.removeItem("workout-storage");
          console.log('Storage cleared successfully');
        } catch (error) {
          console.error('Error during storage clear:', error);
          
          // Simple recovery: just clear everything
          try {
            storage.delete(CURRENT_WORKOUT_KEY);
            zustandStorage.removeItem("workout-storage");
            set({
              templates: [],
              workoutLogs: [],
              personalBests: [],
              currentWorkout: null,
              customExercises: [],
            });
            console.log('Recovery completed');
          } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
          }
        }
      },

      addTemplate: (template) => {
        let success = false;
        set((state) => {
          // Check if template with same name already exists
          const nameExists = state.templates.some(t => t.name.toLowerCase() === template.name.toLowerCase());
          if (nameExists) {
            return state; // Return current state without changes
          }

          success = true;
          // If name doesn't exist, add the template
          return {
            templates: [
              ...state.templates,
              {
                ...template,
                id: Date.now().toString(),
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            ],
          };
        });
        return success;
      },

      updateTemplate: (template) => {
        set((state) => {
          const updatedTemplates = state.templates.map((t) =>
            t.id === template.id ? template : t
          );
          return { templates: updatedTemplates };
        });
      },

      deleteTemplate: (templateId) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== templateId),
        })),

      updatePersonalBest: (personalBest) =>
        set((state) => {
          console.log('Checking personal best:', personalBest);
          const existingIndex = state.personalBests.findIndex(
            (pb) => pb.exerciseId === personalBest.exerciseId
          );

          if (existingIndex === -1) {
            console.log('New personal best for exercise:', personalBest.exerciseName);
            return {
              personalBests: [...state.personalBests, personalBest],
            };
          }

          const existing = state.personalBests[existingIndex];
          let shouldUpdate = false;
          let reason = '';
          
          // Check if new weight is higher
          if (personalBest.weight > existing.weight) {
            shouldUpdate = true;
            reason = 'Higher weight';
          }
          // If weights are equal, check if reps are higher
          else if (personalBest.weight === existing.weight && personalBest.reps > existing.reps) {
            shouldUpdate = true;
            reason = 'More reps at same weight';
          }

          if (shouldUpdate) {
            console.log(`New personal best for ${personalBest.exerciseName}. Reason: ${reason}`);
            const updatedPersonalBests = [...state.personalBests];
            updatedPersonalBests[existingIndex] = personalBest;
            return {
              personalBests: updatedPersonalBests,
            };
          }

          console.log('No new personal best');
          return state;
        }),

      addCustomExercise: (exercise) => {
        const id = `custom-${Date.now()}`;
        set((state) => ({
          customExercises: [
            ...state.customExercises,
            {
              ...exercise,
              id,
              isCustom: true,
            },
          ],
        }));
        return id;
      },

      updateCustomExercise: (exercise) => {
        set((state) => {
          const updatedExercises = state.customExercises.map((e) =>
            e.id === exercise.id ? exercise : e
          );
          return { customExercises: updatedExercises };
        });
      },

      deleteCustomExercise: (id) => {
        set((state) => ({
          customExercises: state.customExercises.filter((e) => e.id !== id),
        }));
      },

      getCustomExercises: () => {
        return get().customExercises;
      },

      getCustomExerciseById: (id) => {
        return get().customExercises.find((e) => e.id === id);
      },

      addWorkoutLog: (log) =>
        set((state) => {
          console.log('Adding workout log with duration:', log.duration);
          const newLog = {
            ...log,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };
          console.log('New workout log:', newLog);
          return {
            ...state,
            workoutLogs: [newLog, ...state.workoutLogs],
          };
        }),

      deleteWorkoutLog: (logId) =>
        set((state) => ({
          workoutLogs: state.workoutLogs.filter((l) => l.id !== logId),
        })),

      addExerciseToCurrentWorkout: (exercise: Exercise) => {
        set((state) => {
          if (!state.currentWorkout) return state;

          // Create a single unique ID once
          const uniqueId = `${exercise.id}-${Date.now()}`;
          
          // Pre-create the set array with the correct size
          const sets = new Array(exercise.sets);
          const defaultSet = { weight: 0, reps: exercise.reps, rpe: 0 };
          for (let i = 0; i < exercise.sets; i++) {
            sets[i] = defaultSet;
          }

          // Create new workout state in a single operation
          const currentWorkout = {
            ...state.currentWorkout,
            exercises: {
              ...state.currentWorkout.exercises,
              [uniqueId]: sets
            },
            exerciseData: {
              ...state.currentWorkout.exerciseData,
              [uniqueId]: {
                name: exercise.name,
                bodyPart: exercise.bodyPart,
                sets: exercise.sets,
                reps: exercise.reps,
              }
            }
          };

          // Schedule storage update
          requestAnimationFrame(() => {
            storage.set(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));
          });

          return { ...state, currentWorkout };
        });
      },

      removeExerciseFromCurrentWorkout: (exerciseId: string) => {
        set((state) => {
          if (!state.currentWorkout) return state;

          const { [exerciseId]: removedExercise, ...remainingExercises } = state.currentWorkout.exercises;
          const { [exerciseId]: removedData, ...remainingData } = state.currentWorkout.exerciseData;

          const currentWorkout = {
            ...state.currentWorkout,
            exercises: remainingExercises,
            exerciseData: remainingData,
          };

          // Debounce storage update
          setTimeout(() => {
            storage.set(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));
          }, 500);

          return {
            ...state,
            currentWorkout,
          };
        });
      },

      addSetToExercise: (exerciseId: string, newSet: WorkoutSet) => {
        set((state: PersistedState) => {
          if (!state.currentWorkout) return state;

          const exercises = { ...state.currentWorkout.exercises };
          const currentSets = [...(exercises[exerciseId] || [])];
          
          // Deep clone the new set to avoid reference issues
          const clonedSet = { ...newSet };
          currentSets.push(clonedSet);
          
          exercises[exerciseId] = currentSets;

          const currentWorkout = {
            ...state.currentWorkout,
            exercises,
          };

          // Save to storage
          storage.set(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));

          return {
            ...state,
            currentWorkout,
          };
        });
      },

      removeSetFromExercise: (exerciseId: string, setIndex: number) => {
        set((state: PersistedState) => {
          if (!state.currentWorkout) return state;

          const exercises = { ...state.currentWorkout.exercises };
          const currentSets = [...(exercises[exerciseId] || [])];
          
          // Remove the specific set at setIndex
          if (setIndex >= 0 && setIndex < currentSets.length) {
            currentSets.splice(setIndex, 1);
            
            // Create a new array with properly indexed sets
            const reindexedSets = currentSets.map(set => ({ ...set }));
            exercises[exerciseId] = reindexedSets;

            const currentWorkout = {
              ...state.currentWorkout,
              exercises,
            };

            // Save to storage
            storage.set(CURRENT_WORKOUT_KEY, JSON.stringify(currentWorkout));

            return {
              ...state,
              currentWorkout,
            };
          }

          return state;
        });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

// Memoized selectors
export const useTemplates = () => useWorkoutStore((state) => state.templates);
export const usePersonalBests = () => useWorkoutStore((state) => state.personalBests);
export const useCustomExercises = () => useWorkoutStore((state) => state.customExercises);
export const useWorkoutLogs = () => useWorkoutStore((state) => state.workoutLogs);

// Add loading states and error handling
export const useTemplate = (id: string) => {
  const template = useWorkoutStore((state) => state.templates.find((t) => t.id === id));
  const isLoading = useWorkoutStore((state) => state.templates.length === 0);
  return { template, isLoading };
}; 