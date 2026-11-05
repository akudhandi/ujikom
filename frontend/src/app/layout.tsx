import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Mahasiswa | Universitas Cakrawala Nusantara",
  description:
    "Sistem manajemen data mahasiswa Universitas Cakrawala Nusantara: statistik publik dan area administrasi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-radius="soft" lang="id">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400..700&family=Hanken+Grotesk:wght@400..600&family=JetBrains+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
