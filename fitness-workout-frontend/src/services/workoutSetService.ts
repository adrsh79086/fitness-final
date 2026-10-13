import api from './api';

export interface WorkoutSetInput {
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutSet extends WorkoutSetInput {
  workoutSetId: string;
}

// Save a new set
export const saveWorkoutSet = async (
  data: WorkoutSetInput,
): Promise<WorkoutSet> => {
  const response = await api.post<WorkoutSet>(
    '/workout-sets',
    data,
  );

  return response.data;
};

// Get saved sets for a workout
export const getWorkoutSets = async (
  workoutId: string,
): Promise<WorkoutSet[]> => {
  const response = await api.get<WorkoutSet[]>(
    `/workout-sets/${workoutId}`,
  );

  return response.data;
};

// Update an existing set
export const updateWorkoutSet = async (
  workoutSetId: string,
  data: Partial<WorkoutSetInput>,
): Promise<WorkoutSet> => {
  const response = await api.patch<WorkoutSet>(
    `/workout-sets/${workoutSetId}`,
    data,
  );

  return response.data;
};

// Delete a set
export const deleteWorkoutSet = async (
  workoutSetId: string,
) => {
  const response = await api.delete(
    `/workout-sets/${workoutSetId}`,
  );

  return response.data;
};



