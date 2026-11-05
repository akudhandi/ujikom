import Link from "next/link";

import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  return (
    <main className="auth">
      <section className="auth__aside ground-inverse">
        <div className="auth__brand">
          <span aria-hidden="true" className="nav__mark">
            <Icon className="icon--lg" name="graduation-cap" />
          </span>
          <span className="nav__name">
            <b>Data Mahasiswa</b>
            <span>Universitas Cakrawala Nusantara</span>
          </span>
        </div>

        <div className="stack">
          <span className="eyebrow">Area administrasi</span>
          <h1>Akses administrasi data mahasiswa</h1>
          <p className="t-lead">
            Masuk untuk menambah, mengubah, dan menonaktifkan data mahasiswa lewat satu area terproteksi.
          </p>
        </div>

        <p className="t-small muted">Universitas Cakrawala Nusantara</p>
      </section>

      <section className="auth__body">
        <div className="auth__form">
          <Link className="auth__back" href="/">
            <Icon name="chevron-left" /> Kembali ke dashboard
          </Link>

          <div className="card card--pad-lg">
            <div className="card__head">
              <span className="eyebrow">Masuk admin</span>
              <h2 className="t-h3">Akses administrasi</h2>
              <p className="t-small muted">Gunakan akun admin yang telah dikonfigurasi.</p>
            </div>

            <form className="stack mt" noValidate>
              <label className="field">
                <span className="field__label">Email</span>
                <input autoComplete="username" className="input" name="email" placeholder="admin@ucn.test" type="email" />
              </label>
              <label className="field">
                <span className="field__label">Password</span>
                <input autoComplete="current-password" className="input" name="password" placeholder="Masukkan password" type="password" />
              </label>
              <button className="btn btn--primary btn--block mt" type="submit">
                <Icon name="log-out" /> Masuk ke administrasi
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
