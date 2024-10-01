import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Outlet, useLocation } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { processAuthorizationFormValidationErrors } from "~/services/form-validation";
import { Link } from "@nextui-org/link";
import icon from "~/images/xpadel.png";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/profile",
  });
}

export async function action(
  strategy: string,
  { request }: ActionFunctionArgs
) {
  try {
    return await authenticator.authenticate(strategy, request, {
      successRedirect: "/profile",
      throwOnError: true,
    });
  } catch (error) {
    const processedErrors = processAuthorizationFormValidationErrors(error);

    if (processedErrors instanceof Response) return processedErrors;
    else return json(processedErrors);
  }
}

export default function AuthPage() {
  const { pathname } = useLocation();

  const action = `${pathname}?index`;

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <img src={icon} alt="xpadel-icon" className="w-24" />
      {pathname.startsWith("/login") ? (
        <p>
          ¿No tienes una cuenta? <Link href="/register">Registrate</Link>
        </p>
      ) : (
        <p>
          ¿Tienes una cuenta? <Link href="/login">Inicia sesión</Link>
        </p>
      )}
      <Form
        action={action}
        method="post"
        className="flex w-10/12 flex-col items-center space-y-5 sm:w-2/3 md:w-2/5"
      >
        <Outlet />
      </Form>
    </div>
  );
}
