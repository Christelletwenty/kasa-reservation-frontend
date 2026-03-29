import { Role } from "./auth";
import { ApiError } from "./errors";

//List rating for a property success
export interface RatingResponse {
  id: number;
  score: number;
  comment: string;
  created_at: Date;
  user: {
    id: number;
    name: string;
    picture: string;
    role: Role;
  };
}

export interface RatingError extends ApiError {}

//Add rating to a property
export interface AddRatingProperty {
  user_id: number;
  score: number;
  comment: string;
}

export interface AddRatingPropertyResponse {
  rating_avg: 0;
  ratings_count: 0;
  ratings: [
    {
      id: number;
      score: number;
      comment: string;
      created_at: Date;
      user: {
        id: number;
        name: string;
        picture: string;
        role: Role;
      };
    },
  ];
}

export interface AddRatingPropertyError extends ApiError {}
