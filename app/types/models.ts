import { z } from "zod";
import { UserSchema, UserSignUpSchema } from "~/types/schema";

export type User = z.infer<typeof UserSchema>;
export type UserSignUp = z.infer<typeof UserSignUpSchema>;
