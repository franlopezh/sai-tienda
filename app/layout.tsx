import type { Metadata } from "next";
import { DM_Sans, Marcellus, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { LavaBackground } from "@/components/lava-background";

const sans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const logoFont = Marcellus({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Market SAI — Todo lo que necesitas, con crédito SAI",
  description:
    "Catálogo de motos, celulares y línea blanca con financiamiento SAI. Aprobación en 24 horas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      suppressHydrationWarning
      className={`${sans.variable} ${logoFont.variable} ${heading.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <LavaBackground />
          {children}
          <WhatsAppFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
