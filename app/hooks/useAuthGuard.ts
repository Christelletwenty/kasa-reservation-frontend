"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearToken,
  getStoredUserId,
  getToken,
  getUserIdFromToken,
} from "../lib/auth-guard";
import { getUserById } from "../lib/users-api";
import type { User } from "../types/users";

type UseAuthGuardResult = {
  user: User | null;
  isLoading: boolean;
};

export function useAuthGuard(): UseAuthGuardResult {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const token = getToken();

      if (!token) {
        setUser(null);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      const userId = getStoredUserId() ?? getUserIdFromToken();

      if (!userId) {
        clearToken();
        setUser(null);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const currentUser = await getUserById(userId);
        setUser(currentUser);
      } catch {
        clearToken();
        setUser(null);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, [router]);

  return { user, isLoading };
}
