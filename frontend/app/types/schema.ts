import { RefinementCtx, z } from "zod";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

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

const emptyStringToNullTransformation = (value: string) =>
  value === "" ? null : value;

export const UserProfileSchema = z.object({
  firstName: z.string().trim().transform(emptyStringToNullTransformation),
  lastName: z.string().trim().transform(emptyStringToNullTransformation),
  phoneNumber: z
    .string()
    .trim()
    .transform(emptyStringToNullTransformation)
    .pipe(
      z
        .string()
        .transform((value: string, ctx: RefinementCtx) => {
          const isValid = isValidPhoneNumber(value, { defaultCountry: "ES" });

          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Formato incorrecto",
            });

            return z.NEVER;
          }

          const phoneNumber = parsePhoneNumber(value, { defaultCountry: "ES" });

          return phoneNumber.formatInternational();
        })
        .nullish()
    ),
  instagramAccount: z
    .string()
    .trim()
    .transform(emptyStringToNullTransformation),
});
