import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Icon } from "@/components/ui/icon";

export default function StudentsPage() {
  return (
    <AdminPageShell
      action={<Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800" href="/admin/students/create"><Icon className="size-4" name="plus" /> Tambah mahasiswa</Link>}
      description="Cari, filter, dan kelola data mahasiswa. Data nonaktif tetap disimpan untuk menjaga riwayat."
      title="Data mahasiswa"
    >
      <section className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block lg:w-96"><span className="sr-only">Cari mahasiswa</span><Icon className="pointer-events-none absolute left-3 top-3.5 size-5 text-slate-400" name="search" /><input className="min-h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-base outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100" placeholder="Cari nama atau NPM" type="search" /></label>
          <div className="flex gap-3"><select aria-label="Filter status mahasiswa" className="min-h-12 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-teal-700"><option>Mahasiswa aktif</option><option>Mahasiswa nonaktif</option><option>Semua status</option></select></div>
        </div>
        <div className="grid min-h-90 place-items-center px-6 py-12 text-center">
          <div className="max-w-sm">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-teal-50 text-teal-700"><Icon className="size-6" name="users" /></span>
            <h2 className="mt-5 text-xl font-semibold">Belum ada mahasiswa</h2>
            <p className="mt-3 leading-7 text-slate-500">Tambahkan data mahasiswa pertama setelah API CRUD Laravel tersedia.</p>
            <Link className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800" href="/admin/students/create"><Icon className="size-4" name="plus" /> Tambah mahasiswa</Link>
          </div>
        </div>
      </section>
    </AdminPageShell>
  );
}
