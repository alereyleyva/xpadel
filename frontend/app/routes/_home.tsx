import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import icon from "~/images/xpadel.png";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import { UserSession } from "~/types/definition";

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
}

export default function Home() {
  const { email } = useLoaderData<UserSession>();
  const navigate = useNavigate();
  const submit = useSubmit();

  function handleLogout() {
    submit(null, { action: "/logout", method: "post" });
  }

  return (
    <div className="min-h-screen">
      <Navbar isBordered isBlurred maxWidth="lg">
        <NavbarBrand>
          <Link href="/">
            <img src={icon} alt="xpadel-icon" className="w-7" />
          </Link>
        </NavbarBrand>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                as="button"
                className="transition-transform"
                color="default"
                name={email}
                size="md"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-8" textValue="profile">
                <p className="font-semibold">{email}</p>
              </DropdownItem>
              <DropdownItem
                key="settings"
                textValue="settings"
                onClick={() => navigate("/profile")}
              >
                Mi perfil de jugador
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                textValue="logout"
                onClick={handleLogout}
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <Outlet />
    </div>
  );
}
