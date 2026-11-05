import Link from "next/link";

import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-[#f6f8f5] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-teal-400 text-slate-950"><Icon className="size-5" name="graduation-cap" /></span><span className="text-lg font-semibold">UCN Data Mahasiswa</span></div>
        <div className="max-w-lg"><p className="text-sm text-teal-300">Area administrasi</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">Kelola data mahasiswa dengan akses terproteksi.</h1><p className="mt-6 max-w-md text-lg leading-8 text-slate-300">Tambah, ubah, nonaktifkan, dan lihat data mahasiswa melalui satu area administrasi.</p></div>
        <p className="text-sm text-slate-400">Universitas Cakrawala Nusantara</p>
      </section>
      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700" href="/"><Icon className="size-4" name="chevron-left" /> Kembali ke dashboard</Link>
          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
            <p className="text-sm font-medium text-teal-700">Masuk admin</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Akses administrasi</h2>
            <p className="mt-3 leading-7 text-slate-600">Gunakan kredensial akun admin yang telah dikonfigurasi.</p>
            <form className="mt-8 space-y-5" noValidate>
              <label className="block text-sm font-medium text-slate-700">Email<input className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3 text-base outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100" placeholder="admin@ucn.test" type="email" /></label>
              <label className="block text-sm font-medium text-slate-700">Password<input className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3 text-base outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-100" placeholder="Masukkan password" type="password" /></label>
              <button className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800" type="submit">Masuk ke administrasi</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
