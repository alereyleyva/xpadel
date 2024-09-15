import { z } from "zod";
import { userExistsByEmail } from "~/services/user.server";

export const UserLoginSchema = z.object({
  email: z.string().trim().email("Correo electrónico inválido"),
  password: z.string().trim(),
});

export const UserSchema = UserLoginSchema.extend({
  id: z.string().uuid("UUID inválido"),
  password: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
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
})
  .refine((data) => data.password === data.repeatedPassword, {
    message: "Las contraseñas introducidas no coinciden",
  })
  .refine(
    async (data) => {
      const userExists = await userExistsByEmail(data.email);

      return !userExists;
    },
    { message: "Ya existe un usuario con el correo electrónico proporcionado" }
  );
