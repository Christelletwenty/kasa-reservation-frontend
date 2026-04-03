import {
  AuthLogin,
  AuthRegister,
  AuthResponse,
  RequestResetPassword,
  RequestResetPasswordResponse,
  ResetPassword,
  ResetPasswordResponse,
} from "../types/auth";
import { apiFetch } from "./api";

export function register(registerPayload: AuthRegister): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(registerPayload),
  });
}

export function login(loginPayload: AuthLogin): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginPayload),
  });
}

export function resetPasswordRequest(
  resetRequestPayload: RequestResetPassword,
): Promise<RequestResetPasswordResponse> {
  return apiFetch<RequestResetPasswordResponse>("/auth/request-reset", {
    method: "POST",
    body: JSON.stringify(resetRequestPayload),
  });
}

export function resetPassword(
  resetPayload: ResetPassword,
): Promise<ResetPasswordResponse> {
  return apiFetch<ResetPasswordResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(resetPayload),
  });
}
