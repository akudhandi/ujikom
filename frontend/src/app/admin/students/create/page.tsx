import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { StudentForm } from "@/components/admin/student-form";

export default function CreateStudentPage() {
  return (
    <AdminPageShell
      backHref="/admin/students"
      backLabel="Kembali ke Daftar Mahasiswa"
      current="create"
      description="Masukkan identitas, penempatan fakultas/program studi, dan alamat sesuai KTP. Mahasiswa baru otomatis berstatus aktif."
      title="Tambah Mahasiswa Baru"
    >
      <StudentForm mode="create" />
    </AdminPageShell>
  );
}
