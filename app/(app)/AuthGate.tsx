"use client";

import type { ReactNode } from "react";
import { useAuthGuard } from "../hooks/useAuthGuard";

type AuthGateProps = {
  children: ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const { user, isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
        <h1>Chargement...</h1>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
