import { CameraIcon } from "@heroicons/react/24/solid";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import axios, { HttpStatusCode } from "axios";
import { type ChangeEventHandler, useRef, useState } from "react";
import { authenticator } from "~/services/auth.server";
import { httpClient } from "~/services/http-client";
import { getSessionUser } from "~/services/session.server";
import type { User } from "~/types/definition";

export async function loader({ request }: LoaderFunctionArgs) {
  return getSessionUser(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const { accessToken } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();

  try {
    const response = await httpClient.post("/me/avatar", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === HttpStatusCode.Ok) {
      return redirect("/user-profile");
    }
  } catch (error) {
    return json({
      formErrors: ["Error en el servidor, por favor inténtelo de nuevo"],
    });
  }
}

export default function ProfileAvatar() {
  const user = useLoaderData<User>();
  const userProfile = user.profile;
  const navigate = useNavigate();
  const navigation = useNavigation();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(
    userProfile.avatar ?? undefined,
  );

  const handleAvatarClick = () => avatarRef.current?.click();

  const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files) return;

    const avatarFile = event.target.files[0];

    if (avatarFile) {
      const avatarSrc = URL.createObjectURL(avatarFile);
      setAvatarSrc(avatarSrc);
    }
  };

  const action = "/user-profile/avatar";
  const isSubmitting = navigation.formAction === action;

  return (
    <Modal isOpen={true} hideCloseButton>
      <ModalContent>
        {() => (
          <Form
            method="post"
            action={action}
            encType="multipart/form-data"
            className="flex flex-col items-center space-y-5"
          >
            <ModalHeader className="flex flex-col gap-1">
              Editar foto de perfil
            </ModalHeader>
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

            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => navigate("/user-profile")}
              >
                Cancelar
              </Button>
              <Button color="primary" isLoading={isSubmitting} type="submit">
                Actualizar foto
              </Button>
            </ModalFooter>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
