import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav, AdminMobileNav } from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 bg-primary md:block">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <header className="border-b border-border bg-white md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-lg font-bold text-primary">Globo Arg</span>
          </div>
          <AdminMobileNav />
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
