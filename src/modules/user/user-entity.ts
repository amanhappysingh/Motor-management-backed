import { BaseEntity } from "../../core/base-entity";
import { Roles } from "../../core/types";

export interface User extends BaseEntity {
  email: string;
  phone: string;
  password: string;
}

export interface UserRole extends BaseEntity {
  role_id: Roles;
  user_id: string;
  user_profile_id: string;
}

export interface UserProfile extends BaseEntity {
  display_name: string;
}

// workshop_eng - feed motor data, track, edit only motor data
// technician - manage maintanance, cant feed
// admin - do everything - user add assign role
