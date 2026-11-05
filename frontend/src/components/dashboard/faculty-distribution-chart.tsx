"use client";

import { useMemo } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { FacultyItem } from "@/types/dashboard";

type FacultyDistributionChartProps = {
  faculties: FacultyItem[];
  totalActiveStudents: number;
  selectedFacultyCode: string;
  onSelectFacultyCode: (code: string) => void;
  className?: string;
};

function formatShortProgramAxisLabel(degree: string, name: string): string {
  const cleaned = name
    .replace(/^S2\s*\(Magister\)\s*/i, "")
    .replace(/^S3\s*\(Doktor\)\s*/i, "")
    .replace(/^Administrasi Negara\s*\(([^)]+)\)/i, "$1")
    .replace(/^Desain Komunikasi Visual\s*\(([^)]+)\)/i, "$1")
    .replace(/^Teknik\s+/i, "T. ")
    .replace(/^Teknologi\s+/i, "Tek. ")
    .replace(/^Pendidikan\s+/i, "Pend. ")
    .replace(/^Administrasi\s+/i, "Adm. ")
    .replace(/^Ilmu\s+/i, "")
    .replace(/^Bahasa\s+/i, "Bhs. ")
    .replace(/^Hubungan Internasional/i, "HI")
    .replace(/^Ekonomi Pembangunan/i, "Ek. Pemb.")
    .replace(/^Rekayasa Perangkat Lunak/i, "RPL")
    .replace(/^Sistem Informasi/i, "Sist. Info")
    .replace(/^Sains Data/i, "Sains Data")
    .trim();

  const prefix = degree === "S2" || degree === "S3" || degree === "D4" ? `${degree} ` : "";
  const combined = `${prefix}${cleaned}`;
  return combined.length > 13 ? `${combined.slice(0, 12)}…` : combined;
}

