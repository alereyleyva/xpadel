import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Button, Checkbox, Input, Tooltip } from "@nextui-org/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { action as authAction } from "~/routes/_auth";
import { FormValidationErrors } from "~/services/form-validation";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Registro | XPadel" },
    { name: "description", content: "Registrarse en XPadel" },
  ];
};

export async function action(args: ActionFunctionArgs) {
  return await authAction("user-registration", args);
}

export default function RegisterPage() {
  const [termsAndConditions, setTermsAndConditions] = useState<boolean>(false);
  const actionData = useActionData<FormValidationErrors>();
  const navigation = useNavigation();

  const formErrors = actionData?.formErrors ?? [];
  const fieldErrors = actionData?.fieldErrors ?? {};

  const isSubmitting = navigation.formAction === "/register?index";

  return (
    <>
      <Input
        type="email"
        name="email"
        label="Correo electrónico"
        isInvalid={fieldErrors.email !== undefined}
        errorMessage={fieldErrors.email}
      />

      <Input
        type="password"
        name="password"
        label="Contraseña"
        isInvalid={fieldErrors.password !== undefined}
        errorMessage={fieldErrors.password}
      />

      <Input
        type="password"
        name="repeatedPassword"
        label="Repita la contraseña"
        isInvalid={fieldErrors.repeatedPassword !== undefined}
        errorMessage={fieldErrors.repeatedPassword}
      />

      <Checkbox
        checked={termsAndConditions}
        onChange={(event) => setTermsAndConditions(event.target.checked)}
      >
        He leído y acepto los términos y condiciones de uso
      </Checkbox>

      <Tooltip
        content={formErrors[0]}
        placement="bottom"
        isOpen={Object.keys(fieldErrors).length === 0 && formErrors.length > 0}
        color="danger"
      >
        <Button
          color="primary"
          type="submit"
          isLoading={isSubmitting}
          isDisabled={!termsAndConditions}
        >
          Iniciar sesión
        </Button>
      </Tooltip>
    </>
  );
}
