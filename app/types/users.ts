export type Role = "owner" | "client" | "admin";

//List users
export interface User {
  id: number;
  name: string;
  picture: string;
  role: Role;
}
