"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { CountUp } from "@/components/ui/count-up";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  ApiError,
  fetchAdminStudents,
  fetchFaculties,
  updateAdminStudentStatus,
} from "@/lib/api";
import type { FacultyItem, StudentItem } from "@/types/dashboard";

function formatDateId(dateStr: string): string {
  if (!dateStr) {
    return "-";
  }
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) {
    return dateStr;
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("active");
  const [facultyFilter, setFacultyFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    counts: { active: 0, inactive: 0, all: 0 },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFaculties()
      .then(setFaculties)
      .catch(() => {
        // Master fakultas opsional untuk filter
      });
  }, []);

  const loadStudents = useCallback(async () => {
    try {
      const response = await fetchAdminStudents({
        status: statusFilter,
        faculty_id: facultyFilter || undefined,
        search: search.trim() || undefined,
        page,
        per_page: 10,
      });
      setStudents(response.data);
      setMeta(response.meta);
    } catch (error) {
      if (error instanceof ApiError && error.status !== 401) {
        setFeedback({ type: "error", text: error.message });
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, facultyFilter, search, page]);

  useEffect(() => {
    let active = true;
    fetchAdminStudents({
      status: statusFilter,
      faculty_id: facultyFilter || undefined,
      search: search.trim() || undefined,
      page,
      per_page: 10,
    })
      .then((response) => {
        if (active) {
          setStudents(response.data);
          setMeta(response.meta);
        }
      })
      .catch((error) => {
        if (active && error instanceof ApiError && error.status !== 401) {
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
  }, [statusFilter, facultyFilter, search, page]);

  const handleToggleStatus = async (student: StudentItem) => {
    const nextStatus = student.status === "active" ? "inactive" : "active";
    const confirmMsg =
      nextStatus === "inactive"
        ? `Nonaktifkan data mahasiswa "${student.name}" (${student.npm})? Data tidak dihapus dan dapat diaktifkan kembali, namun dikeluarkan dari statistik dashboard aktif.`
        : `Aktifkan kembali data mahasiswa "${student.name}" (${student.npm})?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setTogglingId(student.id);
    setFeedback(null);
    try {
      const res = await updateAdminStudentStatus(student.id, nextStatus);
      setFeedback({ type: "success", text: res.message });
      await loadStudents();
    } catch (error) {
      setFeedback({
        type: "error",
        text: error instanceof ApiError ? error.message : "Gagal memperbarui status mahasiswa.",
      });
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AdminPageShell
      current="students"
      description="Cari, filter, ubah, dan kelola status aktif/nonaktif mahasiswa tanpa menghapus riwayat."
      onSearchChange={(val) => {
        setSearch(val);
        setPage(1);
      }}
      searchValue={search}
      title="Manajemen Data Mahasiswa"
    >
      {/* Ringkasan 3 Mini-Card bergaya SkillHub */}
      <div className="mini-stats-grid">
        <div className="mini-stat" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <span className="mini-stat__label">Mahasiswa Aktif</span>
          <div className="mini-stat__value">
            <CountUp to={meta.counts.active} />
            <small> aktif</small>
          </div>
          <div className="mini-stat__foot">
            <span className="trend-up">
              <Icon className="icon" name="circle-check" />
              Dihitung
            </span>
            <span>dalam statistik dashboard publik</span>
          </div>
        </div>

        <div className="mini-stat" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <span className="mini-stat__label">Mahasiswa Nonaktif</span>
          <div className="mini-stat__value">
            <CountUp to={meta.counts.inactive} />
            <small> arsip</small>
          </div>
          <div className="mini-stat__foot">
            <span>Arsip riwayat akademik tersimpan</span>
          </div>
        </div>

        <div className="mini-stat" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <span className="mini-stat__label">Total Data Mahasiswa</span>
          <div className="mini-stat__value">
            <CountUp to={meta.counts.all} />
            <small> total</small>
          </div>
          <div className="mini-stat__foot">
            <span>Lintas 9 fakultas &amp; 40 program studi</span>
          </div>
        </div>
      </div>

      {feedback ? (
        <div
          className={`alert ${feedback.type === "success" ? "alert--success" : "alert--error"}`}
          role="status"
        >
          <Icon name={feedback.type === "success" ? "circle-check" : "circle-alert"} />
          <span>{feedback.text}</span>
        </div>
      ) : null}

      <SpotlightCard>
        <div className="filter-bar">
          <div aria-label="Filter status mahasiswa" className="seg-tabs" role="tablist">
            <button
              className={`seg-tab${statusFilter === "active" ? " is-active" : ""}`}
              onClick={() => {
                setStatusFilter("active");
                setPage(1);
              }}
              role="tab"
              type="button"
            >
              Aktif ({meta.counts.active})
            </button>
            <button
              className={`seg-tab${statusFilter === "inactive" ? " is-active" : ""}`}
              onClick={() => {
                setStatusFilter("inactive");
                setPage(1);
              }}
              role="tab"
              type="button"
            >
              Nonaktif ({meta.counts.inactive})
            </button>
            <button
              className={`seg-tab${statusFilter === "all" ? " is-active" : ""}`}
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
              role="tab"
              type="button"
            >
              Semua ({meta.counts.all})
            </button>
          </div>

          <div className="btn-row" style={{ flex: 1, justifyContent: "flex-end" }}>
            <input
              aria-label="Cari nama, NPM, atau asal daerah"
              className="input"
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, NPM, atau daerah..."
              style={{ maxWidth: "260px", height: "38px" }}
              type="search"
              value={search}
            />

            <select
              aria-label="Filter fakultas"
              className="select"
              onChange={(e) => {
                setFacultyFilter(e.target.value);
                setPage(1);
              }}
              style={{ maxWidth: "240px", minHeight: "38px", height: "38px" }}
              value={facultyFilter}
            >
              <option value="">Semua Fakultas (9)</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.code} — {faculty.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty">
            <p className="muted">Memuat daftar mahasiswa...</p>
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            action={
              <Link className="btn btn--primary" href="/admin/students/create">
                <Icon name="plus" />
                Tambah Mahasiswa Baru
              </Link>
            }
            description="Tidak ada mahasiswa yang cocok dengan filter atau kata kunci pencarian saat ini."
            icon="users"
            title="Data mahasiswa tidak ditemukan"
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>1. Nama</th>
                  <th>2. NPM</th>
                  <th>3. Alamat sesuai KTP</th>
                  <th>4. Asal daerah</th>
                  <th>5. Fakultas &amp; Program Studi</th>
                  <th>6. Tanggal lahir</th>
                  <th>Status &amp; Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="cell-primary">{student.name}</div>
                      <div className="cell-sub">{student.gender_label}</div>
                    </td>
                    <td>
                      <span className="mono" style={{ fontWeight: 600 }}>
                        {student.npm}
                      </span>
                    </td>
                    <td style={{ maxWidth: "240px" }}>
                      <div style={{ lineHeight: 1.4 }}>{student.ktp_address}</div>
                    </td>
                    <td>
                      <div className="cell-primary" style={{ fontWeight: 500 }}>
                        {student.origin_region}
                      </div>
                    </td>
                    <td>
                      <div className="cell-primary">
                        <span
                          className="badge badge--degree"
                          style={{ marginRight: "6px", height: "20px", padding: "0 6px" }}
                        >
                          {student.study_program?.degree ?? "S1"}
                        </span>
                        {student.study_program?.name ?? "-"}
                      </div>
                      <div className="cell-sub">{student.faculty?.name ?? "-"}</div>
                    </td>
                    <td>
                      <div className="cell-primary" style={{ fontWeight: 500 }}>
                        {formatDateId(student.date_of_birth)}
                      </div>
                      <div className="cell-sub">{student.age} tahun</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span
                          className={`badge ${
                            student.status === "active" ? "badge--active" : "badge--inactive"
                          }`}
                        >
                          {student.status_label}
                        </span>
                        <Link
                          className="btn btn--secondary btn--sm"
                          href={`/admin/students/${student.id}`}
                          title="Lihat detail"
                        >
                          Detail
                        </Link>
                        <Link
                          className="btn btn--secondary btn--sm"
                          href={`/admin/students/${student.id}/edit`}
                          title="Edit mahasiswa"
                        >
                          Edit
                        </Link>
                        <button
                          className={`btn btn--sm ${
                            student.status === "active" ? "btn--danger-soft" : "btn--accent"
                          }`}
                          disabled={togglingId === student.id}
                          onClick={() => handleToggleStatus(student)}
                          type="button"
                        >
                          {student.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="table-footer">
          <span>
            Menampilkan <b>{students.length}</b> dari <b>{meta.total}</b> data mahasiswa (Halaman{" "}
            {meta.current_page} dari {meta.last_page})
          </span>

          <div className="btn-row">
            <button
              className="btn btn--secondary btn--sm"
              disabled={meta.current_page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              type="button"
            >
              <Icon name="chevron-left" />
              Sebelumnya
            </button>
            <button
              className="btn btn--secondary btn--sm"
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => setPage((p) => p + 1)}
              type="button"
            >
              Berikutnya
              <Icon name="chevron-right" />
            </button>
          </div>
        </div>
      </SpotlightCard>
    </AdminPageShell>
  );
}
