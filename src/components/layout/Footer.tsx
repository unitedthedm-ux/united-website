"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40 mt-24">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/brand/logo-horizontal.svg"
              alt="UNITED Real Estate"
              width={150}
              height={38}
              className="h-9 w-auto"
            />
            <p className="text-sm text-muted-foreground max-w-xs">
              {t.tagline}
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {t.nav.home}
            </p>
            {[
              { href: "/properties", label: t.nav.properties },
              { href: "/resale", label: t.nav.resale },
              { href: "/media", label: t.nav.media },
              { href: "/about", label: t.nav.about },
              { href: "/contact", label: t.nav.contact },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {t.nav.contact}
            </p>
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#a4c8e0] transition-colors"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/unitedrealestate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#a4c8e0] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com/unitedrealestate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-[#a4c8e0] transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {year} UNITED Real Estate. {t.footer.rights}</p>
          <p>
            {t.footer.madeBy}{" "}
            <a
              href="https://wemake.deals"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#a4c8e0] transition-colors"
            >
              The Deal Maker
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
