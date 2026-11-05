import Link from "next/link";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { Icon } from "@/components/ui/icon";

type DashboardShellProps = {
  apiReady: boolean;
};

export function DashboardShell({ apiReady }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8f5] text-slate-950">
      <SiteHeader />
      <main>
        <section className="border-b border-slate-200 bg-[#fbfcfa] px-5 py-14 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
            <div>
              <p className="text-sm font-medium text-teal-700">Dashboard publik</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Statistik mahasiswa aktif UCN
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Ringkasan komposisi mahasiswa aktif berdasarkan gender, asal daerah, fakultas dan usia.
              </p>
            </div>
            <aside className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className={`grid size-10 place-items-center rounded-full ${apiReady ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  <Icon className="size-5" name={apiReady ? "check-circle" : "bar-chart"} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Status data</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{apiReady ? "API Laravel terhubung." : "Menunggu API Laravel."}</p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section aria-labelledby="ringkasan-title" className="px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-teal-700">Data aktif</p>
                <h2 id="ringkasan-title" className="mt-1 text-2xl font-semibold tracking-tight">Ringkasan mahasiswa</h2>
              </div>
              <p className="text-sm text-slate-500">Pembaruan setelah data dimuat ulang</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard icon="users" label="Total mahasiswa aktif" value="0" note="Data belum diinput" />
              <SummaryCard icon="graduation-cap" label="Mahasiswa laki-laki" value="0" note="0% dari total aktif" />
              <SummaryCard icon="book-open" label="Mahasiswa perempuan" value="0" note="0% dari total aktif" />
            </div>
          </div>
        </section>

        <section aria-labelledby="grafik-title" className="border-y border-slate-200 bg-white px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-medium text-teal-700">Analitik publik</p>
              <h2 id="grafik-title" className="mt-1 text-2xl font-semibold tracking-tight">Distribusi mahasiswa</h2>
              <p className="mt-3 leading-7 text-slate-600">Grafik akan memakai agregat dari Laravel. Data individu tidak dikirim ke halaman publik.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <ChartCard title="Jenis kelamin" description="Perbandingan mahasiswa aktif menurut gender.">
                <div className="flex min-h-62 items-center justify-center gap-8">
                  <Donut />
                  <div className="space-y-4 text-sm">
                    <Legend color="bg-teal-700" label="Laki-laki" value="0" />
                    <Legend color="bg-amber-400" label="Perempuan" value="0" />
                    <p className="max-w-35 text-xs leading-5 text-slate-500">Belum ada data gender untuk ditampilkan.</p>
                  </div>
                </div>
              </ChartCard>
              <ChartCard title="Distribusi usia" description="Kelompok usia dihitung dari tanggal lahir.">
                <EmptyChart label="Belum ada data usia untuk ditampilkan." />
              </ChartCard>
              <ChartCard title="Asal daerah" description="Daerah asal mahasiswa aktif.">
                <EmptyChart label="Belum ada data asal daerah untuk ditampilkan." />
              </ChartCard>
              <ChartCard title="Fakultas dan program studi" description="Program studi dengan jumlah mahasiswa aktif.">
                <EmptyChart label="Belum ada data program studi untuk ditampilkan." />
              </ChartCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-2xl bg-slate-900 px-7 py-8 text-white md:flex-row md:items-center md:px-10">
            <div>
              <p className="text-sm text-slate-300">Area administrasi</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Kelola data mahasiswa dengan akses admin.</h2>
            </div>
            <Link className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg bg-teal-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href="/admin/login">
              Masuk admin <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-[#fbfcfa] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:justify-between">
          <p>Universitas Cakrawala Nusantara · Sistem Manajemen Data Mahasiswa</p>
          <p>Dashboard hanya menampilkan statistik agregat.</p>
        </div>
      </footer>
    </div>
  );
}

function SummaryCard({ icon, label, value, note }: { icon: "users" | "graduation-cap" | "book-open"; label: string; value: string; note: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon className="size-5" name={icon} /></span>
      </div>
      <p className="mt-7 text-4xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-3 text-sm text-slate-500">{note}</p>
    </article>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      {children}
    </article>
  );
}

function Donut() {
  return <div aria-label="Grafik gender belum memiliki data" className="grid size-36 place-items-center rounded-full border-18 border-slate-200"><span className="text-xl font-semibold text-slate-500">0</span></div>;
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return <div className="flex items-center gap-3"><span className={`size-3 rounded-full ${color}`} /><span className="text-slate-600">{label}</span><span className="ml-auto font-semibold text-slate-900">{value}</span></div>;
}

function EmptyChart({ label }: { label: string }) {
  return <div className="mt-8 grid min-h-62 place-items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm leading-6 text-slate-500">{label}</div>;
}
