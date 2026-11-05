"use client";

import { useState } from "react";

export type PieChartSlice = {
  key: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
};

type PieChartProps = {
  slices: PieChartSlice[];
  centerValue?: string | number;
  centerLabel?: string;
  size?: number;
  strokeWidth?: number;
  ariaLabel: string;
};

export function PieChart({
  slices,
  centerValue,
  centerLabel = "Total",
  size = 188,
  strokeWidth = 28,
  ariaLabel,
}: PieChartProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const total = slices.reduce((acc, item) => acc + item.count, 0);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const activeSlice = slices.find((s) => s.key === hoveredKey) ?? null;

  // Hitung offset tiap segmen lingkaran
  const segments = slices.reduce<
    Array<
      PieChartSlice & {
        dashArray: string;
        dashOffset: number;
      }
    >
  >((acc, slice) => {
    const prevSum = acc.reduce((sum, item) => sum + item.count, 0);
    const ratio = total > 0 ? slice.count / total : 0;
    const length = ratio * circumference;
    const prevLength = total > 0 ? (prevSum / total) * circumference : 0;

    acc.push({
      ...slice,
      dashArray: `${Math.max(0, length - (slices.filter((s) => s.count > 0).length > 1 ? 2.5 : 0))} ${circumference}`,
      dashOffset: -prevLength,
    });
    return acc;
  }, []);

  return (
    <div className="pie-widget">
      <div className="pie-widget__chart" style={{ width: size, height: size }}>
        <svg
          aria-label={ariaLabel}
          height={size}
          role="img"
          viewBox={`0 0 ${size} ${size}`}
          width={size}
        >
          <circle
            cx={center}
            cy={center}
            fill="none"
            r={radius}
            stroke="var(--surface-hover)"
            strokeWidth={strokeWidth}
          />
          <g transform={`rotate(-90 ${center} ${center})`}>
            {segments.map((seg) => {
              if (seg.count <= 0) {
                return null;
              }
              const isHovered = hoveredKey === seg.key;
              return (
                <circle
                  cx={center}
                  cy={center}
                  fill="none"
                  key={seg.key}
                  onMouseEnter={() => setHoveredKey(seg.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  r={radius}
                  stroke={seg.color}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="butt"
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  style={{
                    cursor: "pointer",
                    transition:
                      "stroke-width 180ms ease, stroke-dasharray 420ms ease, opacity 180ms ease",
                    opacity: hoveredKey && !isHovered ? 0.65 : 1,
                  }}
                />
              );
            })}
          </g>
        </svg>

        <div className="pie-widget__center">
          <b className="pie-widget__center-val">
            {activeSlice ? `${activeSlice.percentage}%` : (centerValue ?? total)}
          </b>
          <span className="pie-widget__center-lbl">
            {activeSlice ? activeSlice.label : centerLabel}
          </span>
        </div>
      </div>

      <ul className="pie-legend">
        {slices.map((slice) => {
          const isHovered = hoveredKey === slice.key;
          return (
            <li
              className={`pie-legend__item${isHovered ? " is-active" : ""}`}
              key={slice.key}
              onMouseEnter={() => setHoveredKey(slice.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <span className="pie-legend__left">
                <span
                  aria-hidden="true"
                  className="pie-legend__dot"
                  style={{ background: slice.color }}
                />
                <span className="pie-legend__name">{slice.label}</span>
              </span>
              <span className="pie-legend__val">
                <b>{slice.count}</b> mhs ({slice.percentage}%)
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
