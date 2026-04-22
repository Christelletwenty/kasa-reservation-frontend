import type { User } from "../types/users";
import { getToken } from "./auth";
import { USER_STORAGE_KEY } from "./config";

type JwtPayload = {
  id?: number | string;
  role?: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export function getStoredUser(): User | null {
  const rawUser = sessionStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function getStoredUserId(): number | null {
  const user = getStoredUser();

  if (!user || user.id === undefined || user.id === null) {
    return null;
  }

  const userId = Number(user.id);
  return Number.isNaN(userId) ? null : userId;
}

export function getUserIdFromToken(): number | null {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const payloadBase64 = token.split(".")[1];

    if (!payloadBase64) {
      return null;
    }

    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(normalized);
    const payload = JSON.parse(payloadJson) as JwtPayload;

    if (payload.id === undefined || payload.id === null) {
      return null;
    }

    const userId = Number(payload.id);

    return Number.isNaN(userId) ? null : userId;
  } catch {
    return null;
  }
}
