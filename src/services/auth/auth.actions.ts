"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth.config";

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/students",
    },
  });

  return result;
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
};
