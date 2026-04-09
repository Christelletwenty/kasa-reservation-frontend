export type Role = "owner" | "client" | "admin";

//List users
export interface User {
  id: number;
  name: string;
  email: string;
  picture: string | null;
  role: Role;
}
