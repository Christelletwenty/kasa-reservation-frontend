import { Role } from "./auth";
import { ApiError } from "./errors";

//List users
export interface Users {
  id: number;
  name: string;
  picture: string;
  role: Role;
}

export interface ListUsersResponse {
  id: number;
  name: string;
  picture: string;
  role: Role;
}

export interface ListUserError extends ApiError {}

//Admin: create user without auth creds
export interface AdminCreateUser {
  name: string;
  picture: string;
  role: Role;
}

//Update user
export interface UpdateUser {
  name: string;
  picture: string;
  role: Role;
}

//Update user
export interface UpdateUserResponse {
  id: number;
  name: string;
  picture: string;
  role: Role;
}
