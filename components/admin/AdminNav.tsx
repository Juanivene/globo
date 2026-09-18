"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ClipboardList,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/admin/SignOutButton";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/secciones", label: "Secciones", icon: Tags },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/envios", label: "Envíos", icon: Truck },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="mb-8 flex items-center gap-2 px-2 pt-2">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <span className="text-xl font-bold text-accent">Globo Arg</span>
            <p className="text-xs text-white/50">Panel de administración</p>
          </div>
        </div>
        <ul className="space-y-1">
          {LINKS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent text-primary font-semibold"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <SignOutButton />
    </nav>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-1 overflow-x-auto px-2 py-2">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-accent text-primary"
                  : "bg-black/5 text-text/70"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