export function FacultyDistributionChart({
  faculties,
  totalActiveStudents,
  selectedFacultyCode,
  onSelectFacultyCode,
  className = "",
}: FacultyDistributionChartProps) {
  const selectedFaculty = useMemo(
    () =>
      selectedFacultyCode === "ALL"
        ? null
        : (faculties.find((item) => item.code === selectedFacultyCode) ?? null),
    [faculties, selectedFacultyCode],
  );

  // Titik data grafik kurva mengikuti filter fakultas (Semua Fakultas vs Prodi dalam Fakultas terpilih)
  const chartItems = useMemo(() => {
    if (!selectedFaculty) {
      return faculties.map((fac) => ({
        id: `fac-${fac.id}`,
        code: fac.code === "PASCASARJANA" ? "PASCA" : fac.code,
        fullName: fac.name,
        badge: fac.code,
        count: fac.count ?? 0,
        percentageOfView: fac.percentage ?? 0,
        percentageOfTotal: fac.percentage ?? 0,
        clickableCode: fac.code,
      }));
    }

    const facultyTotal = selectedFaculty.count ?? 0;
    return selectedFaculty.study_programs.map((prog) => {
      const count = prog.count ?? 0;
      const pctFaculty =
        facultyTotal > 0 ? Math.round((count / facultyTotal) * 1000) / 10 : 0;
      return {
        id: `prog-${prog.id}`,
        code: formatShortProgramAxisLabel(prog.degree, prog.name),
        fullName: prog.name,
        badge: prog.degree,
        count,
        percentageOfView: pctFaculty,
        percentageOfTotal: prog.percentage ?? 0,
        clickableCode: null as string | null,
      };
    });
  }, [faculties, selectedFaculty]);

  const topItem = useMemo(() => {
    if (chartItems.length === 0) {
      return null;
    }
    return [...chartItems].sort((a, b) => b.count - a.count)[0];
  }, [chartItems]);

  const curvePoints = useMemo(() => {
    if (chartItems.length === 0) {
      return [];
    }
    const maxCount = Math.max(...chartItems.map((item) => item.count), 1);
    const width = 560;
    const height = 148;
    const padX = 34;
    const padTop = 28;
    const padBottom = 26;
    const usableW = width - padX * 2;
    const usableH = height - padTop - padBottom;

    return chartItems.map((item, idx) => {
      const x =
        padX +
        (chartItems.length > 1 ? (idx / (chartItems.length - 1)) * usableW : usableW / 2);
      const ratio = item.count / maxCount;
      const y = padTop + usableH - ratio * usableH;
      return {
        ...item,
        x: Math.round(x),
        y: Math.round(y),
        baselineY: padTop + usableH,
      };
    });
  }, [chartItems]);

  const svgPath = useMemo(() => {
    if (curvePoints.length === 0) {
      return { line: "", area: "" };
    }
    const baselineY = curvePoints[0].baselineY;

    if (curvePoints.length === 1) {
      const pt = curvePoints[0];
      const line = `M 34 ${pt.y} L 526 ${pt.y}`;
      const area = `${line} L 526 ${baselineY} L 34 ${baselineY} Z`;
      return { line, area };
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
    const area = `${d} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
    return { line: d, area };
  }, [curvePoints]);

  return (
    <SpotlightCard className={className}>
      <div className="bento-card__head">
        <div>
          <h2 className="bento-card__title">
            {selectedFaculty
              ? `Distribusi Program Studi — ${selectedFaculty.name}`
              : "Distribusi Fakultas & Program Studi"}
          </h2>
          <p className="bento-card__sub">
            {selectedFaculty
              ? `Sebaran ${selectedFaculty.count ?? 0} mahasiswa aktif pada ${selectedFaculty.study_programs.length} program studi di ${selectedFaculty.code}`
              : "Sebaran mahasiswa aktif pada 9 fakultas dan 40 program studi"}
          </p>
        </div>

        <div className="circle-actions" style={{ flexWrap: "wrap" }}>
          {selectedFaculty ? (
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => onSelectFacultyCode("ALL")}
              type="button"
            >
              <Icon name="chevron-left" />
              Semua Fakultas
            </button>
          ) : null}

          <label className="sr-only" htmlFor="faculty-filter-select">
            Pilih fakultas
          </label>
          <select
            className="chip-select"
            id="faculty-filter-select"
            onChange={(e) => onSelectFacultyCode(e.target.value)}
            value={selectedFacultyCode}
          >
            <option value="ALL">Semua Fakultas (9)</option>
            {faculties.map((fac) => (
              <option key={fac.id} value={fac.code}>
                {fac.name} ({fac.count ?? 0} mhs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {totalActiveStudents === 0 ? (
        <EmptyState
          description="Grafik fakultas dan program studi akan muncul saat terdapat mahasiswa aktif."
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
              {topItem ? (
                <span className="curve-callout">
                  <span className="status-dot" />
                  {selectedFaculty ? (
                    <>
                      Prodi Tertinggi: <b>{topItem.fullName}</b> ({topItem.count} mhs ·{" "}
                      {topItem.percentageOfView}% dari {selectedFaculty.code})
                    </>
                  ) : (
                    <>
                      Tertinggi: <b>{topItem.badge}</b> ({topItem.count} mahasiswa ·{" "}
                      {topItem.percentageOfTotal}%)
                    </>
                  )}
                </span>
              ) : null}

              <span className="muted" style={{ fontSize: "12px" }}>
                {selectedFaculty
                  ? `Menampilkan grafik ${selectedFaculty.study_programs.length} prodi pada ${selectedFaculty.code}`
                  : "Klik baris fakultas atau pilih dropdown untuk melihat grafik per prodi"}
              </span>
            </div>

            <svg
              aria-label={
                selectedFaculty
                  ? `Grafik perbandingan mahasiswa aktif antar program studi di ${selectedFaculty.name}`
                  : "Grafik perbandingan jumlah mahasiswa aktif antar fakultas"
              }
              role="img"
              style={{ width: "100%", height: "160px", display: "block" }}
              viewBox="0 0 560 160"
            >
              <defs>
                <linearGradient id="emeraldAreaGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line stroke="var(--line)" strokeDasharray="4 4" x1="34" x2="526" y1="36" y2="36" />
              <line stroke="var(--line)" strokeDasharray="4 4" x1="34" x2="526" y1="79" y2="79" />
              <line stroke="var(--line-strong)" x1="34" x2="526" y1="122" y2="122" />

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
                <g
                  key={pt.id}
                  onClick={() => {
                    if (pt.clickableCode) {
                      onSelectFacultyCode(pt.clickableCode);
                    }
                  }}
                  style={{ cursor: pt.clickableCode ? "pointer" : "default" }}
                >
                  <title>{`${pt.fullName}: ${pt.count} mahasiswa (${pt.percentageOfView}%)`}</title>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    fill="var(--surface)"
                    r="5"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  />
                  <text
                    fill="var(--ink)"
                    fontFamily="var(--font-mono)"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                    x={pt.x}
                    y={Math.max(14, pt.y - 9)}
                  >
                    {pt.count}
                  </text>
                  <text
                    fill="var(--muted)"
                    fontFamily="var(--font-mono)"
                    fontSize={curvePoints.length > 7 ? "8.5" : "9.5"}
                    textAnchor="middle"
                    x={pt.x}
                    y="144"
                  >
                    {pt.code}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="bar-list">
            {chartItems.map((item) => (
              <div
                className="bar-row"
                key={item.id}
                onClick={() => {
                  if (item.clickableCode) {
                    onSelectFacultyCode(item.clickableCode);
                  }
                }}
                role={item.clickableCode ? "button" : undefined}
                style={{
                  cursor: item.clickableCode ? "pointer" : "default",
                }}
                tabIndex={item.clickableCode ? 0 : undefined}
                onKeyDown={(e) => {
                  if (item.clickableCode && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onSelectFacultyCode(item.clickableCode);
                  }
                }}
              >
                <div className="bar-row__meta">
                  <span className="bar-row__name">
                    <span
                      className="badge badge--degree"
                      style={{ marginRight: "8px", height: "22px", padding: "0 8px" }}
                    >
                      {item.badge}
                    </span>
                    {item.fullName}
                  </span>
                  <span className="bar-row__val">
                    {selectedFaculty
                      ? `${item.count} mhs (${item.percentageOfView}% fakultas · ${item.percentageOfTotal}% total)`
                      : `${item.count} mhs (${item.percentageOfTotal}%)`}
                  </span>
                </div>
                <div className="bar-row__track">
                  <div
                    className="bar-row__fill"
                    style={{
                      width: `${Math.max(item.count > 0 ? 5 : 0, item.percentageOfView)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SpotlightCard>
  );
}
