
import api from './api';

import type {
  Workout,
  CreateWorkoutInput,
} from '../types/workout.types';

import type { WorkoutExercise } from '../types/workoutExercise.types';

// Get all workouts
export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await api.get<Workout[]>('/workouts');
  return response.data;
};

// Get one workout by ID
export const getWorkout = async (
  workoutId: string,
): Promise<Workout> => {
  const response = await api.get<Workout>(
    `/workouts/${workoutId}`,
  );

  return response.data;
};

// Create workout
export const createWorkout = async (
  data: CreateWorkoutInput,
): Promise<Workout> => {
  const response = await api.post<Workout>('/workouts', data);
  return response.data;
};

// Update workout status
export const updateWorkoutStatus = async (
  workoutId: string,
  status: 'planned' | 'in-progress' | 'completed',
): Promise<Workout> => {
  const response = await api.patch<Workout>(
    `/workouts/${workoutId}`,
    { status },
  );

  return response.data;
};

// Get exercises added to a workout
export const getWorkoutExercises = async (
  workoutId: string,
): Promise<WorkoutExercise[]> => {
  const response = await api.get<WorkoutExercise[]>(
    `/workouts/${workoutId}/exercises`,
  );

  return response.data;
};

// Add exercise to workout
export const addExerciseToWorkout = async (
  workoutId: string,
  exerciseId: string,
): Promise<WorkoutExercise> => {
  const response = await api.post<WorkoutExercise>(
    `/workouts/${workoutId}/exercises`,
    { exerciseId },
  );

  return response.data;
};

// Remove exercise from workout
export const removeExerciseFromWorkout = async (
  workoutId: string,
  exerciseId: string,
) => {
  const response = await api.delete(
    `/workouts/${workoutId}/exercises/${exerciseId}`,
  );

  return response.data;
};

// Delete workout
export const deleteWorkout = async (
  workoutId: string,
) => {
  const response = await api.delete(
    `/workouts/${workoutId}`,
  );

  return response.data;
};
