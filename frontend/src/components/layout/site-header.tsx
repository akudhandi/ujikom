import Link from "next/link";

import { Icon } from "@/components/ui/icon";

type SiteHeaderProps = {
  admin?: boolean;
};

export function SiteHeader({ admin = false }: SiteHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-[#fbfcfa]">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <Link className="flex items-center gap-3 text-slate-950" href="/">
          <span className="grid size-10 place-items-center rounded-xl bg-teal-700 text-white">
            <Icon className="size-5" name="graduation-cap" />
          </span>
          <span>
            <span className="block text-base font-semibold tracking-tight">UCN Data Mahasiswa</span>
            <span className="block text-xs text-slate-500">Universitas Cakrawala Nusantara</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-6 md:flex">
          <Link className="text-sm font-medium text-slate-600 transition hover:text-teal-700" href="/">
            Dashboard
          </Link>
          {admin ? (
            <Link className="text-sm font-medium text-slate-600 transition hover:text-teal-700" href="/admin/students">
              Data mahasiswa
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {admin ? (
            <Link className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex" href="/">
              Lihat publik
            </Link>
          ) : (
            <Link className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex" href="/admin/login">
              Masuk admin
            </Link>
          )}
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700" href={admin ? "/admin/students/create" : "/admin/login"}>
            {admin ? <><Icon className="size-4" name="plus" /> Tambah mahasiswa</> : "Masuk admin"}
          </Link>
        </div>
      </div>
    </header>
  );
}
