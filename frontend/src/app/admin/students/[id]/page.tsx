"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ApiError, fetchAdminStudent, updateAdminStudentStatus } from "@/lib/api";
import type { StudentItem } from "@/types/dashboard";

function formatDateLongId(dateStr: string): string {
  if (!dateStr) {
    return "-";
  }
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) {
    return dateStr;
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent] = useState<StudentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toggling, setToggling] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    let active = true;
    fetchAdminStudent(id)
      .then((res) => {
        if (active) {
          setStudent(res);
        }
      })
      .catch((error) => {
        if (active && error instanceof ApiError) {
          setFeedback({ type: "error", text: error.message });
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!student) {
      return;
    }
    const nextStatus = student.status === "active" ? "inactive" : "active";
    const confirmed = window.confirm(
      nextStatus === "inactive"
        ? `Nonaktifkan mahasiswa "${student.name}" (${student.npm})? Data tetap tersimpan tetapi dikeluarkan dari agregat dashboard aktif.`
        : `Aktifkan kembali mahasiswa "${student.name}" (${student.npm})?`,
    );
    if (!confirmed) {
      return;
    }

    setToggling(true);
    setFeedback(null);
    try {
      const res = await updateAdminStudentStatus(student.id, nextStatus);
      setStudent(res.data);
      setFeedback({ type: "success", text: res.message });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error instanceof ApiError ? error.message : "Gagal mengubah status mahasiswa.",
      });
    } finally {
      setToggling(false);
    }
  };

  return (
    <AdminPageShell
      action={
        <div className="btn-row">
          <Link className="btn btn--secondary" href="/admin/students">
            <Icon name="table" />
            Daftar Mahasiswa
          </Link>
          <Link className="btn btn--primary" href={`/admin/students/${id}/edit`}>
            <Icon name="pencil" />
            Edit Data Mahasiswa
          </Link>
        </div>
      }
      backHref="/admin/students"
      backLabel="Kembali ke Data Mahasiswa"
      description="Rincian lengkap identitas, alamat KTP privat, dan riwayat status akademik mahasiswa."
      title={student ? student.name : `Detail Mahasiswa #${id}`}
    >
      {feedback ? (
        <div
          className={`alert ${feedback.type === "success" ? "alert--success" : "alert--error"}`}
          role="status"
        >
          <Icon name={feedback.type === "success" ? "circle-check" : "circle-alert"} />
          <span>{feedback.text}</span>
        </div>
      ) : null}

      {loading ? (
        <SpotlightCard>
          <p className="muted">Memuat detail mahasiswa...</p>
        </SpotlightCard>
      ) : !student ? (
        <SpotlightCard>
          <EmptyState
            action={
              <Link className="btn btn--primary" href="/admin/students">
                Kembali ke Daftar
              </Link>
            }
            description="Data mahasiswa tidak ditemukan pada database."
            icon="circle-alert"
            title="Mahasiswa Tidak Ditemukan"
          />
        </SpotlightCard>
      ) : (
        <div className="bento-grid">
          <SpotlightCard className="col-7">
            <div className="bento-card__head">
              <div>
                <h2 className="bento-card__title">Profil &amp; Akademik Mahasiswa</h2>
                <p className="bento-card__sub">Enam atribut inti sesuai standar administrasi UCN</p>
              </div>
              <span
                className={`badge ${
                  student.status === "active" ? "badge--active" : "badge--inactive"
                }`}
              >
                {student.status_label}
              </span>
            </div>

            <div className="mini-stats-grid">
              <div className="mini-stat">
                <span className="mini-stat__label">NPM</span>
                <div className="mini-stat__value mono" style={{ fontSize: "20px" }}>
                  {student.npm}
                </div>
                <div className="mini-stat__foot">{student.gender_label}</div>
              </div>

              <div className="mini-stat">
                <span className="mini-stat__label">Usia Saat Ini</span>
                <div className="mini-stat__value">
                  {student.age}
                  <small> thn</small>
                </div>
                <div className="mini-stat__foot">{formatDateLongId(student.date_of_birth)}</div>
              </div>

              <div className="mini-stat">
                <span className="mini-stat__label">Fakultas</span>
                <div className="mini-stat__value" style={{ fontSize: "22px" }}>
                  {student.faculty?.code ?? "-"}
                </div>
                <div className="mini-stat__foot">
                  [{student.study_program?.degree}] {student.study_program?.name}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px", paddingTop: "8px" }}>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                  FAKULTAS &amp; PROGRAM STUDI
                </div>
                <div style={{ fontWeight: 600, marginTop: "4px" }}>
                  {student.faculty?.name} — [{student.study_program?.degree}]{" "}
                  {student.study_program?.name}
                </div>
              </div>

              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                  ASAL DAERAH
                </div>
                <div style={{ fontWeight: 600, marginTop: "4px" }}>{student.origin_region}</div>
              </div>

              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                  ALAMAT LENGKAP SESUAI KTP (PRIVAT ADMIN)
                </div>
                <div style={{ fontWeight: 500, marginTop: "4px", lineHeight: 1.5 }}>
                  {student.ktp_address}
                </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="col-5">
            <div className="bento-card__head">
              <div>
                <h2 className="bento-card__title">Pengaturan Status Mahasiswa</h2>
                <p className="bento-card__sub">Pengelolaan status keaktifan akademik</p>
              </div>
              <Icon className="icon" name="sliders" />
            </div>

            <p style={{ fontSize: "13.5px", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
              Menonaktifkan data mahasiswa <b>tidak menghapus</b> rekaman dari database. Mahasiswa
              yang berstatus nonaktif otomatis dikeluarkan dari perhitungan grafik pada dashboard
              publik, namun tetap dapat dicari dan diaktifkan kembali kapan saja.
            </p>

            {student.status === "inactive" && student.deactivated_at ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--surface-muted)",
                  border: "1px solid var(--line)",
                  fontSize: "12.5px",
                }}
              >
                <div>
                  <b>Dinonaktifkan pada:</b>{" "}
                  {new Date(student.deactivated_at).toLocaleString("id-ID")}
                </div>
                {student.deactivated_by ? (
                  <div style={{ marginTop: "4px" }}>
                    <b>Oleh Admin:</b> {student.deactivated_by.name} (@
                    {student.deactivated_by.username})
                  </div>
                ) : null}
              </div>
            ) : null}

            <div style={{ marginTop: "auto", display: "grid", gap: "10px" }}>
              <button
                className={`btn btn--block ${
                  student.status === "active" ? "btn--danger-soft" : "btn--accent"
                }`}
                disabled={toggling}
                onClick={handleToggleStatus}
                type="button"
              >
                <Icon name={student.status === "active" ? "ban" : "rotate-ccw"} />
                {toggling
                  ? "Memproses..."
                  : student.status === "active"
                    ? "Nonaktifkan Mahasiswa Ini"
                    : "Aktifkan Kembali Mahasiswa Ini"}
              </button>

              <Link
                className="btn btn--secondary btn--block"
                href={`/admin/students/${student.id}/edit`}
              >
                <Icon name="pencil" />
                Ubah Data Identitas &amp; Akademik
              </Link>
            </div>
          </SpotlightCard>
        </div>
      )}
    </AdminPageShell>
  );
}
