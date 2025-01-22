import { Template } from "../store/workoutStore";

// Set a fixed timestamp for example templates
const EXAMPLE_TIMESTAMP = Date.now();

export const exampleTemplates: Template[] = [
  {
    id: "ppl",
    name: "Push Pull Legs",
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
    workouts: [
      {
        id: "push",
        name: "Push Day",
        exercises: [
          {
            id: "barbell-bench-press",
            name: "Barbell Bench Press",
            sets: 4,
            reps: 8,
            bodyPart: "Chest"
          },
          {
            id: "barbell-overhead-press",
            name: "Barbell Overhead Press",
            sets: 4,
            reps: 8,
            bodyPart: "Shoulders"
          },
          {
            id: "dumbbell-incline-bench-press",
            name: "Dumbbell Incline Bench Press",
            sets: 3,
            reps: 10,
            bodyPart: "Chest"
          },
          {
            id: "dumbbell-lateral-raise",
            name: "Dumbbell Lateral Raise",
            sets: 3,
            reps: 12,
            bodyPart: "Shoulders"
          },
          {
            id: "tricep-pushdown",
            name: "Tricep Pushdown",
            sets: 3,
            reps: 12,
            bodyPart: "Arms"
          }
        ]
      },
      {
        id: "pull",
        name: "Pull Day",
        exercises: [
          {
            id: "barbell-row",
            name: "Barbell Row",
            sets: 4,
            reps: 8,
            bodyPart: "Back"
          },
          {
            id: "pull-ups",
            name: "Pull-ups",
            sets: 4,
            reps: 8,
            bodyPart: "Back"
          },
          {
            id: "face-pull",
            name: "Face Pull",
            sets: 3,
            reps: 12,
            bodyPart: "Back"
          },
          {
            id: "barbell-curl",
            name: "Barbell Curl",
            sets: 3,
            reps: 12,
            bodyPart: "Arms"
          },
          {
            id: "hammer-curl",
            name: "Hammer Curl",
            sets: 3,
            reps: 12,
            bodyPart: "Arms"
          }
        ]
      },
      {
        id: "legs",
        name: "Leg Day",
        exercises: [
          {
            id: "barbell-squat",
            name: "Barbell Squat",
            sets: 4,
            reps: 8,
            bodyPart: "Legs"
          },
          {
            id: "barbell-romanian-deadlift",
            name: "Barbell Romanian Deadlift",
            sets: 4,
            reps: 8,
            bodyPart: "Legs"
          },
          {
            id: "leg-press",
            name: "Leg Press",
            sets: 3,
            reps: 10,
            bodyPart: "Legs"
          },
          {
            id: "standing-calf-raises",
            name: "Standing Calf Raises",
            sets: 4,
            reps: 15,
            bodyPart: "Legs"
          },
          {
            id: "leg-extension",
            name: "Leg Extension",
            sets: 3,
            reps: 12,
            bodyPart: "Legs"
          }
        ]
      }
    ]
  },
  {
    id: "bro-split",
    name: "Bro Split",
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
    workouts: [
      {
        id: "chest",
        name: "Chest Day",
        exercises: [
          {
            id: "barbell-bench-press",
            name: "Barbell Bench Press",
            sets: 4,
            reps: 8,
            bodyPart: "Chest"
          },
          {
            id: "barbell-incline-bench-press",
            name: "Barbell Incline Bench Press",
            sets: 4,
            reps: 8,
            bodyPart: "Chest"
          },
          {
            id: "dumbbell-flyes",
            name: "Dumbbell Flyes",
            sets: 3,
            reps: 12,
            bodyPart: "Chest"
          },
          {
            id: "push-ups",
            name: "Push-ups",
            sets: 3,
            reps: 15,
            bodyPart: "Chest"
          }
        ]
      },
      {
        id: "back",
        name: "Back Day",
        exercises: [
          {
            id: "barbell-deadlift",
            name: "Barbell Deadlift",
            sets: 4,
            reps: 6,
            bodyPart: "Back"
          },
          {
            id: "pull-ups",
            name: "Pull-ups",
            sets: 4,
            reps: 8,
            bodyPart: "Back"
          },
          {
            id: "barbell-row",
            name: "Barbell Row",
            sets: 3,
            reps: 10,
            bodyPart: "Back"
          },
          {
            id: "lat-pulldown",
            name: "Lat Pulldown",
            sets: 3,
            reps: 12,
            bodyPart: "Back"
          }
        ]
      },
      {
        id: "shoulders",
        name: "Shoulder Day",
        exercises: [
          {
            id: "barbell-overhead-press",
            name: "Barbell Overhead Press",
            sets: 4,
            reps: 8,
            bodyPart: "Shoulders"
          },
          {
            id: "dumbbell-lateral-raise",
            name: "Dumbbell Lateral Raise",
            sets: 4,
            reps: 12,
            bodyPart: "Shoulders"
          },
          {
            id: "face-pull",
            name: "Face Pull",
            sets: 3,
            reps: 15,
            bodyPart: "Back"
          },
          {
            id: "dumbbell-front-raise",
            name: "Dumbbell Front Raise",
            sets: 3,
            reps: 12,
            bodyPart: "Shoulders"
          }
        ]
      },
      {
        id: "arms",
        name: "Arms Day",
        exercises: [
          {
            id: "barbell-curl",
            name: "Barbell Curl",
            sets: 4,
            reps: 10,
            bodyPart: "Arms"
          },
          {
            id: "tricep-pushdown",
            name: "Tricep Pushdown",
            sets: 4,
            reps: 10,
            bodyPart: "Arms"
          },
          {
            id: "hammer-curl",
            name: "Hammer Curl",
            sets: 3,
            reps: 12,
            bodyPart: "Arms"
          },
          {
            id: "skull-crushers",
            name: "Skull Crushers",
            sets: 3,
            reps: 12,
            bodyPart: "Arms"
          }
        ]
      },
      {
        id: "legs",
        name: "Leg Day",
        exercises: [
          {
            id: "barbell-squat",
            name: "Barbell Squat",
            sets: 4,
            reps: 8,
            bodyPart: "Legs"
          },
          {
            id: "leg-press",
            name: "Leg Press",
            sets: 4,
            reps: 10,
            bodyPart: "Legs"
          },
          {
            id: "barbell-lunges",
            name: "Barbell Lunges",
            sets: 3,
            reps: 12,
            bodyPart: "Legs"
          },
          {
            id: "standing-calf-raises",
            name: "Standing Calf Raises",
            sets: 4,
            reps: 15,
            bodyPart: "Legs"
          }
        ]
      }
    ]
  },
  {
    id: "full-body",
    name: "Full Body",
    createdAt: EXAMPLE_TIMESTAMP,
    updatedAt: EXAMPLE_TIMESTAMP,
    workouts: [
      {
        id: "workout-a",
        name: "Workout A",
        exercises: [
          {
            id: "barbell-squat",
            name: "Barbell Squat",
            sets: 3,
            reps: 8,
            bodyPart: "Legs"
          },
          {
            id: "barbell-bench-press",
            name: "Barbell Bench Press",
            sets: 3,
            reps: 8,
            bodyPart: "Chest"
          },
          {
            id: "barbell-row",
            name: "Barbell Row",
            sets: 3,
            reps: 8,
            bodyPart: "Back"
          },
          {
            id: "barbell-overhead-press",
            name: "Barbell Overhead Press",
            sets: 3,
            reps: 8,
            bodyPart: "Shoulders"
          },
          {
            id: "barbell-curl",
            name: "Barbell Curl",
            sets: 2,
            reps: 12,
            bodyPart: "Arms"
          }
        ]
      },
      {
        id: "workout-b",
        name: "Workout B",
        exercises: [
          {
            id: "barbell-deadlift",
            name: "Barbell Deadlift",
            sets: 3,
            reps: 6,
            bodyPart: "Back"
          },
          {
            id: "barbell-incline-bench-press",
            name: "Barbell Incline Bench Press",
            sets: 3,
            reps: 8,
            bodyPart: "Chest"
          },
          {
            id: "pull-ups",
            name: "Pull-ups",
            sets: 3,
            reps: 8,
            bodyPart: "Back"
          },
          {
            id: "dumbbell-lateral-raise",
            name: "Dumbbell Lateral Raise",
            sets: 3,
            reps: 12,
            bodyPart: "Shoulders"
          },
          {
            id: "tricep-pushdown",
            name: "Tricep Pushdown",
            sets: 2,
            reps: 12,
            bodyPart: "Arms"
          }
        ]
      }
    ]
  }
]; 