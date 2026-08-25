import type { Metadata } from "next";
import { Archivo, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";

import { routes } from "@/routes";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "A server-rendered Pokédex built on the PokéAPI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link
              href={routes.home()}
              className="tap-target focus-ring font-display text-lg font-black uppercase tracking-label"
            >
              Pokédex
            </Link>
            <Link
              href={routes.pokemon.list()}
              className="tap-target label focus-ring transition hover:text-ink"
            >
              Browse
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
