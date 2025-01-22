import { render, screen, fireEvent } from "@testing-library/react-native";
import WorkoutScreen from "../../../../app/(modals)/workout/[id]";
import { useWorkoutStore } from "../../../store/workoutStore";

// Mock the router and other dependencies
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    id: "workout1",
    templateId: "template1",
  }),
  Stack: {
    Screen: () => null,
  },
}));

// Mock vector icons
jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

describe("WorkoutScreen", () => {
  beforeEach(() => {
    // Reset the store before each test
    useWorkoutStore.setState({
      templates: [
        {
          id: "template1",
          name: "Push Day",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          workouts: [
            {
              id: "workout1",
              name: "Chest & Shoulders",
              exercises: [
                {
                  id: "ex1",
                  name: "Bench Press",
                  sets: 3,
                  reps: 10,
                },
              ],
            },
          ],
        },
      ],
      workoutLogs: [],
      personalBests: [],
    });
  });

  it("should show last workout weights and reps as placeholders when starting the same workout again", () => {
    // First, add a workout log
    useWorkoutStore.setState((state) => ({
      ...state,
      workoutLogs: [
        ...state.workoutLogs,
        {
          id: "log1",
          templateId: "template1",
          templateName: "Push Day",
          workoutName: "Chest & Shoulders",
          date: Date.now(),
          exercises: [
            {
              id: "ex1",
              name: "Bench Press",
              sets: [
                { weight: 60, reps: 10 },
                { weight: 65, reps: 8 },
                { weight: 70, reps: 6 },
              ],
            },
          ],
        },
      ],
    }));

    // Render the workout screen
    render(<WorkoutScreen />);

    // Check if the exercise name is displayed
    expect(screen.getByText("Bench Press")).toBeTruthy();

    // Get all weight inputs
    const weightInputs = screen.getAllByTestId(/weight-input/);
    expect(weightInputs).toHaveLength(3);
    expect(weightInputs[0].props.placeholder).toBe("60");
    expect(weightInputs[1].props.placeholder).toBe("65");
    expect(weightInputs[2].props.placeholder).toBe("70");

    // Get all rep inputs
    const repInputs = screen.getAllByTestId(/reps-input/);
    expect(repInputs).toHaveLength(3);
    expect(repInputs[0].props.placeholder).toBe("10");
    expect(repInputs[1].props.placeholder).toBe("8");
    expect(repInputs[2].props.placeholder).toBe("6");

    // Verify initial values are empty
    weightInputs.forEach((input) => expect(input.props.value).toBe(""));
    repInputs.forEach((input) => expect(input.props.value).toBe(""));
  });

  it("should properly store and update exercise sets", () => {
    // Render the workout screen
    render(<WorkoutScreen />);

    // Get all weight and rep inputs
    const weightInputs = screen.getAllByTestId(/weight-input/);
    const repInputs = screen.getAllByTestId(/reps-input/);

    // Update values for each set
    const newSets = [
      { weight: "70", reps: "8" },
      { weight: "75", reps: "6" },
      { weight: "80", reps: "4" },
    ];

    // Simulate user input for each set
    newSets.forEach((set, index) => {
      fireEvent.changeText(weightInputs[index], set.weight);
      fireEvent.changeText(repInputs[index], set.reps);
    });

    // Complete the workout
    fireEvent.press(screen.getByText("Complete Workout"));

    // Verify the workout log was added with correct values
    const store = useWorkoutStore.getState();
    const lastLog = store.workoutLogs[store.workoutLogs.length - 1];

    expect(lastLog).toBeTruthy();
    expect(lastLog.templateId).toBe("template1");
    expect(lastLog.exercises[0].sets).toEqual([
      { weight: 70, reps: 8 },
      { weight: 75, reps: 6 },
      { weight: 80, reps: 4 },
    ]);

    // Start a new workout
    render(<WorkoutScreen />);

    // Verify the last workout's values are shown as placeholders
    const newWeightInputs = screen.getAllByTestId(/weight-input/);
    const newRepInputs = screen.getAllByTestId(/reps-input/);

    newSets.forEach((set, index) => {
      expect(newWeightInputs[index].props.placeholder).toBe(set.weight);
      expect(newRepInputs[index].props.placeholder).toBe(set.reps);
    });

    // Verify the input fields are empty
    newWeightInputs.forEach((input) => expect(input.props.value).toBe(""));
    newRepInputs.forEach((input) => expect(input.props.value).toBe(""));
  });

  it("should show last weights when starting the same workout from template multiple times", () => {
    // Render the workout screen for the first time
    const { unmount } = render(<WorkoutScreen />);

    // Get inputs and complete first workout
    const weightInputs = screen.getAllByTestId(/weight-input/);
    const repInputs = screen.getAllByTestId(/reps-input/);

    // Enter values for the first workout
    fireEvent.changeText(weightInputs[0], "60");
    fireEvent.changeText(repInputs[0], "10");
    fireEvent.changeText(weightInputs[1], "65");
    fireEvent.changeText(repInputs[1], "8");
    fireEvent.changeText(weightInputs[2], "70");
    fireEvent.changeText(repInputs[2], "6");

    // Complete the workout
    fireEvent.press(screen.getByText("Complete Workout"));

    // Verify the workout log was added with correct values
    const store = useWorkoutStore.getState();
    const firstLog = store.workoutLogs[0];
    expect(firstLog.templateId).toBe("template1");

    // Unmount and remount to simulate starting the same workout again
    unmount();
    render(<WorkoutScreen />);

    // Verify the placeholders show the last workout's values
    const newWeightInputs = screen.getAllByTestId(/weight-input/);
    const newRepInputs = screen.getAllByTestId(/reps-input/);

    // Check placeholders
    expect(newWeightInputs[0].props.placeholder).toBe("60");
    expect(newWeightInputs[1].props.placeholder).toBe("65");
    expect(newWeightInputs[2].props.placeholder).toBe("70");
    expect(newRepInputs[0].props.placeholder).toBe("10");
    expect(newRepInputs[1].props.placeholder).toBe("8");
    expect(newRepInputs[2].props.placeholder).toBe("6");

    // Enter new values
    fireEvent.changeText(newWeightInputs[0], "70");
    fireEvent.changeText(newRepInputs[0], "8");
    fireEvent.changeText(newWeightInputs[1], "75");
    fireEvent.changeText(newRepInputs[1], "6");
    fireEvent.changeText(newWeightInputs[2], "80");
    fireEvent.changeText(newRepInputs[2], "4");

    // Complete the second workout
    fireEvent.press(screen.getByText("Complete Workout"));

    // Verify the second workout log
    const secondLog = store.workoutLogs[1];
    expect(secondLog.templateId).toBe("template1");

    // Start the workout for the third time
    unmount();
    render(<WorkoutScreen />);

    // Get the inputs again
    const finalWeightInputs = screen.getAllByTestId(/weight-input/);
    const finalRepInputs = screen.getAllByTestId(/reps-input/);

    // Verify the placeholders now show the most recent workout's values
    expect(finalWeightInputs[0].props.placeholder).toBe("70");
    expect(finalWeightInputs[1].props.placeholder).toBe("75");
    expect(finalWeightInputs[2].props.placeholder).toBe("80");
    expect(finalRepInputs[0].props.placeholder).toBe("8");
    expect(finalRepInputs[1].props.placeholder).toBe("6");
    expect(finalRepInputs[2].props.placeholder).toBe("4");
  });
});
