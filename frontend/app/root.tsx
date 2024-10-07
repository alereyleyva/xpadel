import { NextUIProvider } from "@nextui-org/react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useHref,
  useNavigate,
} from "@remix-run/react";

import "react-toastify/dist/ReactToastify.css";
import "./tailwind.css";

export default function App() {
  const navigate = useNavigate();

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link id="favicon" rel="icon" href="/favicon-32x32.png" />
        <Meta />
        <Links />
      </head>
      <body className="bg-background text-foreground">
        <NextUIProvider navigate={navigate} useHref={useHref}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </NextUIProvider>
      </body>
    </html>
  );
}
