"use server";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/auth";

export async function signInAsDemo() {
  await nextAuthSignIn("credentials", { redirectTo: "/" });
}

export async function signOut() {
  await nextAuthSignOut({ redirectTo: "/login" });
}
