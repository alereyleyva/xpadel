import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { authenticator } from "~/services/auth.server";
import { processAuthorizationFormValidationErrors } from "~/services/form-validation";

export const meta: MetaFunction = () => {
  return [
    { title: "XPadel" },
    { name: "description", content: "Bienvenido a XPadel!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("user-registration", request, {
      successRedirect: "/profile",
      throwOnError: true,
    });
  } catch (error) {
    const processedErrors = processAuthorizationFormValidationErrors(error);

    if (processedErrors instanceof Response) return processedErrors;
    else return json(processedErrors);
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/profile",
  });
}

export default function Index() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const formErrors = actionData?.formErrors ?? [];
  const fieldErrors = actionData?.fieldErrors ?? {};

  const isSubmitting = navigation.formAction === "/?index";

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <h1 className="text-2xl sm:text-4xl">Bienvenido/a a XPadel 🎾</h1>
      <Form
        action="/?index"
        method="post"
        className="flex w-10/12 flex-col items-center space-y-5 sm:w-2/3 md:w-2/5"
      >
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

        <Tooltip
          content={formErrors[0]}
          placement="bottom"
          isOpen={
            Object.keys(fieldErrors).length === 0 && formErrors.length > 0
          }
          color="danger"
        >
          <Button color="primary" type="submit" isLoading={isSubmitting}>
            Unirse a la comunidad
          </Button>
        </Tooltip>
      </Form>
    </div>
  );
}
