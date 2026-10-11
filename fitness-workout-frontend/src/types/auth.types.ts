export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    userId: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}