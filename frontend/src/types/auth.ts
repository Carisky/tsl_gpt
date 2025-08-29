export interface User {
  id: number;
  email: string;
  name?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MeResponse {
  user: User;
}

