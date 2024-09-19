import {
  FormValidationError,
  FormValidationResult,
  isFailedFormValidationResult,
  parseZodValidationResult,
} from "~/services/form-validation";
import { UserLoginSchema, UserRegistrationSchema } from "~/types/schema";
import { User, UserLogin, UserRegistration, UserSession } from "~/types/models";
import { createUser } from "~/services/user.server";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";

export const authenticator = new Authenticator<UserSession>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userRegistration = {
      email: form.get("email") as string,
      password: form.get("password") as string,
      repeatedPassword: form.get("repeatedPassword") as string,
    };

    const registrationResult = await processUserRegistration(userRegistration);

    if (isFailedFormValidationResult(registrationResult)) {
      throw new FormValidationError(registrationResult.errors);
    }

    const createdUser = registrationResult.data;

    return {
      id: createdUser.id,
      email: createdUser.email,
    };
  }),
  "user-registration"
);

export async function processUserRegistration(
  formData: UserRegistration
): Promise<FormValidationResult<User>> {
  const zodValidationResult =
    await UserRegistrationSchema.safeParseAsync(formData);

  const validationResult = parseZodValidationResult(zodValidationResult);

  if (isFailedFormValidationResult(validationResult)) return validationResult;

  const createdUser = await createUser(formData);

  return {
    data: createdUser,
  };
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userLogin = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    const loginResult = await processUserLogin(userLogin);

    if (isFailedFormValidationResult(loginResult)) {
      throw new FormValidationError(loginResult.errors);
    }

    const createdUser = loginResult.data;

    return {
      id: createdUser.id,
      email: createdUser.email,
    };
  }),
  "user-login"
);

export async function processUserLogin(
  formData: UserLogin
): Promise<FormValidationResult<User>> {
  const zodValidationResult = await UserLoginSchema.safeParseAsync(formData);

  const validationResult = parseZodValidationResult(zodValidationResult);

  if (isFailedFormValidationResult(validationResult)) return validationResult;

  return {
    data: validationResult.data,
  };
}