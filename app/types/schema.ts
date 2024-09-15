import { z } from "zod";
import { userExistsByEmail } from "~/services/user.server";

export const UserSchema = z.object({
  id: z.string().uuid("UUID inválido"),
  email: z.string().email("Correo electrónico inválido"),
  password: z
    .string()
    .trim()
    .min(10, "La contraseña debe tener más de 10 caracteres")
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserSignUpSchema = UserSchema.extend({
  repeatedPassword: z
    .string()
    .trim()
    .min(10, "La contraseña debe tener más de 10 caracteres"),
})
  .omit({ id: true, createdAt: true, updatedAt: true })
  .required({ password: true })
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
