import { z } from "zod";

const userSignUpSchema = z
  .object({
    email: z.string().email("Formato del correo electrónico incorrecto"),
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
  });

export function processCredentialsSignUp(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const repeatedPassword = formData.get("repeatedPassword");

  const validationResult = userSignUpSchema.safeParse({
    email,
    password,
    repeatedPassword,
  });

  return {
    errors: validationResult.error?.formErrors,
  };
}
