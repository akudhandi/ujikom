"use client";

import type { HTMLAttributes, PointerEvent } from "react";
import { useRef } from "react";

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
};

/**
 * ReactBits-inspired SpotlightCard dengan highlight halus mengikuti kursor.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(22, 163, 74, 0.08)",
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
    el.style.setProperty("--spot-color", spotlightColor);
  };

  return (
    <div
      className={`bento-card spotlight-surface ${className}`.trim()}
      onPointerMove={handlePointerMove}
      ref={cardRef}
      {...props}
    >
      {children}
    </div>
  );
}
