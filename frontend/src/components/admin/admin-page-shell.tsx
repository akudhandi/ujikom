import Link from "next/link";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { Icon } from "@/components/ui/icon";

type AdminPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AdminPageShell({
  title,
  description,
  children,
  action,
  backHref,
  backLabel = "Kembali",
}: AdminPageShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f8f5] text-slate-950">
      <SiteHeader admin />
      <main className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-7xl">
          {backHref ? (
            <Link className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-teal-700" href={backHref}>
              <Icon className="size-4" name="chevron-left" />
              {backLabel}
            </Link>
          ) : null}
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-teal-700">Administrasi</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{title}</h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">{description}</p>
            </div>
            {action}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
