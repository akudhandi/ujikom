import type { ReactNode, SVGProps } from "react";

// Ikon nyata dari set Lucide (assets/icons skill design-taste-frontend), bukan gambar tangan.
export type IconName =
  | "search"
  | "plus"
  | "users"
  | "graduation-cap"
  | "pencil"
  | "chevron-left"
  | "arrow-right"
  | "book-open"
  | "circle-check"
  | "house"
  | "chart-column"
  | "lock"
  | "layout-dashboard"
  | "table"
  | "log-out"
  | "menu"
  | "mail"
  | "circle-alert"
  | "user-check";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
};

const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <path d="m21 21-4.34-4.34" />
      <circle cx="11" cy="11" r="8" />
    </>
  ),
  plus: <path d="M5 12h14M12 5v14" />,
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  "graduation-cap": (
    <>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0zM22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </>
  ),
  pencil: (
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4" />
  ),
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "arrow-right": <path d="M5 12h14m-7-7 7 7-7 7" />,
  "book-open": (
    <path d="M12 7v14m-9-3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  ),
  "circle-check": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  house: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  "chart-column": <path d="M3 3v16a2 2 0 0 0 2 2h16m-3-4V9m-5 8V5M8 17v-3" />,
  lock: (
    <>
      <circle cx="12" cy="16" r="1" />
      <rect height="12" rx="2" width="18" x="3" y="10" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </>
  ),
  "layout-dashboard": (
    <>
      <rect height="9" rx="1" width="7" x="3" y="3" />
      <rect height="5" rx="1" width="7" x="14" y="3" />
      <rect height="9" rx="1" width="7" x="14" y="12" />
      <rect height="5" rx="1" width="7" x="3" y="16" />
    </>
  ),
  table: (
    <>
      <path d="M12 3v18" />
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M3 9h18M3 15h18" />
    </>
  ),
  "log-out": <path d="m16 17 5-5-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />,
  menu: <path d="M4 5h16M4 12h16M4 19h16" />,
  mail: (
    <>
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  "circle-alert": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  "user-check": (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </>
  ),
};

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className ?? "icon"}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
