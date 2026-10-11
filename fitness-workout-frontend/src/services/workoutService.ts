import api from './api';
import type { Workout, CreateWorkoutInput } from '../types/workout.types';

export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await api.get<Workout[]>('/workouts');
  return response.data;
};

export const createWorkout = async (
  data: CreateWorkoutInput
): Promise<Workout> => {
  const response = await api.post<Workout>('/workouts', data);
  return response.data;
};