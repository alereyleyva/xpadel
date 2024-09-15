import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { Form, useLoaderData } from "@remix-run/react";
import { UserSession } from "~/types/models";
import { Button } from "@nextui-org/react";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
}

export default function Profile() {
  const user = useLoaderData<UserSession>();

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <h1 className="text-3xl">Profile Page</h1>
      <p>Bienvenido/a {user.email}</p>
      <Form method="post" action="/logout">
        <Button type="submit">Cerrar sesión</Button>
      </Form>
    </div>
  );
}
