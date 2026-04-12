// Impport AuthGate qui vérifie si l'utilisateur est authentifié
import AuthGate from "./AuthGate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
