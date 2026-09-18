import Link from "next/link";
import Image from "next/image";
import { CartBadge } from "@/components/shop/CartBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-primary shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Globo Arg"
            width={36}
            height={36}
            className="rounded-full"
            priority
          />
          <span className="font-heading text-xl font-bold text-accent">
            Globo Arg
          </span>
        </Link>
        <CartBadge />
      </div>
    </header>
  );
}
