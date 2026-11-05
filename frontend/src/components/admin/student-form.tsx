import Link from "next/link";
import type { ReactNode } from "react";

type StudentFormProps = {
  mode: "create" | "edit";
  studentId?: string;
};

export function StudentForm({ mode, studentId }: StudentFormProps) {
  const isEdit = mode === "edit";
  const submitLabel = isEdit ? "Simpan perubahan" : "Simpan mahasiswa";

  return (
    <form className="form-sections" noValidate>
      <section className="card card--pad-lg">
        <div className="card__head">
          <h2 className="t-h3">Identitas mahasiswa</h2>
          <p className="t-small muted">
            Isi sesuai dokumen resmi. Field bertanda <span className="field__req">*</span> wajib diisi.
          </p>
        </div>
        <div className="field-grid">
          <Field label="Nama lengkap" required>
            <input className="input" defaultValue={isEdit ? "Nama mahasiswa" : undefined} name="name" placeholder="Nama sesuai identitas" type="text" />
          </Field>
          <Field label="NPM" required>
            <input className="input" defaultValue={isEdit ? "" : undefined} name="npm" placeholder="Contoh: 2310110201" type="text" />
          </Field>
          <Field label="Jenis kelamin" required>
            <select className="select" defaultValue="" name="gender">
              <option disabled value="">
                Pilih jenis kelamin
              </option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
          </Field>
          <Field label="Tanggal lahir" required>
            <input className="input" name="birth_date" type="date" />
          </Field>
        </div>
      </section>

      <section className="card card--pad-lg">
        <div className="card__head">
          <h2 className="t-h3">Data akademik</h2>
          <p className="t-small muted">
            Program studi mengikuti fakultas yang dipilih.
          </p>
        </div>
        <div className="field-grid">
          <Field label="Fakultas" required>
            <select className="select" defaultValue="" name="faculty">
              <option disabled value="">
                Pilih fakultas
              </option>
            </select>
          </Field>
          <Field label="Program studi" required>
            <select className="select" defaultValue="" name="study_program">
              <option disabled value="">
                Pilih program studi
              </option>
            </select>
          </Field>
        </div>
        <p className="t-small muted">
          Daftar fakultas dan program studi diisi dari API Laravel. Pilihan masih kosong sampai endpoint tersedia.
        </p>
      </section>

      <section className="card card--pad-lg">
        <div className="card__head">
          <h2 className="t-h3">Alamat dan asal daerah</h2>
          <p className="t-small muted">Alamat hanya tersedia di area admin.</p>
        </div>
        <div className="field-grid">
          <Field label="Asal daerah" required>
            <input className="input" name="origin" placeholder="Kabupaten/kota, provinsi" type="text" />
          </Field>
          <Field label="Alamat sesuai KTP" required>
            <textarea className="textarea" name="address" placeholder="Alamat sesuai KTP" />
          </Field>
        </div>
      </section>

      <div className="form-actions">
        <Link className="btn btn--secondary" href={studentId ? `/admin/students/${studentId}` : "/admin/students"}>
          Batal
        </Link>
        <button className="btn btn--primary" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  children,
  label,
  required = false,
}: {
  children: ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required ? <span className="field__req"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
