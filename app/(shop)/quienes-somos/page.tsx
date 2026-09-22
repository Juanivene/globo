import type { Metadata } from "next";
import Image from "next/image";
import { AboutSection } from "@/components/shop/AboutSection";
import { PageTransition } from "@/components/shop/PageTransition";
import { WhatsAppBand } from "@/components/shop/WhatsAppBand";
import { about } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Quiénes somos | Globo Arg",
  description: "Globo Arg trae productos importados de Estados Unidos a todo el país, por encargo.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="space-y-12 sm:space-y-16">
        <AboutSection />

        {/* Banner ancho con la foto de tecnología. El degradado oscuro a la
            izquierda es lo que garantiza el contraste del texto. */}
        <section className="reveal relative isolate overflow-hidden rounded-3xl shadow-(--shadow-panel)">
          <Image
            src="/images/tecnologia-usa.jpg"
            alt={about.banner.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="-z-10 object-cover object-[50%_45%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-r from-bg via-bg/80 to-bg/10"
          />
          <div className="max-w-md px-6 py-16 sm:px-12 sm:py-24">
            <h2 className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
              {about.banner.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/80">
              {about.banner.body}
            </p>
          </div>
        </section>

        <WhatsAppBand />
      </div>
    </PageTransition>
  );
}
