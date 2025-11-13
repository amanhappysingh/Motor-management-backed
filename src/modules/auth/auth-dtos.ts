import { Roles } from "../../core/types";

export type LoginRequestDTO = {
  email: string;
  password: string;
};

export type LoginResponseDTO = {
  user: {
    email: string;
    phone: string;
    display_name: string;
    role: Roles
  };
  auth_token: string;
  rf_token: string;
};

export type UserWithRoleDTO = {
  password: string;
  role: Roles;
  display_name: string;
  email: string;
  phone: string;
  id: string;
}