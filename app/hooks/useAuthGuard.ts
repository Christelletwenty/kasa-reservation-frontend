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

// vérifie si l’utilisateur est connecté.
// Si ce n’est pas le cas, il le redirige vers /login.
export function useAuthGuard(): UseAuthGuardResult {
  const router = useRouter();

  // Stocke l’utilisateur connecté.
  // Au départ, on ne sait pas encore s’il est connecté, donc on met null.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      // Récupère le token JWT ou token d’authentification stocké côté client.
      const token = getToken();
      // Récupère l’id utilisateur éventuellement stocké en local.
      const storedUserId = getStoredUserId();
      // Récupère l’id utilisateur directement depuis le token si possible.
      const tokenUserId = getUserIdFromToken();
      // On privilégie l’id stocké localement.
      // S’il n’existe pas, on utilise celui trouvé dans le token.
      const userId = storedUserId ?? tokenUserId;

      // Si aucun token n’est présent, l’utilisateur n’est pas connecté.
      if (!token) {
        // On s’assure qu’aucun utilisateur n’est défini.
        setUser(null);
        setIsLoading(false);
        // On redirige l’utilisateur vers la page de connexion.
        router.replace("/login");
        return;
      }

      // Si on a un token mais aucun id utilisateur,
      // l’état d’authentification est incohérent.
      if (!userId) {
        // On supprime le token car il est inutilisable ou invalide.
        clearToken();
        setUser(null);
        setIsLoading(false);
        // On redirige vers la page de connexion.
        router.replace("/login");
        return;
      }

      try {
        // Si le token et l’id utilisateur existent,
        // on tente de récupérer les informations complètes de l’utilisateur.
        const currentUser = await getUserById(userId);
        // Si la requête réussit, on stocke l’utilisateur connecté.
        setUser(currentUser);
      } catch (error) {
        setUser(null);
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      setIsLoading(false);
    };

    // On lance la vérification d’authentification.
    // Le "void" indique explicitement qu’on ne veut pas attendre
    // la Promise directement dans useEffect.
    void checkAuth();
  }, [router]);

  // Le hook retourne l’utilisateur et l’état de chargement.
  // Le composant qui utilise ce hook peut alors afficher :
  // - un loader si isLoading vaut true
  // - la page protégée si user existe
  // - rien ou une redirection si user vaut null
  return { user, isLoading };
}
