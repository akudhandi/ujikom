import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <AdminPageShell
      action={
        <Link className="btn btn--primary" href={`/admin/students/${id}/edit`}>
          <Icon name="pencil" /> Edit mahasiswa
        </Link>
      }
      backHref="/admin/students"
      backLabel="Kembali ke data mahasiswa"
      description="Detail lengkap hanya dapat diakses oleh admin terautentikasi."
      title={`Detail mahasiswa #${id}`}
    >
      <div className="pgrid">
        <section className="card card--pad-lg">
          <div className="card__head">
            <span className="eyebrow">Identitas</span>
            <h2 className="t-h3">Data mahasiswa</h2>
          </div>
          <div className="mt">
            <EmptyState
              description="Detail mahasiswa muncul setelah endpoint Laravel untuk data mahasiswa terhubung."
              icon="user-check"
              title="Data belum tersedia"
            />
          </div>
        </section>

        <aside className="card">
          <span className="eyebrow">Status data</span>
          <h2 className="t-h3 mt">Nonaktifkan mahasiswa</h2>
          <p className="t-small muted">
            Menonaktifkan tidak menghapus data. Mahasiswa tidak lagi masuk ke statistik dashboard publik dan
            tetap tersimpan untuk riwayat.
          </p>
          <button className="btn btn--secondary btn--block mt" type="button">
            Nonaktifkan mahasiswa
          </button>
        </aside>
      </div>
    </AdminPageShell>
  );
}
