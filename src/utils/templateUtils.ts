import { Template } from "../store/workoutStore";

/**
 * Checks if a template with the same name exists in the given templates array
 * @param templates - Array of existing templates
 * @param templateName - Name to check for
 * @returns boolean indicating if the name exists
 */
export const checkTemplateNameExists = (
  templates: Template[],
  templateName: string
): boolean => {
  return templates.some(
    (t) => t.name.toLowerCase() === templateName.toLowerCase()
  );
};

/**
 * Checks if a template with identical workouts exists in the given templates array
 * @param templates - Array of existing templates
 * @param template - Template to check for
 * @returns boolean indicating if an identical template exists
 */
export const checkTemplateWorkoutsExist = (
  templates: Template[],
  template: Template
): boolean => {
  return templates.some((existingTemplate) => {
    // Check if number of workouts match
    if (existingTemplate.workouts.length !== template.workouts.length) {
      return false;
    }

    // Check each workout
    return existingTemplate.workouts.every((existingWorkout, index) => {
      const templateWorkout = template.workouts[index];

      // Check if exercises match
      if (
        existingWorkout.exercises.length !== templateWorkout.exercises.length
      ) {
        return false;
      }

      // Check each exercise
      return existingWorkout.exercises.every(
        (existingExercise, exerciseIndex) => {
          const templateExercise = templateWorkout.exercises[exerciseIndex];
          return (
            existingExercise.name === templateExercise.name &&
            existingExercise.sets === templateExercise.sets &&
            existingExercise.reps === templateExercise.reps
          );
        }
      );
    });
  });
}; 