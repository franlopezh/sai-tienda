import type { Metadata } from "next";
import { DM_Sans, Marcellus, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/scroll-to-top";

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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAI Shop — Llévate hoy lo que necesitas, paga en semanas",
  description:
    "Catálogo de motos, celulares y línea blanca con financiamiento SAI. Sin checador, aprobación en 24 horas.",
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
      className={`${sans.variable} ${logoFont.variable} ${geistMono.variable} h-full antialiased`}
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
          {children}
          <WhatsAppFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
