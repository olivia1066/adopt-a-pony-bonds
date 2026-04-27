import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}