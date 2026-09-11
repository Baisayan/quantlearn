import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuantLearn",
  description:
    "Learn quantum computing through guided lessons, interactive circuits and AI explanations.",
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
