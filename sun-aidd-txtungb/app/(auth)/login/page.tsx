import { createClient } from "@/lib/supabase/server";
import { LoginHero } from "@/components/features/login-hero";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/");

  return <LoginHero />;
}
