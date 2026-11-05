"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/layout/site-header";
import { CountUp } from "@/components/ui/count-up";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { fetchDashboardData } from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";

type DashboardShellProps = {
  initialData: DashboardData | null;
  apiReady: boolean;
};

export function DashboardShell({ initialData, apiReady: initialApiReady }: DashboardShellProps) {
  const [data, setData] = useState<DashboardData | null>(initialData);
  const [apiReady, setApiReady] = useState<boolean>(initialApiReady);
  const [selectedFacultyCode, setSelectedFacultyCode] = useState<string>("ALL");
  const [selectedDegree, setSelectedDegree] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      return;
    }
    let mounted = true;
    fetchDashboardData()
      .then((res) => {
        if (mounted) {
          setData(res);
          setApiReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setApiReady(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [initialData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await fetchDashboardData();
      setData(fresh);
      setApiReady(true);
    } catch {
      // Pertahankan data terakhir jika gagal
    } finally {
      setRefreshing(false);
    }
  };

  const summary = data?.summary ?? {
    total_active_students: 0,
    male_count: 0,
    female_count: 0,
    male_percentage: 0,
    female_percentage: 0,
    total_faculties: 9,
    active_faculties_count: 0,
    total_study_programs: 40,
    generated_at: "",
  };

  const faculties = useMemo(() => data?.faculty_distribution ?? [], [data]);
  const origins = useMemo(() => data?.origin_distribution ?? [], [data]);
  const ages = useMemo(() => data?.age_distribution ?? [], [data]);

  const topFaculty = useMemo(() => {
    if (faculties.length === 0) {
      return null;
    }
    return [...faculties].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))[0];
  }, [faculties]);

  const displayedPrograms = useMemo(() => {
    if (selectedFacultyCode === "ALL") {
      return faculties.map((faculty) => ({
        id: faculty.id,
        label: faculty.name,
        badge: faculty.code,
        count: faculty.count ?? 0,
        percentage: faculty.percentage ?? 0,
      }));
    }
    const target = faculties.find((item) => item.code === selectedFacultyCode);
    if (!target) {
      return [];
    }
    return target.study_programs.map((program) => ({
      id: program.id,
      label: program.name,
      badge: program.degree,
      count: program.count ?? 0,
      percentage: program.percentage ?? 0,
    }));
  }, [faculties, selectedFacultyCode]);

  const filteredCatalogFaculties = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return faculties
      .map((faculty) => {
        const matchingPrograms = faculty.study_programs.filter((prog) => {
          const degreeMatch = selectedDegree === "ALL" || prog.degree === selectedDegree;
          const queryMatch =
            q === "" ||
            prog.name.toLowerCase().includes(q) ||
            faculty.name.toLowerCase().includes(q) ||
            faculty.code.toLowerCase().includes(q);
          return degreeMatch && queryMatch;
        });

        return {
          ...faculty,
          study_programs: matchingPrograms,
        };
      })
      .filter((faculty) => faculty.study_programs.length > 0);
  }, [faculties, selectedDegree, searchQuery]);

  // Buat titik kurva SVG halus untuk distribusi 9 fakultas
  const curvePoints = useMemo(() => {
    const items = faculties.length > 0 ? faculties : Array.from({ length: 9 }, (_, i) => ({ count: 0, code: `F${i + 1}` }));
    const maxCount = Math.max(...items.map((f) => f.count ?? 0), 1);
    const width = 520;
    const height = 140;
    const padX = 24;
    const padY = 22;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    return items.map((item, idx) => {
      const x = padX + (items.length > 1 ? (idx / (items.length - 1)) * usableW : usableW / 2);
      const ratio = (item.count ?? 0) / maxCount;
      const y = padY + usableH - ratio * usableH;
      return {
        x: Math.round(x),
        y: Math.round(y),
        code: item.code,
        count: item.count ?? 0,
      };
    });
  }, [faculties]);

  const svgPath = useMemo(() => {
    if (curvePoints.length === 0) {
      return { line: "", area: "" };
    }
    let d = `M ${curvePoints[0].x} ${curvePoints[0].y}`;
    for (let i = 0; i < curvePoints.length - 1; i++) {
      const curr = curvePoints[i];
      const next = curvePoints[i + 1];
      const ctrlX = Math.round((curr.x + next.x) / 2);
      d += ` C ${ctrlX} ${curr.y}, ${ctrlX} ${next.y}, ${next.x} ${next.y}`;
    }
    const last = curvePoints[curvePoints.length - 1];
    const first = curvePoints[0];
    const area = `${d} L ${last.x} 132 L ${first.x} 132 Z`;
    return { line: d, area };
  }, [curvePoints]);

  const maleWidthPercent = summary.total_active_students > 0
    ? Math.max(18, Math.min(82, Math.round(summary.male_percentage)))
    : 50;

  return (
    <AppShell
      apiConnected={apiReady}
      current="dashboard"
      headerAction={
        <>
          <button
            className="btn btn--secondary"
            disabled={refreshing}
            onClick={handleRefresh}
            title="Muat ulang agregat real-time"
            type="button"
          >
            <Icon name="rotate-ccw" />
            {refreshing ? "Memuat..." : "Segarkan Data"}
          </button>
          <Link className="btn btn--primary" href="/admin/students">
            <span>Kelola Mahasiswa</span>
            <Icon name="arrow-up-right" />
          </Link>
        </>
      }
      onSearchChange={setSearchQuery}
      searchPlaceholder="Cari fakultas atau program studi di dashboard..."
      searchValue={searchQuery}
      subtitle="Statistik agregat mahasiswa aktif Universitas Cakrawala Nusantara — diperbarui secara real-time."
      title="Halo, Selamat Datang di UCN Hub"
    >
      {/* BARIS 1: Ikhtisar Mahasiswa Aktif (SkillHub Growth Overview) + Analitik Akademik (3 Mini Cards) */}
      <section aria-label="Ringkasan utama mahasiswa" className="bento-grid">
        <SpotlightCard className="col-5">
          <div className="bento-card__head">
            <div>
              <h2 className="bento-card__title">Ikhtisar Mahasiswa</h2>
              <p className="bento-card__sub">Komposisi mahasiswa berstatus aktif</p>
            </div>
            <span className="chip-select">
              <span className="status-dot" />
              Status: Aktif
            </span>
          </div>

          <div className="growth-hero">
            <div className="growth-hero__number">
              <CountUp separator="." to={summary.total_active_students} />
            </div>
            <span className="growth-hero__label">Total Mahasiswa Aktif Terdaftar</span>
          </div>

          <div className="growth-split">
            <div className="growth-split__item">
              <span className="growth-split__val">
                <CountUp decimals={1} suffix="%" to={summary.male_percentage} />
              </span>
              <span className="growth-split__capt">
                Laki-laki ({summary.male_count} mhs)
              </span>
            </div>
            <div className="growth-split__item growth-split__item--right">
              <span className="growth-split__val">
                <CountUp decimals={1} suffix="%" to={summary.female_percentage} />
              </span>
              <span className="growth-split__capt">
                Perempuan ({summary.female_count} mhs)
              </span>
            </div>
          </div>

          <div
            aria-label={`Proporsi Laki-laki ${summary.male_percentage}% dan Perempuan ${summary.female_percentage}%`}
            className="ruler-strip"
             style={{
              gridTemplateColumns: `${maleWidthPercent}% 1fr`,
            }}
          >
            <div className="ruler-strip__fill" />
            <div aria-hidden="true" className="ruler-strip__ticks">
              {Array.from({ length: 22 }).map((_, index) => (
                <span className="ruler-strip__tick" key={index} />
              ))}
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="col-7">
          <div className="bento-card__head">
            <div>
              <h2 className="bento-card__title">Analitik Akademik</h2>
              <p className="bento-card__sub">Cakupan unit pendidikan dan demografi wilayah</p>
            </div>
            <span className="chip-select">
              <Icon className="icon" name="calendar" />
              TA 2025/2026
            </span>
          </div>

          <div className="mini-stats-grid" style={{ flex: 1 }}>
            <div className="mini-stat">
              <span className="mini-stat__label">Fakultas &amp; Pascasarjana</span>
              <div className="mini-stat__value">
                <CountUp to={summary.active_faculties_count} />
                <small>/{summary.total_faculties}</small>
              </div>
              <div className="mini-stat__foot">
                <span className="trend-up">
                  <Icon className="icon" name="trending-up" />
                  100%
                </span>
                <span>unit akademik terdaftar</span>
              </div>
            </div>

            <div className="mini-stat">
              <span className="mini-stat__label">Program Studi</span>
              <div className="mini-stat__value">
                <CountUp to={summary.total_study_programs} />
                <small> prodi</small>
              </div>
              <div className="mini-stat__foot">
                <span className="trend-up">
                  <Icon className="icon" name="graduation-cap" />
                  S1–S3
                </span>
                <span>D4, Profesi, Magister &amp; Doktor</span>
              </div>
            </div>

            <div className="mini-stat">
              <span className="mini-stat__label">Sebaran Asal Daerah</span>
              <div className="mini-stat__value">
                <CountUp to={origins.length} />
                <small> wilayah</small>
              </div>
              <div className="mini-stat__foot">
                <span className="trend-up">
                  <Icon className="icon" name="map-pin" />
                  Top 10
                </span>
                <span>kota/kabupaten asal</span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* BARIS 2: Kurva & Breakdown Fakultas/Prodi + Demografi Kelompok Usia & Gender */}
      <section
        aria-label="Visualisasi demografi dan akademik"
        className="bento-grid"
        id="analitik-demografi"
      >
        <SpotlightCard className="col-7">
          <div className="bento-card__head">
            <div>
              <h2 className="bento-card__title">Distribusi Fakultas &amp; Program Studi</h2>
              <p className="bento-card__sub">
                Sebaran mahasiswa aktif pada 9 fakultas dan 40 program studi
              </p>
            </div>
            <div className="circle-actions">
              <label className="sr-only" htmlFor="faculty-filter-select">
                Pilih fakultas
              </label>
              <select
                className="chip-select"
                id="faculty-filter-select"
                onChange={(e) => setSelectedFacultyCode(e.target.value)}
                value={selectedFacultyCode}
              >
                <option value="ALL">Semua Fakultas (9)</option>
                {faculties.map((fac) => (
                  <option key={fac.id} value={fac.code}>
                    {fac.code} — {fac.count ?? 0} mhs
                  </option>
                ))}
              </select>
            </div>
          </div>

          {summary.total_active_students === 0 ? (
            <EmptyState
              description="Tambahkan mahasiswa aktif melalui halaman admin untuk melihat grafik fakultas dan program studi."
              icon="building"
              title="Belum ada mahasiswa aktif"
            />
          ) : (
            <>
              <div className="curve-box">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {topFaculty ? (
                    <span className="curve-callout">
                      <span className="status-dot" />
                      Tertinggi: <b>{topFaculty.code}</b> ({topFaculty.count} mahasiswa ·{" "}
                      {topFaculty.percentage}%)
                    </span>
                  ) : null}
                  <span className="muted" style={{ fontSize: "12px" }}>
                    Klik filter di kanan atas untuk rincian prodi per fakultas
                  </span>
                </div>

                <svg
                  aria-label="Kurva perbandingan jumlah mahasiswa aktif antar fakultas"
                  role="img"
                  style={{ width: "100%", height: "145px", display: "block" }}
                  viewBox="0 0 520 148"
                >
                  <defs>
                    <linearGradient id="emeraldAreaGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity="0.26" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line stroke="#eceef2" strokeDasharray="4 4" x1="24" x2="496" y1="36" y2="36" />
                  <line stroke="#eceef2" strokeDasharray="4 4" x1="24" x2="496" y1="84" y2="84" />
                  <line stroke="#e5e7eb" x1="24" x2="496" y1="132" y2="132" />
                  {svgPath.area ? <path d={svgPath.area} fill="url(#emeraldAreaGrad)" /> : null}
                  {svgPath.line ? (
                    <path
                      d={svgPath.line}
                      fill="none"
                      stroke="#16a34a"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  ) : null}
                  {curvePoints.map((pt) => (
                    <g key={pt.code}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        fill="#ffffff"
                        r="4.5"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                      />
                      <text
                        fill="#6b7280"
                        fontFamily="var(--font-mono)"
                        fontSize="9.5"
                        textAnchor="middle"
                        x={pt.x}
                        y="145"
                      >
                        {pt.code === "PASCASARJANA" ? "PASCA" : pt.code}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="bar-list">
                {displayedPrograms.map((item) => (
                  <div className="bar-row" key={item.id}>
                    <div className="bar-row__meta">
                      <span className="bar-row__name">
                        <span
                          className="badge badge--degree"
                          style={{ marginRight: "8px", height: "22px", padding: "0 8px" }}
                        >
                          {item.badge}
                        </span>
                        {item.label}
                      </span>
                      <span className="bar-row__val">
                        {item.count} mhs ({item.percentage}%)
                      </span>
                    </div>
                    <div className="bar-row__track">
                      <div
                        className="bar-row__fill"
                        style={{ width: `${Math.max(item.count > 0 ? 5 : 0, item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SpotlightCard>

        <div className="col-5" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <SpotlightCard>
            <div className="bento-card__head">
              <div>
                <h2 className="bento-card__title">Kelompok Usia &amp; Gender</h2>
                <p className="bento-card__sub">Dihitung otomatis dari tanggal lahir (Asia/Jakarta)</p>
              </div>
              <span className="badge badge--active">Aktif</span>
            </div>

            {summary.total_active_students === 0 ? (
              <EmptyState
                description="Distribusi kelompok usia muncul ketika terdapat mahasiswa aktif."
                icon="calendar"
                title="Belum ada data usia"
              />
            ) : (
              <div className="bar-list">
                {ages.map((bucket) => (
                  <div className="bar-row" key={bucket.range}>
                    <div className="bar-row__meta">
                      <span className="bar-row__name">{bucket.range}</span>
                      <span className="bar-row__val">
                        {bucket.count} mhs ({bucket.percentage}%)
                      </span>
                    </div>
                    <div className="bar-row__track">
                      <div
                        className="bar-row__fill bar-row__fill--dark"
                        style={{
                          width: `${Math.max(bucket.count > 0 ? 6 : 0, bucket.percentage)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SpotlightCard>

          <SpotlightCard style={{ flex: 1 }}>
            <div className="bento-card__head">
              <div>
                <h2 className="bento-card__title">Sebaran Asal Daerah (Top 10)</h2>
                <p className="bento-card__sub">Kota/kabupaten &amp; provinsi asal mahasiswa aktif</p>
              </div>
              <span className="chip-select">
                <Icon className="icon" name="map-pin" />
                {origins.length} daerah
              </span>
            </div>

            {origins.length === 0 ? (
              <EmptyState
                description="Grafik asal daerah akan terisi otomatis saat data mahasiswa aktif tersedia."
                icon="map-pin"
                title="Belum ada data asal daerah"
              />
            ) : (
              <div className="bar-list">
                {origins.map((origin) => (
                  <div className="bar-row" key={origin.region}>
                    <div className="bar-row__meta">
                      <span className="bar-row__name">{origin.region}</span>
                      <span className="bar-row__val">
                        {origin.count} mhs ({origin.percentage}%)
                      </span>
                    </div>
                    <div className="bar-row__track">
                      <div
                        className="bar-row__fill"
                        style={{
                          width: `${Math.max(origin.count > 0 ? 6 : 0, origin.percentage)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SpotlightCard>
        </div>
      </section>

      {/* BARIS 3: Katalog Lengkap 9 Fakultas & 40 Program Studi */}
      <SpotlightCard id="katalog-fakultas">
        <div className="filter-bar">
          <div>
            <h2 className="bento-card__title">Katalog 9 Fakultas &amp; 40 Program Studi</h2>
            <p className="bento-card__sub">
              Master referensi resmi Fakultas, Program Sarjana (S1), Sarjana Terapan (D4), Profesi,
              Magister (S2), dan Doktor (S3)
            </p>
          </div>

          <div aria-label="Filter jenjang program studi" className="seg-tabs" role="tablist">
            {(["ALL", "S1", "D4", "Profesi", "S2", "S3"] as const).map((deg) => (
              <button
                className={`seg-tab${selectedDegree === deg ? " is-active" : ""}`}
                key={deg}
                onClick={() => setSelectedDegree(deg)}
                role="tab"
                type="button"
              >
                {deg === "ALL" ? "Semua (40)" : deg}
              </button>
            ))}
          </div>
        </div>

        <div className="faculty-catalog">
          {filteredCatalogFaculties.map((faculty) => (
            <article className="faculty-tile" key={faculty.id}>
              <div className="faculty-tile__head">
                <div>
                  <span className="badge badge--degree">{faculty.code}</span>
                  <h3 className="faculty-tile__name" style={{ marginTop: "6px" }}>
                    {faculty.name}
                  </h3>
                </div>
                <span className="badge badge--active">{faculty.count ?? 0} aktif</span>
              </div>

              <div className="faculty-tile__tags">
                {faculty.study_programs.map((program) => (
                  <span className="program-chip" key={program.id}>
                    <b className="mono" style={{ fontSize: "11px", marginRight: "5px" }}>
                      [{program.degree}]
                    </b>
                    {program.name}
                    {(program.count ?? 0) > 0 ? (
                      <strong style={{ marginLeft: "6px", color: "var(--accent-ink)" }}>
                        · {program.count}
                      </strong>
                    ) : null}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SpotlightCard>
    </AppShell>
  );
}
