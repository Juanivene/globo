import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="shell flex-1 py-6 sm:py-10">{children}</main>
      <Footer />
    </div>
  );
}
