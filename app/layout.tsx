import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Globo Arg",
  description: "Productos importados de USA, a tu puerta.",
  openGraph: {
    title: "Globo Arg",
    description: "Productos importados de USA, a tu puerta.",
    type: "website",
  },
};

/**
 * El navy de la marca también pinta la barra del navegador en el celular, así
 * el header deja de cortarse contra una franja blanca del sistema y la pantalla
 * se lee como una sola pieza.
 */
export const viewport: Viewport = {
  themeColor: "#0f1e47",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            className: "font-sans",
            style: { borderRadius: "0.875rem" },
          }}
        />
      </body>
    </html>
  );
}
