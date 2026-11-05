"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
};

function formatNumber(value: number, decimals: number, separator: string): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = separator ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : intPart;
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}

export function CountUp({
  to,
  from = 0,
  duration = 950,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ".",
  className,
}: CountUpProps) {
  const [display, setDisplay] = useState<string>(() => `${prefix}${formatNumber(to, decimals, separator)}${suffix}`);
  const prevToRef = useRef<number>(from);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const startVal = prevToRef.current;
    prevToRef.current = to;

    if (prefersReducedMotion || startVal === to || duration <= 0) {
      const immediate = window.requestAnimationFrame(() => {
        setDisplay(`${prefix}${formatNumber(to, decimals, separator)}${suffix}`);
      });
      return () => window.cancelAnimationFrame(immediate);
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, Math.max(0, elapsed / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startVal + (to - startVal) * eased;
      setDisplay(`${prefix}${formatNumber(current, decimals, separator)}${suffix}`);

      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        setDisplay(`${prefix}${formatNumber(to, decimals, separator)}${suffix}`);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [to, duration, decimals, prefix, suffix, separator]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </span>
  );
}
