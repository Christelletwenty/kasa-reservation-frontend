import { User } from "./users";

//List rating for a property success
export interface Rating {
  id: number;
  score: number;
  comment: string;
  created_at: Date;
  user: User;
}

export interface AddRatingPropertyResponse {
  rating_avg: 0;
  ratings_count: 0;
  ratings: Rating[];
}
