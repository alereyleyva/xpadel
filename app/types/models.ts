import { z } from "zod";
import { UserSchema, UserRegistrationSchema } from "~/types/schema";

export type User = z.infer<typeof UserSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

export interface UserSession {
  id: string;
  email: string;
}
