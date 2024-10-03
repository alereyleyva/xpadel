import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { useLoaderData } from "@remix-run/react";
import { UserSession } from "~/types/definitions";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
}

export default function Profile() {
  const user = useLoaderData<UserSession>();

  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      <h1 className="text-3xl">Profile Page</h1>
      <p>Bienvenido/a {user.email}</p>
    </div>
  );
}
