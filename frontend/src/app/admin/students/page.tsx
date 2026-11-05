import Link from "next/link";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";

export default function StudentsPage() {
  return (
    <AdminPageShell
      description="Cari, filter, dan kelola data mahasiswa. Data nonaktif tetap disimpan untuk menjaga riwayat."
      title="Data mahasiswa"
    >
      <section className="card">
        <div className="toolbar">
          <label className="search">
            <span className="sr-only">Cari mahasiswa</span>
            <Icon name="search" />
            <input className="input input--search" placeholder="Cari nama atau NPM" type="search" />
          </label>
          <label className="field">
            <span className="sr-only">Filter status mahasiswa</span>
            <select className="select" defaultValue="active">
              <option value="active">Mahasiswa aktif</option>
              <option value="inactive">Mahasiswa nonaktif</option>
              <option value="all">Semua status</option>
            </select>
          </label>
        </div>

        <div className="padded">
          <EmptyState
            action={
              <Link className="btn btn--primary" href="/admin/students/create">
                <Icon name="plus" /> Tambah mahasiswa
              </Link>
            }
            description="Tambahkan data mahasiswa pertama. Tabel akan muncul setelah API CRUD Laravel mengembalikan data."
            icon="users"
            title="Belum ada mahasiswa"
          />
        </div>
        <div className="table__foot">
          Menampilkan 0 data. Kolom: nama, NPM, alamat KTP, asal daerah, fakultas dan program studi, status.
        </div>
      </section>
    </AdminPageShell>
  );
}
