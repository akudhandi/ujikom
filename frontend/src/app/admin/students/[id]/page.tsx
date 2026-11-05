import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Icon } from "@/components/ui/icon";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminPageShell action={<Link className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800" href={`/admin/students/${id}/edit`}><Icon className="size-4" name="edit" /> Edit mahasiswa</Link>} backHref="/admin/students" backLabel="Kembali ke data mahasiswa" description="Detail lengkap mahasiswa hanya dapat diakses oleh admin terautentikasi." title="Detail mahasiswa">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-6"><div><p className="text-sm font-medium text-teal-700">Detail mahasiswa</p><h2 className="mt-2 text-2xl font-semibold">Data belum tersedia</h2><p className="mt-2 text-slate-500">ID mahasiswa: {id}</p></div></div>
          <div className="mt-7 rounded-xl bg-slate-50 p-6"><p className="leading-7 text-slate-600">Detail mahasiswa akan tampil setelah endpoint Laravel untuk data mahasiswa terhubung.</p></div>
        </article>
        <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="text-sm font-medium text-amber-800">Status data</p><h2 className="mt-2 text-xl font-semibold text-slate-900">Nonaktifkan mahasiswa</h2><p className="mt-3 text-sm leading-6 text-slate-600">Aksi ini tidak menghapus data. Mahasiswa tidak lagi masuk ke statistik dashboard publik.</p><button className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-amber-300 bg-white px-4 text-sm font-semibold text-amber-900 transition hover:bg-amber-100" type="button">Nonaktifkan mahasiswa</button></aside>
      </section>
    </AdminPageShell>
  );
}

