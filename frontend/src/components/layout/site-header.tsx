import Link from "next/link";

import { Icon } from "@/components/ui/icon";

type SiteHeaderProps = {
  admin?: boolean;
  current?: "dashboard" | "students";
};

export function SiteHeader({ admin = false, current }: SiteHeaderProps) {
  return (
    <header className="nav">
      <div className="nav__bar wrap">
        <Link className="nav__logo" href="/">
          <span aria-hidden="true" className="nav__mark">
            <Icon className="icon--lg" name="graduation-cap" />
          </span>
          <span className="nav__name">
            <b>Data Mahasiswa</b>
            <span>Universitas Cakrawala Nusantara</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="nav__links">
          <Link
            aria-current={current === "dashboard" ? "page" : undefined}
            className="nav__link"
            href="/"
          >
            Dashboard
          </Link>
          {admin ? (
            <Link
              aria-current={current === "students" ? "page" : undefined}
              className="nav__link"
              href="/admin/students"
            >
              Data mahasiswa
            </Link>
          ) : null}
        </nav>

        <div className="nav__actions">
          {admin ? (
            <>
              <Link className="btn btn--secondary" href="/">
                <Icon name="house" /> Dashboard publik
              </Link>
              <Link className="btn btn--primary" href="/admin/students/create">
                <Icon name="plus" /> Tambah mahasiswa
              </Link>
            </>
          ) : (
            <Link className="btn btn--primary" href="/admin/login">
              <Icon name="lock" /> Masuk admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
