import { z } from "zod";
import {
  UserSchema,
  UserRegistrationSchema,
  BaseUserSchema,
} from "~/types/schema";

export type User = z.infer<typeof UserSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof BaseUserSchema>;

export interface UserSession {
  id: string;
  email: string;
}
