"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUserId, getUserIdFromToken } from "../lib/auth-guard";
import { getUserById } from "../lib/users-api";
import type { User } from "../types/users";
import { clearToken, getToken } from "../lib/auth";

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
      const storedUserId = getStoredUserId();
      const tokenUserId = getUserIdFromToken();
      const userId = storedUserId ?? tokenUserId;

      console.log("token:", token);
      console.log("storedUserId:", storedUserId);
      console.log("tokenUserId:", tokenUserId);
      console.log("final userId:", userId);

      if (!token) {
        console.log("Pas de token");
        setUser(null);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      if (!userId) {
        console.log("Pas de userId");
        clearToken();
        setUser(null);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        console.log("Appel getUserById avec:", userId);
        const currentUser = await getUserById(userId);
        console.log("currentUser:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error("Erreur getUserById:", error);
        setUser(null);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    };

    void checkAuth();
  }, [router]);

  return { user, isLoading };
}
