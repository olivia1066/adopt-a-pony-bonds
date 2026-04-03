import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  weight: ['400', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Adopt a Pony — Investissez dans la mobilité douce",
  description: "Sponsorisez la flotte Pony et touchez des intérêts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={barlow.variable}>
      <body style={{fontFamily: 'var(--font-barlow), sans-serif', letterSpacing: '-0.01em'}}>{children}</body>
    </html>
  );
}