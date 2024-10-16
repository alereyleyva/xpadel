import { createCookieSessionStorage } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { makeRequest } from "~/services/http-client";
import type { User } from "~/types/definition";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "xpadel_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.AUTH_SECRET as string], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export const getSessionUser = async (request: Request) => {
  const { accessToken } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  try {
    return await makeRequest<User>("/me", {
      method: "GET",
      accessToken: accessToken,
    });
  } catch (error) {
    return await authenticator.logout(request, { redirectTo: "/login" });
  }
};
