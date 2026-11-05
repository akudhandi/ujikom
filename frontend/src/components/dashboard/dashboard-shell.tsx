import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { Stat } from "@/components/ui/stat";

type DashboardShellProps = {
  apiReady: boolean;
};

const charts = [
  {
    title: "Jenis kelamin",
    description: "Perbandingan mahasiswa aktif menurut gender.",
    label: "Belum ada data gender untuk ditampilkan.",
  },
  {
    title: "Kelompok usia",
    description: "Usia dihitung dari tanggal lahir mahasiswa.",
    label: "Belum ada data usia untuk ditampilkan.",
  },
  {
    title: "Asal daerah",
    description: "Daerah asal mahasiswa aktif.",
    label: "Belum ada data asal daerah untuk ditampilkan.",
  },
  {
    title: "Fakultas dan program studi",
    description: "Jumlah mahasiswa aktif per program studi.",
    label: "Belum ada data program studi untuk ditampilkan.",
  },
] as const;

export function DashboardShell({ apiReady }: DashboardShellProps) {
  return (
    <>
      <SiteHeader current="dashboard" />

      <main>
        <section className="section">
          <div className="wrap hero-grid">
            <div className="hero-copy hero-text">
              <span className="eyebrow">Dashboard publik</span>
              <h1>Data mahasiswa Universitas Cakrawala Nusantara</h1>
              <p>
                Ringkasan komposisi mahasiswa aktif: gender, usia, asal daerah, dan program studi. Halaman ini
                menampilkan statistik agregat, bukan data pribadi.
              </p>
              <div className="btn-row">
                <Link className="btn btn--primary" href="/admin/login">
                  <Icon name="lock" /> Masuk admin
                </Link>
                <Link className="btn btn--secondary" href="/admin/students">
                  <Icon name="table" /> Lihat data mahasiswa
                </Link>
              </div>
            </div>

            <div className="card fact">
              <span className="t-label muted">Mahasiswa aktif</span>
              <p className="fact__value">0</p>
              <span className="pill pill--muted mt">
                <Icon name={apiReady ? "circle-check" : "circle-alert"} />
                {apiReady ? "API Laravel terhubung" : "Menunggu API Laravel"}
              </span>
            </div>
          </div>
        </section>

        <section className="section section--surface band">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Ringkasan</span>
              <h2>Ringkasan mahasiswa aktif</h2>
              <p>Angka diperbarui setiap halaman dimuat ulang dari agregat Laravel.</p>
            </div>
            <div className="cols cols-3">
              <Stat icon="users" label="Total mahasiswa aktif" note="Belum ada data" value="0" />
              <Stat icon="user-check" label="Mahasiswa laki-laki" note="0% dari total aktif" value="0" />
              <Stat icon="book-open" label="Mahasiswa perempuan" note="0% dari total aktif" value="0" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Analitik publik</span>
              <h2>Distribusi mahasiswa</h2>
              <p>Grafik memakai agregat dari Laravel. Data individu tidak dikirim ke halaman publik.</p>
            </div>
            <div className="cols cols-2">
              {charts.map((chart) => (
                <article className="card" key={chart.title}>
                  <h3>{chart.title}</h3>
                  <p className="t-small muted">{chart.description}</p>
                  <div className="mt">
                    <EmptyState description="Grafik muncul setelah data mahasiswa diinput melalui area admin." title={chart.label} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ground-inverse section band">
          <div className="wrap hero-grid">
            <div className="hero-copy hero-text">
              <span className="eyebrow">Area administrasi</span>
              <h2>Kelola data mahasiswa dengan akses admin</h2>
              <p>
                Tambah, ubah, dan nonaktifkan data mahasiswa. Semua perubahan tercatat dan hanya untuk admin
                terautentikasi.
              </p>
            </div>
            <div className="btn-row">
              <Link className="btn btn--primary" href="/admin/login">
                Masuk admin <Icon name="arrow-right" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer closing">
        <div className="wrap footer__bar">
          <p>Universitas Cakrawala Nusantara · Sistem Manajemen Data Mahasiswa</p>
          <p>Dashboard hanya menampilkan statistik agregat.</p>
        </div>
      </footer>
    </>
  );
}
