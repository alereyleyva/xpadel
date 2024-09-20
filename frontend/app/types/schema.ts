import { z } from "zod";

export const UserLoginSchema = z.object({
  email: z.string().trim().email("Correo electrónico inválido"),
  password: z.string().trim(),
});

export const UserRegistrationSchema = UserLoginSchema.extend({
  password: z
    .string()
    .trim()
    .min(10, "La contraseña debe tener más de 10 caracteres"),
  repeatedPassword: z
    .string()
    .trim()
    .min(10, "La contraseña debe tener más de 10 caracteres"),
}).refine((data) => data.password === data.repeatedPassword, {
  message: "Las contraseñas introducidas no coinciden",
});
