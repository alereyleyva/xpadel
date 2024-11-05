import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import {
  FormValidationError,
  isFailedFormValidationResult,
  parseZodValidationResult,
} from "~/services/form-validation";
import { makeRequest } from "~/services/http-client";
import { sessionStorage } from "~/services/session.server";
import {
  type AuthenticationResponse,
  type UserSession,
  isFailedAuthentication,
} from "~/types/definition";
import { UserLoginSchema, UserRegistrationSchema } from "~/types/schema";

export const authenticator = new Authenticator<UserSession>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userRegistration = {
      email: form.get("email") as string,
      password: form.get("password") as string,
      repeatedPassword: form.get("repeatedPassword") as string,
    };

    const zodValidationResult =
      UserRegistrationSchema.safeParse(userRegistration);

    const registrationResult = parseZodValidationResult(zodValidationResult);

    if (isFailedFormValidationResult(registrationResult)) {
      throw new FormValidationError(registrationResult.errors);
    }

    const response = await makeRequest("/register", {
      body: userRegistration,
      method: "POST",
    });

    const responseData: AuthenticationResponse = await response.json();

    if (isFailedAuthentication(responseData)) {
      const { error } = responseData;

      throw new FormValidationError({
        formErrors: [error],
      });
    }

    const { accessToken } = responseData;

    return {
      email: userRegistration.email,
      accessToken: accessToken,
    };
  }),
  "user-registration",
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const userLogin = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    const zodValidationResult = UserLoginSchema.safeParse(userLogin);

    const loginResult = parseZodValidationResult(zodValidationResult);

    if (isFailedFormValidationResult(loginResult)) {
      throw new FormValidationError(loginResult.errors);
    }

    const response = await makeRequest("/login", {
      body: userLogin,
      method: "POST",
    });

    const responseData: AuthenticationResponse = await response.json();

    if (isFailedAuthentication(responseData)) {
      const { error } = responseData;

      throw new FormValidationError({
        formErrors: [error],
      });
    }

    const { accessToken } = responseData;

    return {
      email: userLogin.email,
      accessToken,
    };
  }),
  "user-login",
);
