import type { User } from "../types/users";
import { getToken } from "./auth";
import { USER_STORAGE_KEY } from "./config";

/**
 * Représente la structure attendue du contenu d'un token JWT.
 *
 * Un JWT contient généralement plusieurs informations sur l'utilisateur,
 * comme son identifiant, son rôle, son email, etc.
 *
 * Les propriétés sont optionnelles car on ne peut pas garantir que le token
 * contiendra toujours toutes ces données.
 */

type JwtPayload = {
  id?: number | string;
  role?: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
};

/**
 * Récupère l'utilisateur stocké dans le sessionStorage.
 *
 * Le sessionStorage permet de stocker des données dans le navigateur
 * uniquement pendant la session actuelle.
 *
 * Contrairement au localStorage, les données du sessionStorage sont supprimées
 * lorsque l'onglet ou le navigateur est fermé.
 *
 * @returns L'utilisateur stocké si disponible et valide, sinon null.
 */
export function getStoredUser(): User | null {
  // On récupère la valeur associée à la clé USER_STORAGE_KEY.
  // Comme les données du storage sont toujours stockées sous forme de chaîne,
  // rawUser sera soit une string, soit null si aucune donnée n'existe.
  const rawUser = sessionStorage.getItem(USER_STORAGE_KEY);

  // Si aucun utilisateur n'est stocké, on retourne null.
  if (!rawUser) {
    return null;
  }

  try {
    // On convertit la chaîne JSON en objet JavaScript.
    // Le "as User" indique à TypeScript que l'objet obtenu respecte le type User.
    return JSON.parse(rawUser) as User;
  } catch {
    // Si le JSON est invalide, JSON.parse déclenche une erreur.
    // Dans ce cas, on évite de faire planter l'application et on retourne null.
    return null;
  }
}

/**
 * Récupère l'identifiant de l'utilisateur stocké dans le sessionStorage.
 *
 * Cette fonction s'appuie sur getStoredUser(), puis vérifie que l'utilisateur
 * possède bien un id exploitable.
 *
 * @returns L'id utilisateur sous forme de number, sinon null.
 */
export function getStoredUserId(): number | null {
  // On récupère d'abord l'utilisateur actuellement stocké.
  const user = getStoredUser();

  // Si aucun utilisateur n'existe, ou si son id est absent,
  // on ne peut pas récupérer d'identifiant fiable.
  if (!user || user.id === undefined || user.id === null) {
    return null;
  }

  const userId = Number(user.id);
  // On retourne donc null pour éviter de propager une valeur invalide.
  return Number.isNaN(userId) ? null : userId;
}

/**
 * Récupère l'identifiant de l'utilisateur directement depuis le token JWT.
 *
 * Un token JWT est généralement composé de 3 parties séparées par des points :
 *
 * header.payload.signature
 *
 * Ici, on récupère uniquement la partie "payload", qui contient les données
 * utiles comme l'id utilisateur.
 *
 * @returns L'id utilisateur sous forme de number, sinon null.
 */
export function getUserIdFromToken(): number | null {
  const token = getToken();

  // Si aucun token n'est disponible, l'utilisateur n'est probablement pas connecté.
  if (!token) {
    return null;
  }

  try {
    const payloadBase64 = token.split(".")[1];

    // Si le payload est absent, le token est mal formé.
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
    // Si une erreur survient à n'importe quelle étape :
    // - token mal formé
    // - payload invalide
    // - base64 non décodable
    // - JSON invalide
    //
    // On retourne null pour éviter de casser l'application.
    return null;
  }
}
