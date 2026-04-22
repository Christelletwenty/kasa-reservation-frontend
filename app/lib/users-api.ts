import { User } from "../types/users";
import { apiFetch } from "./api";

export function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/api/users", {
    method: "GET",
    auth: true,
  });
}

export function adminCreateUser(
  adminCreateUserPayload: Omit<User, "id">,
): Promise<User> {
  return apiFetch("/api/users", {
    method: "POST",
    auth: true,
    body: JSON.stringify(adminCreateUserPayload),
  });
}

export function getUserById(id: number): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function updateUserById(id: number, user: Partial<User>): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(user),
  });
}
