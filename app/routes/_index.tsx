import {
  ActionFunctionArgs,
  json,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Button, Input, Tooltip } from "@nextui-org/react";
import { processCredentialsSignUp } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "XPadel" },
    { name: "description", content: "Bienvenido a XPadel!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const result = processCredentialsSignUp(formData);

  const { errors } = result;

  if (!errors) redirect("/");

  return json({ errors });
}

export default function Index() {
  const actionData = useActionData<typeof action>();

  const formErrors = actionData?.errors?.formErrors ?? [];
  const fieldErrors = actionData?.errors?.fieldErrors ?? {};

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <h1 className="text-2xl sm:text-4xl">Bienvenido/a a XPadel 🎾</h1>
      <Form
        method="POST"
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
          content={formErrors}
          placement="bottom"
          isOpen={
            Object.keys(fieldErrors).length === 0 && formErrors.length > 0
          }
          color="danger"
        >
          <Button color="primary" type="submit">
            Unirse a la comunidad
          </Button>
        </Tooltip>
      </Form>
    </div>
  );
}
