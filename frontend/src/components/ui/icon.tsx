import type { ReactNode, SVGProps } from "react";

type IconName =
  | "arrow-right"
  | "bar-chart"
  | "book-open"
  | "check-circle"
  | "chevron-left"
  | "edit"
  | "graduation-cap"
  | "home"
  | "plus"
  | "search"
  | "users";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const paths: Record<IconName, ReactNode> = {
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  "bar-chart": <path d="M4 19V5m0 14h16M8 16v-5m4 5V7m4 9v-3" />,
  "book-open": <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H10v16H5.5A2.5 2.5 0 0 0 3 21.5v-16ZM21 5.5A2.5 2.5 0 0 0 18.5 3H14v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />,
  "check-circle": <><circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  edit: <><path d="M12 20h8" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" /></>,
  "graduation-cap": <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M7 11.2V16c2.7 2.7 7.3 2.7 10 0v-4.8" /><path d="M21 9v6" /></>,
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4" /></>,
  users: <><path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20" /><circle cx="10" cy="7" r="3" /><path d="M16 10a3 3 0 1 0-1.5-5.6M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" /></>,
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
