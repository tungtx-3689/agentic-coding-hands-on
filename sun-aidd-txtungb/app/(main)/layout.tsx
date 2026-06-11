import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
