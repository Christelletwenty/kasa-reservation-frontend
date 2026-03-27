import { ApiError } from "next/dist/server/api-utils";

//Register a new user (password auth)
export type Role = "owner" | "client";

export interface AuthRegister {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthRegisterResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    picture: string;
    role: Role;
  };
}

export interface AuthRegisterError extends ApiError {}

//Login with email and password
export interface AuthLogin {
  email: string;
  password: string;
}

export interface AuthLoginErro extends ApiError {}

//Request a password reset
export interface RequestResetPassword {
  email: string;
}

export interface RequestResetPasswordResponse {
  ok: true;
  message: string;
  token: string;
}

//Reset password using token
export interface ResetPassword {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  ok: true;
}

export interface ResetPasswordError extends ApiError {}
