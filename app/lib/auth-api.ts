import {
  AuthLogin,
  AuthLoginResponse,
  AuthRegister,
  AuthRegisterResponse,
  RequestResetPassword,
  RequestResetPasswordResponse,
  ResetPassword,
  ResetPasswordResponse,
} from "../types/auth";
import { apiFetch } from "./api";

export function register(
  registerPayload: AuthRegister,
): Promise<AuthRegisterResponse> {
  return apiFetch<AuthRegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(registerPayload),
  });
}

export function login(loginPayload: AuthLogin): Promise<AuthLoginResponse> {
  return apiFetch<AuthLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginPayload),
  });
}

export function resetPasswordRequest(
  resetRequestPayload: RequestResetPassword,
): Promise<RequestResetPasswordResponse> {
  return apiFetch<RequestResetPasswordResponse>("/aut/request-reset", {
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
