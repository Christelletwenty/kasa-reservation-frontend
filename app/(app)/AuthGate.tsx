"use client";

import type { ReactNode } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";

// On définit le type des props attendues par le composant AuthGate.
type AuthGateProps = {
  children: ReactNode;
};

// AuthGate est un composant React qui protège une partie de l'application.
// Son rôle est d'afficher ses enfants uniquement si l'utilisateur est connecté.
export default function AuthGate({ children }: AuthGateProps) {
  // On appelle le hook useAuthGuard pour récupérer l'état d'authentification.
  const { user, isLoading } = useAuthGuard();

  // Tant que la vérification de l'authentification est en cours,
  // on affiche un écran de chargement.
  if (isLoading) {
    return (
      <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
        <h1>Chargement...</h1>
      </main>
    );
  }

  // Si le chargement est terminé mais qu'aucun utilisateur n'est connecté,
  // on n'affiche rien.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
