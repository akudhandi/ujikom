"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { AppShell } from "@/components/layout/site-header";
import { Icon } from "@/components/ui/icon";
import { fetchCurrentAdmin, getStoredToken } from "@/lib/api";

type AdminPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
  current?: "dashboard" | "students" | "create";
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function AdminPageShell({
  title,
  description,
  children,
  action,
  backHref,
  backLabel = "Kembali",
  current = "students",
  searchValue,
  onSearchChange,
}: AdminPageShellProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "authenticated" | "unauthenticated">(
    "authenticated",
  );

  useEffect(() => {
    let active = true;
    const token = getStoredToken();
    if (!token) {
      Promise.resolve().then(() => {
        if (active) {
          setAuthState("unauthenticated");
          router.replace("/admin/login");
        }
      });
      return;
    }

    fetchCurrentAdmin().then((user) => {
      if (!active) {
        return;
      }
      if (!user) {
        setAuthState("unauthenticated");
        router.replace("/admin/login");
      } else {
        setAuthState("authenticated");
      }
    });

    return () => {
      active = false;
    };
  }, [router]);

  const defaultAction = action ?? (
    <Link className="btn btn--primary" href="/admin/students/create">
      <Icon name="plus" />
      Tambah Mahasiswa
    </Link>
  );

  return (
    <AppShell
      backHref={backHref}
      backLabel={backLabel}
      current={current}
      headerAction={defaultAction}
      onSearchChange={onSearchChange}
      searchValue={searchValue}
      subtitle={description}
      title={title}
    >
      {authState === "checking" ? (
        <div className="bento-card" style={{ alignItems: "center", padding: "48px 24px" }}>
          <p className="muted">Memverifikasi sesi administrator...</p>
        </div>
      ) : (
        children
      )}
    </AppShell>
  );
}
