import { Role, User } from "./users";

export interface AuthRegister {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User & { email: string };
  error?: string;
}

//Login with email and password
export interface AuthLogin {
  email: string;
  password: string;
}

//Request a password reset
export interface RequestResetPassword {
  email: string;
}

export interface RequestResetPasswordResponse {
  ok: boolean;
  message: string;
  token: string;
}

//Reset password using token
export interface ResetPassword {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  ok: boolean;
  error?: string;
}
