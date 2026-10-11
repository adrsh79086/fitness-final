import api from './api';
import type { Exercise } from '../types/exercise.types';

export interface ExerciseInput {
  name: string;
  muscleGroup: string;
  equipment: string;
}

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await api.get<Exercise[]>('/exercises');
  return response.data;
};

export const createExercise = async (data: ExerciseInput) => {
  const response = await api.post('/exercises', data);
  return response.data;
};

export const updateExercise = async (
  exerciseId: string,
  data: ExerciseInput
) => {
  const url = '/exercises/' + exerciseId;
  const response = await api.patch(url, data);
  return response.data;
};

export const deleteExercise = async (exerciseId: string) => {
  const url = '/exercises/' + exerciseId;
  const response = await api.delete(url);
  return response.data;
};
