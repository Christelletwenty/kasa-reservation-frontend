// On importe une constante contenant la clé utilisée dans le sessionStorage.
// Cela évite de répéter une string partout dans le code et centralise la configuration.
import { AuthResponse } from "../types/auth";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./config";

/**
 * Sauvegarde les informations d'authentification dans le sessionStorage.
 *
 * Cette fonction est généralement appelée juste après un login réussi.
 * Elle stocke :
 * - le token d'authentification
 * - les informations de l'utilisateur connecté
 */
export function saveAuth(data: AuthResponse): void {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
  sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
}

// Cette fonction sauvegarde le token d'authentification dans le sessionStorage.
// Le token est généralement reçu après un login réussi.
export function setToken(token: string): void {
  // sessionStorage permet de stocker des données dans le navigateur
  // uniquement pendant la session de navigation (jusqu'à fermeture du navigateur).
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// Cette fonction récupère le token stocké dans le sessionStorage.
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  // Si aucun token n'existe, la fonction retourne null.
}

// Cette fonction supprime le token du sessionStorage.
// Elle est typiquement utilisée lors du logout.
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
}

// Cette fonction vérifie si l'utilisateur est authentifié.
export function isAuthenticated(): boolean {
  // Si un token existe -> true
  // Si aucun token -> false
  return Boolean(getToken());
}
