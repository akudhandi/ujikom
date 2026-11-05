import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-loaded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-text-loaded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UCN Hub | Sistem Manajemen Data Mahasiswa",
  description:
    "Sistem Manajemen Data Mahasiswa Universitas Cakrawala Nusantara — Dashboard Statistik & Administrasi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      data-radius="soft"
      lang="id"
    >
      <body>{children}</body>
    </html>
  );
}
