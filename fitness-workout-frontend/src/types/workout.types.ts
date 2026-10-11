export interface Workout {
  workoutId: string;
  userId: string;
  date: string;
  notes: string;
  status: 'planned' | 'in-progress' | 'completed';
}

export interface CreateWorkoutInput {
  date: string;
  notes: string;
}