import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Adopt a Pony — Invest in soft mobility",
  description: "Finance Pony's fleet and earn up to 9.5% annual returns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ paddingTop: '64px', backgroundColor: '#13102B' }}>
        <Header />
        {children}
      </body>
    </html>
  );
}