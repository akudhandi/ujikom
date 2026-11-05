"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { fetchCurrentAdmin, getStoredUser, logoutAdmin } from "@/lib/api";
import type { AuthUser } from "@/types/dashboard";

export type PublicNavKey = "ikhtisar" | "demografi" | "wilayah" | "fakultas";
type NavKey = "dashboard" | "demografi" | "fakultas" | "students" | "create";

type PublicShellProps = {
  current?: PublicNavKey;
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children: ReactNode;
};

type AppShellProps = {
  current?: NavKey;
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  backHref?: string;
  backLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children: ReactNode;
};

/**
 * Layout Khusus Pengunjung / Guest (Top Navbar Multi-Halaman tanpa Sidebar Admin)
 */
export function PublicShell({
  current,
  title,
  subtitle,
  headerAction,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari fakultas atau program studi...",
  children,
}: PublicShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
  const [internalSearch, setInternalSearch] = useState(searchValue ?? "");

  const activeNav: PublicNavKey =
    current ??
    (pathname.startsWith("/demografi")
      ? "demografi"
      : pathname.startsWith("/wilayah")
        ? "wilayah"
        : pathname.startsWith("/fakultas")
          ? "fakultas"
          : "ikhtisar");

  useEffect(() => {
    let active = true;
    const cached = getStoredUser();
    if (cached) {
      Promise.resolve().then(() => {
        if (active) {
          setAdminUser(cached);
        }
      });
    }
    fetchCurrentAdmin().then((user) => {
      if (active) {
        setAdminUser(user);
      }
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  const controlledQuery = onSearchChange ? (searchValue ?? "") : internalSearch;

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = controlledQuery.trim();
    if (onSearchChange) {
      onSearchChange(query);
      return;
    }
    router.push(query ? `/fakultas?q=${encodeURIComponent(query)}` : "/fakultas");
  };

  return (
    <div className="public-frame">
      <div className="public-container">
        <header className="public-navbar">
          <Link className="sidebar__logo" href="/">
            <span aria-hidden="true" className="sidebar__mark">
              <Icon className="icon" name="graduation-cap" />
            </span>
            <span className="sidebar__title">
              <b>UCN Hub</b>
              <span>Universitas Cakrawala Nusantara</span>
            </span>
          </Link>

          <nav aria-label="Navigasi Statistik Publik" className="public-navbar__links">
            <Link
              className={`public-navbar__link${activeNav === "ikhtisar" ? " is-active" : ""}`}
              href="/"
              prefetch={false}
            >
              Ikhtisar
            </Link>
            <Link
              className={`public-navbar__link${activeNav === "demografi" ? " is-active" : ""}`}
              href="/demografi"
              prefetch={false}
            >
              Demografi &amp; Usia
            </Link>
            <Link
              className={`public-navbar__link${activeNav === "wilayah" ? " is-active" : ""}`}
              href="/wilayah"
              prefetch={false}
            >
              Sebaran Wilayah
            </Link>
            <Link
              className={`public-navbar__link${activeNav === "fakultas" ? " is-active" : ""}`}
              href="/fakultas"
              prefetch={false}
            >
              Fakultas &amp; Prodi
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <form
              className="topbar__search"
              onSubmit={handleSearchSubmit}
              role="search"
              style={{ width: "240px" }}
            >
              <Icon name="search" />
              <input
                aria-label={searchPlaceholder}
                onChange={(e) => {
                  const next = e.target.value;
                  if (onSearchChange) {
                    onSearchChange(next);
                  } else {
                    setInternalSearch(next);
                  }
                }}
                placeholder={searchPlaceholder}
                style={{ height: "38px" }}
                type="search"
                value={controlledQuery}
              />
            </form>

            <ThemeToggle />

            {adminUser ? (
              <Link className="btn btn--primary btn--sm" href="/admin/students">
                <Icon name="layout-dashboard" />
                Workspace Admin
              </Link>
            ) : (
              <Link className="btn btn--secondary btn--sm" href="/admin/login">
                <Icon name="lock" />
                Portal Admin
              </Link>
            )}
          </div>
        </header>

        <main className="public-workspace">
          <div className="hero-bar">
            <div className="hero-bar__title">
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {headerAction ? <div className="btn-row">{headerAction}</div> : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

/**
 * Layout Khusus Workspace Administrasi (Sidebar SkillHub)
 */
export function AppShell({
  current = "students",
  title,
  subtitle,
  headerAction,
  backHref,
  backLabel = "Kembali",
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari nama mahasiswa, NPM, asal daerah, atau prodi...",
  children,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState(searchValue ?? "");
  const [adminUser, setAdminUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    const cached = getStoredUser();
    if (cached) {
      Promise.resolve().then(() => {
        if (active) {
          setAdminUser(cached);
        }
      });
    }
    fetchCurrentAdmin().then((user) => {
      if (active) {
        setAdminUser(user);
      }
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = (onSearchChange ? (searchValue ?? "") : internalSearch).trim();
    if (onSearchChange) {
      onSearchChange(query);
      return;
    }
    router.push(query ? `/admin/students?search=${encodeURIComponent(query)}` : "/admin/students");
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAdmin();
      setAdminUser(null);
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  const controlledQuery = onSearchChange ? (searchValue ?? "") : internalSearch;

  return (
    <div className="app-frame">
      {sidebarOpen ? (
        <div
          aria-hidden="true"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside aria-label="Navigasi Workspace Admin" className={`sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <Link className="sidebar__logo" href="/admin/students">
              <span aria-hidden="true" className="sidebar__mark">
                <Icon className="icon" name="graduation-cap" />
              </span>
              <span className="sidebar__title">
                <b>UCN Admin</b>
                <span>Portal Kemahasiswaan</span>
              </span>
            </Link>
            <span aria-hidden="true" className="sidebar__collapse-badge" title="Menu Administrasi">
              <Icon className="icon" name="panel-left" />
            </span>
          </div>

          <nav aria-label="Manajemen Mahasiswa" className="sidebar__group">
            <span className="sidebar__group-label">Manajemen Data</span>
            <Link
              className={`sidebar__item${current === "students" ? " is-active" : ""}`}
              href="/admin/students"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__item-left">
                <Icon name="users" />
                <span>Data Mahasiswa</span>
              </span>
            </Link>
            <Link
              className={`sidebar__item${current === "create" ? " is-active" : ""}`}
              href="/admin/students/create"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__item-left">
                <Icon name="plus" />
                <span>Tambah Mahasiswa</span>
              </span>
            </Link>
          </nav>

          <nav aria-label="Pintasan & Akun" className="sidebar__group">
            <span className="sidebar__group-label">Pintasan</span>
            <Link
              className="sidebar__item"
              href="/"
              onClick={() => setSidebarOpen(false)}
              prefetch={false}
            >
              <span className="sidebar__item-left">
                <Icon name="chart-column" />
                <span>Dashboard Publik</span>
              </span>
              <Icon className="icon" name="arrow-up-right" />
            </Link>

            <button
              className="sidebar__item"
              disabled={loggingOut}
              onClick={handleLogout}
              type="button"
            >
              <span className="sidebar__item-left">
                <Icon name="log-out" />
                <span>{loggingOut ? "Keluar..." : "Keluar Sesi"}</span>
              </span>
            </button>
          </nav>
        </div>

        <div className="sidebar__bottom">
          <div className="sidebar__status">
            <span className="status-dot" />
            <div>
              <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: "12.5px" }}>
                Universitas Cakrawala Nusantara
              </div>
              <div style={{ fontSize: "11.5px", color: "var(--muted)" }}>
                9 Fakultas · 40 Program Studi
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="workspace-outer">
        <div className="workspace">
          <header className="topbar">
            <div className="topbar__left">
              <button
                aria-label="Buka menu navigasi"
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                <Icon name="menu" />
              </button>

              <form className="topbar__search" onSubmit={handleSearchSubmit} role="search">
                <Icon name="search" />
                <input
                  aria-label={searchPlaceholder}
                  onChange={(event) => {
                    const next = event.target.value;
                    if (onSearchChange) {
                      onSearchChange(next);
                    } else {
                      setInternalSearch(next);
                    }
                  }}
                  placeholder={searchPlaceholder}
                  type="search"
                  value={controlledQuery}
                />
              </form>
            </div>

            <div className="topbar__right">
              <div className="topbar__cluster">
                <ThemeToggle />
                <Link
                  aria-label="Lihat Dashboard Publik"
                  className="topbar__icon-btn"
                  href="/"
                  prefetch={false}
                  title="Dashboard Publik"
                >
                  <Icon name="house" />
                </Link>
                {adminUser ? (
                  <div className="topbar__user">
                    <div className="topbar__user-info">
                      <b>{adminUser.name}</b>
                      <span>@{adminUser.username}</span>
                    </div>
                    <span className="avatar avatar--accent" title={adminUser.email}>
                      {adminUser.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          {backHref ? (
            <div>
              <Link
                className="btn btn--secondary btn--sm"
                href={backHref}
                style={{ display: "inline-flex" }}
              >
                <Icon name="chevron-left" />
                {backLabel}
              </Link>
            </div>
          ) : null}

          <div className="hero-bar">
            <div className="hero-bar__title">
              <h1>{title}</h1>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {headerAction ? <div className="btn-row">{headerAction}</div> : null}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  return null;
}
