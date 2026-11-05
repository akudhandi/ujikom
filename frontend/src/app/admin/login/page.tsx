"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ApiError, fetchCurrentAdmin, loginAdmin } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("admin");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCurrentAdmin().then((user) => {
      if (active && user) {
        router.replace("/admin/students");
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage("Username/email dan password wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await loginAdmin(identifier.trim(), password);
      router.push("/admin/students");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Tidak dapat terhubung ke layanan autentikasi. Silakan coba kembali.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-shell">
      <div className="login-card">
        <section className="login-card__aside">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link className="sidebar__logo" href="/">
              <span
                aria-hidden="true"
                className="sidebar__mark"
                style={{ background: "#16a34a", color: "#ffffff" }}
              >
                <Icon className="icon" name="graduation-cap" />
              </span>
              <span className="sidebar__title">
                <b style={{ color: "#ffffff" }}>UCN Hub</b>
                <span style={{ color: "#9ca3af" }}>Universitas Cakrawala Nusantara</span>
              </span>
            </Link>
            <span className="badge badge--active">Portal Akademik</span>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <h1>Portal Administrasi Data Mahasiswa</h1>
            <p style={{ color: "#d1d5db", fontSize: "14.5px", lineHeight: 1.6 }}>
              Kelola pencatatan mahasiswa baru, pembaruan data akademik lintas 9 fakultas &amp; 40
              program studi, serta pengelolaan status aktif mahasiswa yang terintegrasi dengan
              statistik universitas.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 600 }}>
                9
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>Fakultas &amp; Pasca</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 600 }}>
                40
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>Program Studi</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 600 }}>
                Terpadu
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>Data Kemahasiswaan</div>
            </div>
          </div>
        </section>

        <section className="login-card__body">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <Link
                className="btn btn--secondary btn--sm"
                href="/"
                prefetch={false}
                style={{ display: "inline-flex" }}
              >
                <Icon name="chevron-left" />
                Kembali ke Dashboard Publik
              </Link>
              <ThemeToggle />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Masuk sebagai Admin
            </h2>
            <p className="muted" style={{ fontSize: "13.5px", marginTop: "4px" }}>
              Gunakan akun administrator untuk mengelola data mahasiswa.
            </p>
          </div>

          {errorMessage ? (
            <div className="alert alert--error" role="alert">
              <Icon name="circle-alert" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
            <label className="field">
              <span className="field__label">
                Username atau Email <span className="field__req">*</span>
              </span>
              <input
                autoComplete="username"
                className="input"
                name="identifier"
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin atau admin@ucn.ac.id"
                required
                type="text"
                value={identifier}
              />
            </label>

            <label className="field">
              <span className="field__label">
                Password <span className="field__req">*</span>
              </span>
              <input
                autoComplete="current-password"
                className="input"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                required
                type="password"
                value={password}
              />
            </label>

            <button className="btn btn--primary btn--block" disabled={submitting} type="submit">
              <Icon name="lock" />
              {submitting ? "Memverifikasi Akun..." : "Masuk ke Workspace Admin"}
            </button>
          </form>

          <div className="cred-box">
            <div>
              <div style={{ fontWeight: 600, color: "var(--ink)" }}>Akses Cepat Penguji</div>
              <div className="mono muted" style={{ fontSize: "12px" }}>
                user: admin · pass: admin123
              </div>
            </div>
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => {
                setIdentifier("admin");
                setPassword("admin123");
                setErrorMessage(null);
              }}
              type="button"
            >
              Isi Otomatis
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
