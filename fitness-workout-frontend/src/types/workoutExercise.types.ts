export interface WorkoutExercise {
  workoutExerciseId: string;
  workoutId: string;
  exerciseId: string;
  order: number;
  exercise: {
    exerciseId: string;
    name: string;
    muscleGroup: string;
    equipment: string;
    isActive: boolean;
  } | null;
}