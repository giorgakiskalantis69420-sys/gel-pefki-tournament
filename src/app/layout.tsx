import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SportProvider } from "@/context/SportContext";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Τουρνουά | 1ο ΓΕΛ Πεύκης",
  description:
    "Σχολικό τουρνουά 3v3 Μπάσκετ και 4v4 Πετοσφαίρισης — 1ο ΓΕΛ Πεύκης",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2744",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <SportProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
          <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
            1ο Γενικό Λύκειο Πεύκης · Σχολικό Τουρνουά {new Date().getFullYear()}
          </footer>
        </SportProvider>
      </body>
    </html>
  );
}
