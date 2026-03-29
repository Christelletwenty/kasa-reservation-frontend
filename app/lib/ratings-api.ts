import { AddRatingPropertyResponse, RatingResponse } from "../types/ratings";
import { apiFetch } from "./api";

export function getRatingsByProperty(id: number): Promise<RatingResponse> {
  return apiFetch<RatingResponse>(`/api/properties/${id}/ratings`, {
    method: "GET",
    auth: true,
  });
}

export function addRatingToProperty(
  id: number,
  score: number,
  comment: string,
): Promise<AddRatingPropertyResponse> {
  return apiFetch<AddRatingPropertyResponse>(`/api/properties/${id}/ratings`, {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      score,
      comment,
    }),
  });
}
