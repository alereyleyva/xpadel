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
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { type ChangeEventHandler, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { authenticator } from "~/services/auth.server";
import {
  isFailedFormValidationResult,
  parseZodValidationResult,
} from "~/services/form-validation";
import { makeRequest } from "~/services/http-client";
import type { User, UserProfile } from "~/types/definition";
import { UserProfileSchema } from "~/types/schema";

export async function loader({ request }: LoaderFunctionArgs) {
  const { accessToken } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  try {
    const user = await makeRequest<User>("/me", {
      method: "GET",
      accessToken: accessToken,
    });

    return user.profile;
  } catch (error) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }
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
      method: "PATCH",
      body: validationResult.data,
      accessToken: accessToken,
    });
  } catch (error) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }
}

export default function Profile() {
  const userProfile = useLoaderData<UserProfile>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  const handleAvatarClick = () => avatarRef.current?.click();

  const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) return;

    const avatarFile = event.target.files[0];

    if (avatarFile) {
      const avatarSrc = URL.createObjectURL(avatarFile);
      setAvatarSrc(avatarSrc);
    }
  };

  const isSubmitting = navigation.formAction === "/user-profile";

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
        action="/user-profile"
        encType="multipart/form-data"
        className="flex w-10/12 flex-col items-center space-y-5 sm:w-2/3 md:w-2/5"
      >
        <Avatar
          src={avatarSrc}
          fallback={
            <CameraIcon className="h-10 w-10 animate-pulse text-default-500" />
          }
          className="h-32 w-32 cursor-pointer"
          onClick={handleAvatarClick}
        />

        <Input
          type="file"
          name="avatar"
          className="hidden"
          accept="image/*"
          ref={avatarRef}
          onChange={handleAvatarChange}
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
    </div>
  );
}
