import { z } from "zod";
import {
  getUserByEmail,
  userExistsByEmail,
  verifyPassword,
} from "~/services/user.server";

export const BaseUserSchema = z.object({
  email: z.string().trim().email("Correo electrónico inválido"),
  password: z.string().trim(),
});

export const UserLoginSchema = BaseUserSchema.extend({}).transform(
  async (data, ctx) => {
    const user = await getUserByEmail(data.email);

    if (!user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "No existe un usuario asociado al correo electrónico proporcionado",
      });

      return z.NEVER;
    }

    if (
      !user.password ||
      !(await verifyPassword(data.password, user.password))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Correo electrónico o contraseña incorrectos",
      });

      return z.NEVER;
    }

    return user;
  }
);

export const UserSchema = BaseUserSchema.extend({
  id: z.string().uuid("UUID inválido"),
  password: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserRegistrationSchema = BaseUserSchema.extend({
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
