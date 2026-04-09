import type { User } from "../types/users";

const TOKEN_KEY = "token";
const USER_KEY = "user";

type LoginResponse = {
  token: string;
  user: User;
};

type JwtPayload = {
  id?: number | string;
  role?: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export function saveAuth(data: LoginResponse): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY);

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

  if (!user) {
    return null;
  }

  return typeof user.id === "number" ? user.id : null;
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

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
