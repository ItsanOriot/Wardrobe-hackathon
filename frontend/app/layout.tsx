import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Stylist",
  description: "Your personal AI wardrobe stylist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
