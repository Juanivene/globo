import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-light">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
