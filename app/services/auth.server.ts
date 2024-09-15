import {
  FormValidationResult,
  parseValidationResult,
} from "~/services/validator";
import { UserSignUpSchema } from "~/types/schema";
import { User, UserSignUp } from "~/types/models";
import { createUser } from "~/services/user.server";

export async function processCredentialsSignUp(
  formData: UserSignUp
): Promise<FormValidationResult<User>> {
  const validationResult = await UserSignUpSchema.safeParseAsync(formData);

  const processedValidationResult = parseValidationResult(validationResult);

  if ("errors" in processedValidationResult)
    return { errors: processedValidationResult.errors };

  const createdUser = await createUser(formData);

  return {
    data: createdUser,
  };
}
