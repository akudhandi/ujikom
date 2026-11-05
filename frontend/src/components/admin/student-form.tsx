import Link from "next/link";
import type { ReactNode } from "react";

type StudentFormProps = {
  mode: "create" | "edit";
  studentId?: string;
};

const fieldClassName = "mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

export function StudentForm({ mode, studentId }: StudentFormProps) {
  const isEdit = mode === "edit";
  const title = isEdit ? "Simpan perubahan" : "Simpan mahasiswa";

  return (
    <form className="grid gap-7" noValidate>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5">
          <h2 className="text-xl font-semibold">Identitas mahasiswa</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Field bertanda <span className="font-semibold text-rose-700">*</span> wajib diisi.</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Nama lengkap" required><input className={fieldClassName} defaultValue={isEdit ? "Aulia Putri Ramadhan" : undefined} name="name" placeholder="Nama sesuai identitas" type="text" /></Field>
          <Field label="NPM" required><input className={fieldClassName} defaultValue={isEdit ? "2310110201" : undefined} name="npm" placeholder="Contoh: 2310110201" type="text" /></Field>
          <Field label="Jenis kelamin" required><select className={fieldClassName} defaultValue={isEdit ? "perempuan" : ""} name="gender"><option disabled value="">Pilih jenis kelamin</option><option value="laki-laki">Laki-laki</option><option value="perempuan">Perempuan</option></select></Field>
          <Field label="Tanggal lahir" required><input className={fieldClassName} defaultValue={isEdit ? "2005-05-12" : undefined} name="birth_date" type="date" /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5"><h2 className="text-xl font-semibold">Data akademik</h2><p className="mt-2 text-sm leading-6 text-slate-500">Program studi hanya dapat dipilih setelah fakultas ditentukan.</p></div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Fakultas" required><select className={fieldClassName} defaultValue={isEdit ? "teknik" : ""} name="faculty"><option disabled value="">Pilih fakultas</option><option value="teknik">Fakultas Teknik</option><option value="ekonomi">Fakultas Ekonomi dan Bisnis</option></select></Field>
          <Field label="Program studi" required><select className={fieldClassName} defaultValue={isEdit ? "informatika" : ""} name="study_program"><option disabled value="">Pilih program studi</option><option value="informatika">Teknik Informatika</option><option value="sistem-informasi">Sistem Informasi</option><option value="manajemen">Manajemen</option></select></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="border-b border-slate-100 pb-5"><h2 className="text-xl font-semibold">Alamat dan asal daerah</h2><p className="mt-2 text-sm leading-6 text-slate-500">Alamat KTP hanya tersedia pada area admin.</p></div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Asal daerah" required><input className={fieldClassName} defaultValue={isEdit ? "Kota Bandung, Jawa Barat" : undefined} name="origin" placeholder="Kabupaten/kota, provinsi" type="text" /></Field>
          <Field label="Alamat sesuai KTP" required><textarea className={`${fieldClassName} min-h-30 py-3`} defaultValue={isEdit ? "Jl. Sukajadi, Kota Bandung" : undefined} name="address" placeholder="Alamat sesuai KTP" /></Field>
        </div>
      </section>

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <Link className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100" href={studentId ? `/admin/students/${studentId}` : "/admin/students"}>Batal</Link>
        <button className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800" type="submit">{title}</button>
      </div>
    </form>
  );
}

function Field({ children, label, required = false }: { children: ReactNode; label: string; required?: boolean }) {
  return <label className="block text-sm font-medium text-slate-700">{label}{required ? <span className="ml-1 text-rose-700">*</span> : null}{children}</label>;
}
