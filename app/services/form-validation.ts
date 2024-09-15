import { SafeParseReturnType } from "zod";
import { AuthorizationError } from "remix-auth";

export type FormValidationResult<Data> =
  | SucceededFormValidationResult<Data>
  | FailedFormValidationResult;

export interface SucceededFormValidationResult<Data> {
  data: Data;
}

export interface FailedFormValidationResult {
  errors: FormValidationErrors;
}

export interface FormValidationErrors {
  fieldErrors?: Record<string, string | string[]>;
  formErrors?: string[];
}

export function isFailedFormValidationResult<Data>(
  validationResult: FormValidationResult<Data>
): validationResult is FailedFormValidationResult {
  return "errors" in validationResult;
}

export function parseZodValidationResult<Input, Output>(
  validationResult: SafeParseReturnType<Input, Output>
): FormValidationResult<Output> {
  if (validationResult.success) return { data: validationResult.data };

  const errors = validationResult.error;
  const formErrors = errors.formErrors;

  return {
    errors: {
      formErrors: formErrors.formErrors,
      fieldErrors: formErrors.fieldErrors as Record<string, string[]>,
    },
  };
}

export function processAuthorizationFormValidationErrors(
  error: unknown
): FormValidationErrors | Response {
  if (error instanceof Response) return error;

  if (
    error instanceof AuthorizationError &&
    error.cause instanceof FormValidationError
  ) {
    return error.cause.errors;
  }

  return {
    formErrors: ["Error en el servidor, inténtelo de nuevo por favor"],
    fieldErrors: {},
  };
}

export class FormValidationError extends Error {
  errors: FormValidationErrors;

  constructor(errors: FormValidationErrors) {
    super();

    this.name = "FormValidationError";
    this.errors = errors;
  }
}
