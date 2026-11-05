import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { StudentForm } from "@/components/admin/student-form";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AdminPageShell backHref={`/admin/students/${id}`} description="Perbarui data mahasiswa. NPM tetap harus unik untuk mahasiswa aktif maupun nonaktif." title="Edit mahasiswa"><StudentForm mode="edit" studentId={id} /></AdminPageShell>;
}
