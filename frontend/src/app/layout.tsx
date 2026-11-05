import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Data Mahasiswa | UCN",
  description: "Sistem Manajemen Data Mahasiswa Universitas Cakrawala Nusantara.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
