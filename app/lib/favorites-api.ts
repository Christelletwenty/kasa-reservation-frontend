import { FavoritesResponse } from "../types/favorites";
import { Properties } from "../types/properties";
import { apiFetch } from "./api";

export function addPropertiesToFavorites(
  id: number,
): Promise<FavoritesResponse> {
  return apiFetch<FavoritesResponse>(`/api/properties/${id}/favorite`, {
    method: "POST",
    auth: true,
  });
}
export function deletePropertiesFromFavorites(
  id: number,
): Promise<FavoritesResponse> {
  return apiFetch<FavoritesResponse>(`/api/properties/${id}/favorite`, {
    method: "DELETE",
    auth: true,
  });
}

export function getFavoritesUsers(id: number): Promise<Properties[]> {
  return apiFetch<Properties[]>(`/api/users/${id}/favorites`, {
    method: "GET",
    auth: true,
  });
}
