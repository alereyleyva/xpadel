import {
  CameraIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Avatar, Button, Input, Tooltip } from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { authenticator } from "~/services/auth.server";
import {
  type FormValidationErrors,
  isFailedFormValidationResult,
  parseZodValidationResult,
} from "~/services/form-validation";
import { makeRequest } from "~/services/http-client";
import { getSessionUser } from "~/services/session.server";
import type { User } from "~/types/definition";
import { UserProfileSchema } from "~/types/schema";

export async function loader({ request }: LoaderFunctionArgs) {
  return getSessionUser(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const { accessToken } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  const userProfile = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phoneNumber: formData.get("phoneNumber"),
    instagramAccount: formData.get("instagramAccount"),
  };

  const zodValidationResult = UserProfileSchema.safeParse(userProfile);

  const validationResult = parseZodValidationResult(zodValidationResult);

  if (isFailedFormValidationResult(validationResult)) {
    return json(validationResult.errors);
  }

  try {
    return await makeRequest<User>("/me", {
      method: "POST",
      body: validationResult.data,
      accessToken: accessToken,
    });
  } catch (error) {
    return json({
      formErrors: ["Error en el servidor, por favor inténtelo de nuevo"],
    });
  }
}

export default function Profile() {
  const { userProfile } = useLoaderData<User>();
  const actionData = useActionData<User | FormValidationErrors>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const avatarSrc = userProfile.avatar ?? undefined;

  const action = "/user-profile";
  const isSubmitting = navigation.formAction === action;

  const failedForm =
    actionData && ("formErrors" in actionData || "fieldErrors" in actionData);

  const formErrors = failedForm ? (actionData.formErrors ?? []) : [];
  const fieldErrors = failedForm ? (actionData.fieldErrors ?? {}) : {};

  useEffect(() => {
    if (undefined !== actionData && !failedForm) {
      toast.success("Perfil actualizado correctamente");
    }
  }, [actionData, failedForm]);

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
        Perfil de Usuario
      </h1>

      <Form
        method="post"
        action={action}
        className="flex w-10/12 flex-col items-center space-y-5 sm:w-2/3 md:w-2/5"
      >
        <Avatar
          src={avatarSrc}
          fallback={
            <CameraIcon className="h-10 w-10 animate-pulse text-default-500" />
          }
          onClick={() => navigate("/user-profile/avatar")}
          className="h-32 w-32 cursor-pointer"
        />

        <Input
          type="text"
          name="firstName"
          label="Nombre"
          defaultValue={userProfile.firstName ?? undefined}
          startContent={<UserCircleIcon className="mr-1 w-5" />}
        />

        <Input
          type="text"
          name="lastName"
          label="Apellidos"
          defaultValue={userProfile.lastName ?? undefined}
          startContent={<UserCircleIcon className="mr-1 w-5" />}
        />

        <Input
          type="tel"
          name="phoneNumber"
          label="Número de teléfono"
          defaultValue={userProfile.phoneNumber ?? undefined}
          isInvalid={fieldErrors.phoneNumber !== undefined}
          errorMessage={fieldErrors.phoneNumber}
          startContent={<PhoneIcon className="mr-1 w-4" />}
        />

        <Input
          type="text"
          name="instagramAccount"
          label="Instagram"
          defaultValue={userProfile.instagramAccount ?? undefined}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small">@</span>
            </div>
          }
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
            Actualizar perfil
          </Button>
        </Tooltip>
      </Form>
      <ToastContainer />
      <Outlet />
    </div>
  );
}
