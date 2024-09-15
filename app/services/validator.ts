import { SafeParseReturnType } from "zod";

export type FormValidationResult<Data> =
  | FormValidationSuccessResult<Data>
  | FormValidationFailedResult;

export interface FormValidationSuccessResult<Data> {
  data: Data;
}

export interface FormValidationFailedResult {
  errors: FormValidationErrorsResult;
}

interface FormValidationErrorsResult {
  fieldErrors?: Record<string, string | string[]>;
  formErrors?: string[];
}

export function parseValidationResult<Input, Output>(
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
