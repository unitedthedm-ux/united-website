import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/context/LocaleContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "UNITED Real Estate — Premium Properties in Egypt",
  description:
    "Discover premium new developments and exclusive resale units across Egypt's finest locations. New Capital, New Cairo, North Coast and more.",
  keywords:
    "real estate egypt, new capital, new cairo, luxury apartments, villas, resale, united real estate",
  openGraph: {
    title: "UNITED Real Estate",
    description: "Premium Real Estate in Egypt",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <LocaleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
