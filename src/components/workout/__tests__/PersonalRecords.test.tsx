import { render, screen, fireEvent } from "@testing-library/react-native";
import { useWorkoutStore } from "../../../store/workoutStore";
import WorkoutScreen from "../../../../app/(modals)/workout/[id]";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    id: "workout1",
    templateId: "template1",
  }),
}));

describe("Personal Records", () => {
  beforeEach(() => {
    // Clear the store before each test
    useWorkoutStore.getState().clearStorage();
  });

  it("should update personal record when completing a workout with higher weight", () => {
    // Setup initial state
    const store = useWorkoutStore.getState();

    // Create a template with a workout
    const template = {
      name: "Test Template",
      workouts: [
        {
          id: "workout1",
          name: "Test Workout",
          exercises: [
            {
              id: "exercise1",
              name: "Bench Press",
              sets: 3,
              reps: 10,
            },
          ],
        },
      ],
    };

    store.addTemplate(template);

    // Render workout screen
    render(<WorkoutScreen />);

    // Find weight inputs
    const weightInputs = screen.getAllByTestId(/weight-input-/);
    const repInputs = screen.getAllByTestId(/reps-input-/);

    // Set weights and reps for each set
    // Set 1: 100kg x 8 reps
    fireEvent.changeText(weightInputs[0], "100");
    fireEvent.changeText(repInputs[0], "8");

    // Set 2: 120kg x 6 reps (should become PR)
    fireEvent.changeText(weightInputs[1], "120");
    fireEvent.changeText(repInputs[1], "6");

    // Set 3: 80kg x 10 reps
    fireEvent.changeText(weightInputs[2], "80");
    fireEvent.changeText(repInputs[2], "10");

    // Complete workout
    const completeButton = screen.getByText("Complete Workout");
    fireEvent.press(completeButton);

    // Verify personal record was updated
    const personalBests = store.personalBests;
    expect(personalBests).toHaveLength(1);
    expect(personalBests[0]).toEqual(
      expect.objectContaining({
        exerciseId: "exercise1",
        exerciseName: "Bench Press",
        weight: 120,
        reps: 6,
      })
    );

    // Complete another workout with lower weight (shouldn't update PR)
    render(<WorkoutScreen />);

    const newWeightInputs = screen.getAllByTestId(/weight-input-/);
    const newRepInputs = screen.getAllByTestId(/reps-input-/);

    // Set 1: 100kg x 10 reps
    fireEvent.changeText(newWeightInputs[0], "100");
    fireEvent.changeText(newRepInputs[0], "10");

    const newCompleteButton = screen.getByText("Complete Workout");
    fireEvent.press(newCompleteButton);

    // Verify PR wasn't updated (still 120kg x 6)
    const updatedPersonalBests = store.personalBests;
    expect(updatedPersonalBests).toHaveLength(1);
    expect(updatedPersonalBests[0]).toEqual(
      expect.objectContaining({
        weight: 120,
        reps: 6,
      })
    );

    // Complete another workout with same weight but more reps (should update PR)
    render(<WorkoutScreen />);

    const finalWeightInputs = screen.getAllByTestId(/weight-input-/);
    const finalRepInputs = screen.getAllByTestId(/reps-input-/);

    // Set 1: 120kg x 8 reps (more reps at same weight)
    fireEvent.changeText(finalWeightInputs[0], "120");
    fireEvent.changeText(finalRepInputs[0], "8");

    const finalCompleteButton = screen.getByText("Complete Workout");
    fireEvent.press(finalCompleteButton);

    // Verify PR was updated with new reps
    const finalPersonalBests = store.personalBests;
    expect(finalPersonalBests).toHaveLength(1);
    expect(finalPersonalBests[0]).toEqual(
      expect.objectContaining({
        weight: 120,
        reps: 8,
      })
    );
  });
});
