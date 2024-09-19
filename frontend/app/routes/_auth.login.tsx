import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { action as authAction } from "~/routes/_auth";
import { FormValidationErrors } from "~/services/form-validation";

export const meta: MetaFunction = () => {
  return [
    { title: "Iniciar sesión | XPadel" },
    { name: "description", content: "Iniciar sesión en XPadel" },
  ];
};

export async function action(args: ActionFunctionArgs) {
  return await authAction("user-login", args);
}

export default function LoginPage() {
  const actionData = useActionData<FormValidationErrors>();
  const navigation = useNavigation();

  const formErrors = actionData?.formErrors ?? [];
  const fieldErrors = actionData?.fieldErrors ?? {};

  const isSubmitting = navigation.formAction === "/login?index";

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

      <Tooltip
        content={formErrors[0]}
        placement="bottom"
        isOpen={Object.keys(fieldErrors).length === 0 && formErrors.length > 0}
        color="danger"
      >
        <Button color="primary" type="submit" isLoading={isSubmitting}>
          Iniciar sesión
        </Button>
      </Tooltip>
    </>
  );
}
