"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { fetchCurrentAdmin, getStoredUser, logoutAdmin } from "@/lib/api";
import type { AuthUser } from "@/types/dashboard";

type NavKey = "dashboard" | "demografi" | "fakultas" | "students" | "create";

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
  apiConnected?: boolean;
  children: ReactNode;
};

export function AppShell({
  current = "dashboard",
  title,
  subtitle,
  headerAction,
  backHref,
  backLabel = "Kembali",
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari nama mahasiswa, NPM, asal daerah, atau prodi...",
  apiConnected = true,
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
    const query = (onSearchChange ? searchValue ?? "" : internalSearch).trim();
    if (onSearchChange) {
      onSearchChange(query);
      return;
    }
    if (adminUser) {
      router.push(query ? `/admin/students?search=${encodeURIComponent(query)}` : "/admin/students");
    } else {
      const target = document.getElementById("katalog-fakultas");
      target?.scrollIntoView({ behavior: "smooth" });
    }
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

      <aside aria-label="Navigasi samping" className={`sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <Link className="sidebar__logo" href="/">
              <span aria-hidden="true" className="sidebar__mark">
                <Icon className="icon" name="graduation-cap" />
              </span>
              <span className="sidebar__title">
                <b>UCN Hub</b>
                <span>Data Mahasiswa</span>
              </span>
            </Link>
            <span aria-hidden="true" className="sidebar__collapse-badge" title="Workspace Navigasi">
              <Icon className="icon" name="panel-left" />
            </span>
          </div>

          <nav aria-label="Menu Utama" className="sidebar__group">
            <span className="sidebar__group-label">Menu Utama</span>
            <Link
              className={`sidebar__item${current === "dashboard" ? " is-active" : ""}`}
              href="/"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__item-left">
                <Icon name="layout-dashboard" />
                <span>Dashboard</span>
              </span>
            </Link>
            <Link
              className={`sidebar__item${current === "demografi" ? " is-active" : ""}`}
              href="/#analitik-demografi"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__item-left">
                <Icon name="chart-column" />
                <span>Analitik Demografi</span>
              </span>
            </Link>
            <Link
              className={`sidebar__item${current === "fakultas" ? " is-active" : ""}`}
              href="/#katalog-fakultas"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar__item-left">
                <Icon name="building" />
                <span>Fakultas &amp; Prodi</span>
              </span>
              <span className="sidebar__badge">40</span>
            </Link>
          </nav>

          <nav aria-label="Administrasi" className="sidebar__group">
            <span className="sidebar__group-label">Administrasi</span>
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

            {adminUser ? (
              <button
                className="sidebar__item"
                disabled={loggingOut}
                onClick={handleLogout}
                type="button"
              >
                <span className="sidebar__item-left">
                  <Icon name="log-out" />
                  <span>{loggingOut ? "Keluar..." : "Keluar Admin"}</span>
                </span>
              </button>
            ) : (
              <Link
                className="sidebar__item"
                href="/admin/login"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sidebar__item-left">
                  <Icon name="lock" />
                  <span>Masuk Admin</span>
                </span>
              </Link>
            )}
          </nav>
        </div>

        <div className="sidebar__bottom">
          <div className="sidebar__status">
            <span className={`status-dot${apiConnected ? "" : " status-dot--warn"}`} />
            <div>
              <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: "12.5px" }}>
                {apiConnected ? "API Laravel Terhubung" : "Menunggu API Laravel"}
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
                <Link
                  aria-label="Ringkasan Dashboard"
                  className="topbar__icon-btn"
                  href="/"
                  title="Dashboard"
                >
                  <Icon name="bell" />
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
                ) : (
                  <Link className="topbar__user" href="/admin/login">
                    <div className="topbar__user-info">
                      <b>Mode Publik</b>
                      <span>Klik untuk login admin</span>
                    </div>
                    <span className="avatar">UCN</span>
                  </Link>
                )}
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
