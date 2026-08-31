"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  const expectedPassword = process.env.SHARED_DASHBOARD_PASSWORD;

  if (!password) {
    return { error: "Password is required" };
  }

  if (password !== expectedPassword) {
    return { error: "Incorrect password" };
  }

  // Password matches, set cookie
  const cookieStore = await cookies();
  cookieStore.set("site_access_token", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/");
}
