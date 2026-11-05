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
  current?: "dashboard" | "students";
};

export function AdminPageShell({
  title,
  description,
  children,
  action,
  backHref,
  backLabel = "Kembali",
  current = "students",
}: AdminPageShellProps) {
  return (
    <>
      <SiteHeader admin current={current} />
      <main>
        <section className="section">
          <div className="wrap">
            {backHref ? (
              <Link className="breadcrumb" href={backHref}>
                <Icon name="chevron-left" />
                {backLabel}
              </Link>
            ) : null}
            <div className={`page-head${backHref ? " mt" : ""}`}>
              <div className="page-head__text">
                <span className="eyebrow">Administrasi</span>
                <h1>{title}</h1>
                <p>{description}</p>
              </div>
              {action}
            </div>
            {children}
          </div>
        </section>
      </main>
    </>
  );
}
