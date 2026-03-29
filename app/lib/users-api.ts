import {
  AdminCreateUser,
  ListUsersResponse,
  UpdateUserResponse,
  Users,
} from "../types/users";
import { apiFetch } from "./api";

export function getUsers(): Promise<Users> {
  return apiFetch<ListUsersResponse>("/api/users", {
    method: "GET",
    auth: true,
  });
}

export function adminCreateUser(
  adminCreateUserPayload: AdminCreateUser,
): Promise<Users> {
  return apiFetch("/api/users", {
    method: "POST",
    auth: true,
    body: JSON.stringify(adminCreateUserPayload),
  });
}

export function getUserById(id: number): Promise<Users> {
  return apiFetch<ListUsersResponse>(`/api/users/${id}`, {
    method: "GET",
    auth: true,
  });
}

export function updateUserById(id: number): Promise<UpdateUserResponse> {
  return apiFetch<UpdateUserResponse>(`/api/users/${id}`, {
    method: "PATCH",
    auth: true,
  });
}
