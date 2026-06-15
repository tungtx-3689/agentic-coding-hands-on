import { auth } from "@/auth";
import { LoginHero } from "@/components/features/login-hero";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");
  return <LoginHero />;
}
