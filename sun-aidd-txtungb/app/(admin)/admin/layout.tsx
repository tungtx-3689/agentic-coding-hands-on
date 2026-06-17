import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { getSessionUser } from "@/lib/auth/get-session-user";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#999999]">
      <AdminHeader user={user} />
      <main className="flex-1 pt-16 p-6">{children}</main>
      <AdminFooter />
    </div>
  );
}
