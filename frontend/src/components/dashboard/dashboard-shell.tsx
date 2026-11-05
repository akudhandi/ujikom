"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FacultyDistributionChart } from "@/components/dashboard/faculty-distribution-chart";
import { type PublicNavKey, PublicShell } from "@/components/layout/site-header";
import { CountUp } from "@/components/ui/count-up";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PieChart, type PieChartSlice } from "@/components/ui/pie-chart";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { fetchDashboardData } from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";

type DashboardShellProps = {
  initialData: DashboardData | null;
  apiReady?: boolean;
  section?: PublicNavKey;
  initialSearch?: string;
  initialFacultyCode?: string;
};

const AGE_COLORS = ["#16a34a", "var(--chart-secondary)", "#0284c7", "#f59e0b"];
const ORIGIN_COLORS = ["#16a34a", "var(--chart-secondary)", "#0284c7", "#f59e0b", "#7c3aed", "#64748b"];

export function DashboardShell({
  initialData,
  section = "ikhtisar",
  initialSearch = "",
  initialFacultyCode = "ALL",
}: DashboardShellProps) {
  const [data, setData] = useState<DashboardData | null>(initialData);
  const [selectedFacultyCode, setSelectedFacultyCode] = useState<string>(
    initialFacultyCode || "ALL",
  );
  const [selectedDegree, setSelectedDegree] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const loadLatestDashboard = () => {
      fetchDashboardData()
        .then((res) => {
          if (mounted) {
            setData(res);
          }
        })
        .catch(() => {
          // Pertahankan state terakhir jika jaringan gagal
        });
    };

    loadLatestDashboard();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        loadLatestDashboard();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      mounted = false;
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [section]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await fetchDashboardData();
      setData(fresh);
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

  const genderSlices: PieChartSlice[] = useMemo(
    () => [
      {
        key: "male",
        label: "Laki-laki",
        count: summary.male_count,
        percentage: summary.male_percentage,
        color: "var(--chart-secondary)",
      },
      {
        key: "female",
        label: "Perempuan",
        count: summary.female_count,
        percentage: summary.female_percentage,
        color: "#16a34a",
      },
    ],
    [summary.male_count, summary.female_count, summary.male_percentage, summary.female_percentage],
  );

  const ageSlices: PieChartSlice[] = useMemo(
    () =>
      ages.map((bucket, idx) => ({
        key: bucket.range,
        label: bucket.range,
        count: bucket.count,
        percentage: bucket.percentage,
        color: AGE_COLORS[idx % AGE_COLORS.length],
      })),
    [ages],
  );

  const originSlices: PieChartSlice[] = useMemo(() => {
    if (origins.length === 0) {
      return [];
    }
    const topFive = origins.slice(0, 5);
    const rest = origins.slice(5);
    const restCount = rest.reduce((acc, item) => acc + item.count, 0);
    const total = summary.total_active_students;

    const slices: PieChartSlice[] = topFive.map((item, idx) => ({
      key: item.region,
      label: item.region,
      count: item.count,
      percentage: item.percentage,
      color: ORIGIN_COLORS[idx % ORIGIN_COLORS.length],
    }));

    if (restCount > 0) {
      slices.push({
        key: "other-regions",
        label: "Wilayah Lainnya",
        count: restCount,
        percentage: total > 0 ? Math.round((restCount / total) * 1000) / 10 : 0,
        color: ORIGIN_COLORS[5],
      });
    }
    return slices;
  }, [origins, summary.total_active_students]);

  const topFaculty = useMemo(() => {
    if (faculties.length === 0) {
      return null;
    }
    return [...faculties].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))[0];
  }, [faculties]);

  const topAgeGroup = useMemo(() => {
    if (ages.length === 0) {
      return null;
    }
    return [...ages].sort((a, b) => b.count - a.count)[0];
  }, [ages]);

  const topOrigin = useMemo(() => {
    if (origins.length === 0) {
      return null;
    }
    return origins[0];
  }, [origins]);

  const filteredOrigins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return origins;
    }
    return origins.filter((item) => item.region.toLowerCase().includes(q));
  }, [origins, searchQuery]);

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

  const maleWidthPercent =
    summary.total_active_students > 0
      ? Math.max(18, Math.min(82, Math.round(summary.male_percentage)))
      : 50;

  const pageMeta: Record<
    PublicNavKey,
    { title: string; subtitle: string; searchPlaceholder: string }
  > = {
    ikhtisar: {
      title: "Dashboard Statistik Kemahasiswaan",
      subtitle:
        "Ringkasan utama mahasiswa aktif, cakupan akademik, dan distribusi fakultas Universitas Cakrawala Nusantara.",
      searchPlaceholder: "Cari fakultas atau program studi...",
    },
    demografi: {
      title: "Demografi & Kelompok Usia Mahasiswa",
      subtitle:
        "Komposisi jenis kelamin dan sebaran kelompok usia mahasiswa aktif berdasarkan tanggal lahir.",
      searchPlaceholder: "Cari fakultas atau program studi...",
    },
    wilayah: {
      title: "Sebaran Wilayah Asal Mahasiswa",
      subtitle:
        "Distribusi kota, kabupaten, dan provinsi asal mahasiswa aktif Universitas Cakrawala Nusantara.",
      searchPlaceholder: "Cari kota, kabupaten, atau provinsi asal...",
    },
    fakultas: {
      title: "Fakultas & Program Studi",
      subtitle:
        "Grafik distribusi mahasiswa aktif dan katalog lengkap 9 fakultas serta 40 program studi (S1, D4, Profesi, S2, dan S3).",
      searchPlaceholder: "Cari nama fakultas, kode, atau program studi...",
    },
  };

  const currentMeta = pageMeta[section];

  return (
    <PublicShell
      current={section}
      headerAction={
        <>
          <button
            className="btn btn--secondary"
            disabled={refreshing}
            onClick={handleRefresh}
            title="Perbarui data statistik"
            type="button"
          >
            <Icon name="rotate-ccw" />
            {refreshing ? "Memperbarui..." : "Perbarui Statistik"}
          </button>
          {section !== "fakultas" ? (
            <Link className="btn btn--primary" href="/fakultas">
              <span>Jelajahi 40 Program Studi</span>
              <Icon name="arrow-up-right" />
            </Link>
          ) : (
            <Link className="btn btn--primary" href="/">
              <span>Kembali ke Ikhtisar</span>
            </Link>
          )}
        </>
      }
      onSearchChange={
        section === "fakultas" || section === "wilayah" ? setSearchQuery : undefined
      }
      searchPlaceholder={currentMeta.searchPlaceholder}
      searchValue={section === "fakultas" || section === "wilayah" ? searchQuery : undefined}
      subtitle={currentMeta.subtitle}
      title={currentMeta.title}
    >
      {/* =========================================================
          HALAMAN 1: IKHTISAR (/)
         ========================================================= */}
      {section === "ikhtisar" ? (
        <>
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
                  <span className="growth-split__capt">Laki-laki ({summary.male_count} mhs)</span>
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
                    <CountUp to={summary.total_origins ?? origins.length} />
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

          <section aria-label="Distribusi fakultas dan navigasi analitik" className="bento-grid">
            <FacultyDistributionChart
              className="col-7"
              faculties={faculties}
              onSelectFacultyCode={setSelectedFacultyCode}
              selectedFacultyCode={selectedFacultyCode}
              totalActiveStudents={summary.total_active_students}
            />

            <SpotlightCard className="col-5">
              <div className="bento-card__head">
                <div>
                  <h2 className="bento-card__title">Sorotan &amp; Navigasi Analitik</h2>
                  <p className="bento-card__sub">
                    Telusuri halaman statistik spesifik sesuai kategori data
                  </p>
                </div>
                <Icon className="icon" name="chart-column" />
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <Link
                  className="faculty-tile"
                  href="/demografi"
                  style={{ textDecoration: "none" }}
                >
                  <div className="faculty-tile__head">
                    <div>
                      <span className="badge badge--active">Demografi &amp; Usia</span>
                      <h3 className="faculty-tile__name" style={{ marginTop: "6px" }}>
                        Pie Chart Gender &amp; Kelompok Usia
                      </h3>
                    </div>
                    <Icon className="icon" name="arrow-up-right" />
                  </div>
                  <p className="muted" style={{ fontSize: "12.5px" }}>
                    {topAgeGroup
                      ? `Kelompok usia terbesar: ${topAgeGroup.range} (${topAgeGroup.count} mahasiswa · ${topAgeGroup.percentage}%)`
                      : "Lihat diagram lingkaran komposisi jenis kelamin dan rentang usia."}
                  </p>
                </Link>

                <Link className="faculty-tile" href="/wilayah" style={{ textDecoration: "none" }}>
                  <div className="faculty-tile__head">
                    <div>
                      <span className="badge badge--active">Sebaran Wilayah</span>
                      <h3 className="faculty-tile__name" style={{ marginTop: "6px" }}>
                        Top 10 Kota/Kabupaten Asal
                      </h3>
                    </div>
                    <Icon className="icon" name="arrow-up-right" />
                  </div>
                  <p className="muted" style={{ fontSize: "12.5px" }}>
                    {topOrigin
                      ? `Daerah asal tertinggi: ${topOrigin.region} (${topOrigin.count} mahasiswa · ${topOrigin.percentage}%)`
                      : "Lihat daftar lengkap wilayah asal mahasiswa aktif."}
                  </p>
                </Link>

                <Link
                  className="faculty-tile"
                  href="/fakultas"
                  style={{ textDecoration: "none" }}
                >
                  <div className="faculty-tile__head">
                    <div>
                      <span className="badge badge--active">Fakultas &amp; Prodi</span>
                      <h3 className="faculty-tile__name" style={{ marginTop: "6px" }}>
                        Katalog 9 Fakultas &amp; 40 Program Studi
                      </h3>
                    </div>
                    <Icon className="icon" name="arrow-up-right" />
                  </div>
                  <p className="muted" style={{ fontSize: "12.5px" }}>
                    {topFaculty
                      ? `Fakultas tertinggi: ${topFaculty.name} (${topFaculty.count} mahasiswa · ${topFaculty.percentage}%)`
                      : "Filter program studi berdasarkan jenjang S1, D4, Profesi, S2, dan S3."}
                  </p>
                </Link>
              </div>
            </SpotlightCard>
          </section>
        </>
      ) : null}

      {/* =========================================================
          HALAMAN 2: DEMOGRAFI & USIA (/demografi)
         ========================================================= */}
      {section === "demografi" ? (
        <>
          <div className="mini-stats-grid">
            <div
              className="mini-stat"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <span className="mini-stat__label">Mahasiswa Aktif</span>
              <div className="mini-stat__value">
                <CountUp to={summary.total_active_students} />
                <small> mhs</small>
              </div>
              <div className="mini-stat__foot">
                <span>Total populasi aktif</span>
              </div>
            </div>

            <div
              className="mini-stat"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <span className="mini-stat__label">Mahasiswa Laki-laki</span>
              <div className="mini-stat__value">
                <CountUp to={summary.male_count} />
                <small> ({summary.male_percentage}%)</small>
              </div>
              <div className="mini-stat__foot">
                <span>Proporsi laki-laki aktif</span>
              </div>
            </div>

            <div
              className="mini-stat"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <span className="mini-stat__label">Mahasiswa Perempuan</span>
              <div className="mini-stat__value">
                <CountUp to={summary.female_count} />
                <small> ({summary.female_percentage}%)</small>
              </div>
              <div className="mini-stat__foot">
                <span>Proporsi perempuan aktif</span>
              </div>
            </div>
          </div>

          <section
            aria-label="Grafik lingkaran jenis kelamin dan kelompok usia"
            className="bento-grid"
          >
            <SpotlightCard className="col-6">
              <div className="bento-card__head">
                <div>
                  <h2 className="bento-card__title">Komposisi Jenis Kelamin</h2>
                  <p className="bento-card__sub">
                    Perbandingan proporsi mahasiswa aktif laki-laki dan perempuan
                  </p>
                </div>
                <span className="badge badge--active">Pie Chart</span>
              </div>

              {summary.total_active_students === 0 ? (
                <EmptyState
                  description="Grafik jenis kelamin akan muncul saat data mahasiswa aktif tersedia."
                  icon="users"
                  title="Belum ada data jenis kelamin"
                />
              ) : (
                <PieChart
                  ariaLabel="Diagram lingkaran komposisi jenis kelamin mahasiswa aktif"
                  centerLabel="Mahasiswa Aktif"
                  centerValue={summary.total_active_students}
                  slices={genderSlices}
                />
              )}
            </SpotlightCard>

            <SpotlightCard className="col-6">
              <div className="bento-card__head">
                <div>
                  <h2 className="bento-card__title">Distribusi Kelompok Usia</h2>
                  <p className="bento-card__sub">
                    Proporsi rentang usia mahasiswa aktif berdasarkan tanggal lahir
                  </p>
                </div>
                <span className="badge badge--active">Pie Chart</span>
              </div>

              {summary.total_active_students === 0 ? (
                <EmptyState
                  description="Distribusi kelompok usia muncul ketika terdapat mahasiswa aktif."
                  icon="calendar"
                  title="Belum ada data usia"
                />
              ) : (
                <PieChart
                  ariaLabel="Diagram lingkaran distribusi kelompok usia mahasiswa aktif"
                  centerLabel="Rentang Usia"
                  centerValue={`${ages.filter((a) => a.count > 0).length} grup`}
                  slices={ageSlices}
                />
              )}
            </SpotlightCard>
          </section>

          <SpotlightCard>
            <div className="bento-card__head">
              <div>
                <h2 className="bento-card__title">Rincian Kelompok Usia Mahasiswa Aktif</h2>
                <p className="bento-card__sub">
                  Perbandingan jumlah dan persentase mahasiswa pada setiap rentang usia
                </p>
              </div>
              {topAgeGroup ? (
                <span className="chip-select">
                  <span className="status-dot" />
                  Dominan: {topAgeGroup.range} ({topAgeGroup.percentage}%)
                </span>
              ) : null}
            </div>

            <div className="bar-list">
              {ages.map((bucket) => (
                <div className="bar-row" key={bucket.range}>
                  <div className="bar-row__meta">
                    <span className="bar-row__name">{bucket.range}</span>
                    <span className="bar-row__val">
                      {bucket.count} mahasiswa ({bucket.percentage}%)
                    </span>
                  </div>
                  <div className="bar-row__track">
                    <div
                      className="bar-row__fill"
                      style={{
                        width: `${Math.max(bucket.count > 0 ? 6 : 0, bucket.percentage)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </>
      ) : null}

      {/* =========================================================
          HALAMAN 3: SEBARAN WILAYAH (/wilayah)
         ========================================================= */}
      {section === "wilayah" ? (
        <>
          <div className="mini-stats-grid">
            <div
              className="mini-stat"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <span className="mini-stat__label">Wilayah Asal Tercatat</span>
              <div className="mini-stat__value">
                <CountUp to={summary.total_origins ?? origins.length} />
                <small> daerah</small>
              </div>
              <div className="mini-stat__foot">
                <span>Kota/kabupaten &amp; provinsi</span>
              </div>
            </div>

            <div
              className="mini-stat"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <span className="mini-stat__label">Daerah Asal Tertinggi</span>
              <div className="mini-stat__value" style={{ fontSize: "22px" }}>
                {topOrigin ? topOrigin.region : "—"}
              </div>
              <div className="mini-stat__foot">
                <span className="trend-up">
                  {topOrigin ? `${topOrigin.count} mhs (${topOrigin.percentage}%)` : "0 mhs"}
                </span>
                <span>kontribusi terbesar</span>
              </div>
            </div>

            <div
              className="mini-stat"
              style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            >
              <span className="mini-stat__label">Total Mahasiswa Aktif</span>
              <div className="mini-stat__value">
                <CountUp to={summary.total_active_students} />
                <small> mhs</small>
              </div>
              <div className="mini-stat__foot">
                <span>Basis perhitungan wilayah</span>
              </div>
            </div>
          </div>

          <section aria-label="Visualisasi asal daerah mahasiswa" className="bento-grid">
            <SpotlightCard className="col-7">
              <div className="bento-card__head">
                <div>
                  <h2 className="bento-card__title">Sebaran Asal Daerah (Top 10)</h2>
                  <p className="bento-card__sub">
                    Kota/kabupaten &amp; provinsi asal mahasiswa aktif
                  </p>
                </div>
                <span className="chip-select">
                  <Icon className="icon" name="map-pin" />
                  {filteredOrigins.length} daerah
                </span>
              </div>

              {filteredOrigins.length === 0 ? (
                <EmptyState
                  description="Tidak ada wilayah asal yang cocok dengan kata kunci pencarian."
                  icon="map-pin"
                  title="Data wilayah tidak ditemukan"
                />
              ) : (
                <div className="bar-list">
                  {filteredOrigins.map((origin) => (
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

            <SpotlightCard className="col-5">
              <div className="bento-card__head">
                <div>
                  <h2 className="bento-card__title">Komposisi Wilayah Dominan</h2>
                  <p className="bento-card__sub">
                    Perbandingan 5 daerah asal terbesar terhadap wilayah lainnya
                  </p>
                </div>
                <span className="badge badge--active">Pie Chart</span>
              </div>

              {originSlices.length === 0 ? (
                <EmptyState
                  description="Diagram wilayah akan tampil ketika terdapat mahasiswa aktif."
                  icon="map-pin"
                  title="Belum ada data wilayah"
                />
              ) : (
                <PieChart
                  ariaLabel="Diagram lingkaran komposisi daerah asal mahasiswa aktif"
                  centerLabel="Total Aktif"
                  centerValue={summary.total_active_students}
                  slices={originSlices}
                />
              )}
            </SpotlightCard>
          </section>
        </>
      ) : null}

      {/* =========================================================
          HALAMAN 4: FAKULTAS & PRODI (/fakultas)
         ========================================================= */}
      {section === "fakultas" ? (
        <>
          <div id="grafik-fakultas">
            <FacultyDistributionChart
              faculties={faculties}
              onSelectFacultyCode={setSelectedFacultyCode}
              selectedFacultyCode={selectedFacultyCode}
              totalActiveStudents={summary.total_active_students}
            />
          </div>

          <SpotlightCard id="katalog-fakultas">
            <div className="filter-bar">
              <div>
                <h2 className="bento-card__title">Katalog 9 Fakultas &amp; 40 Program Studi</h2>
                <p className="bento-card__sub">
                  Daftar Fakultas, Program Sarjana (S1), Sarjana Terapan (D4), Profesi, Magister
                  (S2), dan Doktor (S3)
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
              {filteredCatalogFaculties.map((faculty) => {
                const isSelected = selectedFacultyCode === faculty.code;
                return (
                  <article
                    className="faculty-tile"
                    key={faculty.id}
                    style={
                      isSelected
                        ? {
                            borderColor: "var(--accent)",
                            boxShadow: "0 0 0 2px rgba(22, 163, 74, 0.14)",
                          }
                        : undefined
                    }
                  >
                    <div className="faculty-tile__head">
                      <div>
                        <span className="badge badge--degree">{faculty.code}</span>
                        <h3 className="faculty-tile__name" style={{ marginTop: "6px" }}>
                          {faculty.name}
                        </h3>
                      </div>
                      <button
                        className={`btn ${isSelected ? "btn--primary" : "btn--secondary"} btn--sm`}
                        onClick={() => {
                          setSelectedFacultyCode(isSelected ? "ALL" : faculty.code);
                          document
                            .getElementById("grafik-fakultas")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        type="button"
                      >
                        {isSelected ? "Sedang Ditampilkan" : `${faculty.count ?? 0} aktif · Grafik`}
                      </button>
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
                );
              })}
            </div>
          </SpotlightCard>
        </>
      ) : null}
    </PublicShell>
  );
}
