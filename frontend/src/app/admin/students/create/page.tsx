import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { StudentForm } from "@/components/admin/student-form";

export default function CreateStudentPage() {
  return (
    <AdminPageShell
      backHref="/admin/students"
      description="Masukkan data identitas, akademik, dan alamat mahasiswa. Validasi akhir dilakukan oleh Laravel API."
      title="Tambah mahasiswa"
    >
      <StudentForm mode="create" />
    </AdminPageShell>
  );
}
