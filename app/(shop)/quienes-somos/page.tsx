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
      <div className="space-y-10 sm:space-y-12">
        <AboutSection />

        {/* Banner ancho con la foto de tecnología. El degradado oscuro a la
            izquierda es lo que garantiza el contraste del texto. */}
        <section className="relative isolate overflow-hidden rounded-2xl">
          <Image
            src="/images/tecnologia-usa.jpg"
            alt={about.banner.imageAlt}
            fill
            loading="lazy"
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="-z-10 object-cover object-[50%_45%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-r from-bg via-bg/80 to-bg/10"
          />
          <div className="max-w-md px-6 py-14 sm:px-10 sm:py-20">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {about.banner.title}
            </h2>
            <p className="mt-2 text-base text-white/80">{about.banner.body}</p>
          </div>
        </section>

        <WhatsAppBand />
      </div>
    </PageTransition>
  );
}
