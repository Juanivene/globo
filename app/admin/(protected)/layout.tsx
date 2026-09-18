import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav, AdminMobileNav } from "@/components/admin/AdminNav";
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login");

  return (
    <ConfirmProvider>
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 bg-primary md:block">
          <AdminNav />
        </aside>
        {/*
          `min-w-0` overrides the flex item's default `min-width: auto`. Without
          it, this column refuses to shrink below the intrinsic width of its
          widest descendant (the data tables), which stretches the whole layout
          past the viewport and shows up as a few pixels of horizontal scroll on
          mobile. Each table below is responsible for its own overflow via
          `overflow-x-auto` — this just lets the column itself get out of the way.
        */}
        <div className="min-w-0 flex-1">
          <header className="border-b border-border bg-white md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-lg font-bold text-primary">Globo Arg</span>
            </div>
            <AdminMobileNav />
          </header>
          <main className="min-w-0 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
