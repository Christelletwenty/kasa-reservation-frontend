import { AddRatingPropertyResponse, Rating } from "../types/ratings";
import { apiFetch } from "./api";

export function getRatingsByProperty(id: number): Promise<Rating> {
  return apiFetch<Rating>(`/api/properties/${id}/ratings`, {
    method: "GET",
    auth: true,
  });
}

export function addRatingToProperty(
  propertyId: number,
  userId: number,
  score: number,
  comment: string,
): Promise<AddRatingPropertyResponse> {
  return apiFetch<AddRatingPropertyResponse>(
    `/api/properties/${propertyId}/ratings`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        user_id: userId,
        score,
        comment,
      }),
    },
  );
}
