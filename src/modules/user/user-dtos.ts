import { Roles } from "../../core/types";
import { User, UserProfile, UserRole } from "./user-entity";

export type CreateUserDTO = Pick<User & UserProfile & UserRole, "email" | "phone" | "role_id" | "password" | "display_name">

export type GetUserDTO = Pick<User & UserProfile & { role : Roles }, "email" | "phone" | "role" | "display_name">

export type GetRolesDTO = {
  id: string;
  role: Roles;
  description: string;
};
