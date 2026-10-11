import axios from 'axios';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/login`,
    data
  );

  return response.data;
};

export const signupUser = async (
  data: SignupRequest
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/register`,
    data
  );

  return response.data;
};