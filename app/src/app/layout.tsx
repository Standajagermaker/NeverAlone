import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeverAlone — Never travel alone.",
  description: "Find nearby travelers, locals, and safe plans when you do not want to be alone."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
