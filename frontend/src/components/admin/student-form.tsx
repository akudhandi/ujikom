"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";

import { Icon } from "@/components/ui/icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  ApiError,
  createAdminStudent,
  fetchAdminStudent,
  fetchFaculties,
  updateAdminStudent,
} from "@/lib/api";
import type { FacultyItem } from "@/types/dashboard";

type StudentFormProps = {
  mode: "create" | "edit";
  studentId?: string;
};

const ORIGIN_SUGGESTIONS = [
  "Kota Surabaya, Jawa Timur",
  "Kota Malang, Jawa Timur",
  "Kabupaten Sidoarjo, Jawa Timur",
  "Kabupaten Gresik, Jawa Timur",
  "Kabupaten Jember, Jawa Timur",
  "Kota Bandung, Jawa Barat",
  "Kota Jakarta Selatan, DKI Jakarta",
  "Kota Semarang, Jawa Tengah",
  "Kota Yogyakarta, DI Yogyakarta",
  "Kota Denpasar, Bali",
];

export function StudentForm({ mode, studentId }: StudentFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [faculties, setFaculties] = useState<FacultyItem[]>([]);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [npm, setNpm] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [facultyId, setFacultyId] = useState<string>("");
  const [studyProgramId, setStudyProgramId] = useState<string>("");
  const [originRegion, setOriginRegion] = useState("");
  const [ktpAddress, setKtpAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoadingInitial(true);
      try {
        const masterFaculties = await fetchFaculties();
        if (!active) {
          return;
        }
        setFaculties(masterFaculties);

        if (isEdit && studentId) {
          const student = await fetchAdminStudent(studentId);
          if (!active) {
            return;
          }
          setName(student.name);
          setNpm(student.npm);
          setGender(student.gender);
          setDateOfBirth(student.date_of_birth);
          setFacultyId(String(student.faculty_id));
          setStudyProgramId(String(student.study_program_id));
          setOriginRegion(student.origin_region);
          setKtpAddress(student.ktp_address);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof ApiError ? error.message : "Gagal memuat data referensi formulir.",
          );
        }
      } finally {
        if (active) {
          setLoadingInitial(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [isEdit, studentId]);

  const availablePrograms = useMemo(() => {
    const selected = faculties.find((f) => String(f.id) === facultyId);
    return selected?.study_programs ?? [];
  }, [faculties, facultyId]);

  const handleFacultyChange = (nextFacultyId: string) => {
    setFacultyId(nextFacultyId);
    const nextFac = faculties.find((f) => String(f.id) === nextFacultyId);
    const firstProgram = nextFac?.study_programs[0];
    setStudyProgramId(firstProgram ? String(firstProgram.id) : "");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!/^\d{11}$/.test(npm.trim())) {
      setFieldErrors({ npm: ["NPM wajib berupa angka dengan panjang tepat 11 digit."] });
      return;
    }

    if (!gender) {
      setFieldErrors({ gender: ["Jenis kelamin wajib dipilih."] });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        npm: npm.trim(),
        ktp_address: ktpAddress.trim(),
        origin_region: originRegion.trim(),
        faculty_id: Number(facultyId),
        study_program_id: Number(studyProgramId),
        date_of_birth: dateOfBirth,
        gender,
      };

      if (isEdit && studentId) {
        const res = await updateAdminStudent(studentId, payload);
        router.push(`/admin/students/${res.data.id}`);
      } else {
        await createAdminStudent(payload);
        router.push("/admin/students");
      }
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        if (error.errors) {
          setFieldErrors(error.errors);
        }
      } else {
        setErrorMessage("Terjadi kesalahan saat menyimpan data mahasiswa.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <SpotlightCard>
        <p className="muted">Memuat formulir dan master 9 fakultas / 40 program studi...</p>
      </SpotlightCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
      {errorMessage ? (
        <div className="alert alert--error" role="alert">
          <Icon name="circle-alert" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <SpotlightCard>
        <div className="bento-card__head">
          <div>
            <h2 className="bento-card__title">1. Identitas Mahasiswa</h2>
            <p className="bento-card__sub">
              Masukkan nama lengkap sesuai KTP, NPM unik, jenis kelamin, dan tanggal lahir.
            </p>
          </div>
          <span className="badge badge--active">Data Utama</span>
        </div>

        <div className="field-grid">
          <Field error={fieldErrors.name?.[0]} label="Nama Lengkap" required>
            <input
              className="input"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Raka Pratama Putra"
              required
              type="text"
              value={name}
            />
          </Field>

          <Field
            error={fieldErrors.npm?.[0]}
            label={`NPM (11 Digit Angka · ${npm.length}/11)`}
            required
          >
            <input
              className="input mono"
              inputMode="numeric"
              maxLength={11}
              minLength={11}
              name="npm"
              onChange={(e) => setNpm(e.target.value.replace(/\D/g, "").slice(0, 11))}
              pattern="\d{11}"
              placeholder="Contoh: 24101100099 (11 angka)"
              required
              title="NPM harus terdiri dari 11 digit angka"
              type="text"
              value={npm}
            />
          </Field>

          <Field error={fieldErrors.gender?.[0]} label="Jenis Kelamin" required>
            <select
              className="select"
              name="gender"
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              required
              value={gender}
            >
              <option disabled value="">
                Pilih jenis kelamin
              </option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </Field>

          <Field error={fieldErrors.date_of_birth?.[0]} label="Tanggal Lahir" required>
            <input
              className="input"
              max={new Date().toISOString().slice(0, 10)}
              name="date_of_birth"
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              type="date"
              value={dateOfBirth}
            />
          </Field>
        </div>
      </SpotlightCard>

      <SpotlightCard>
        <div className="bento-card__head">
          <div>
            <h2 className="bento-card__title">2. Penempatan Akademik (9 Fakultas · 40 Prodi)</h2>
            <p className="bento-card__sub">
              Daftar program studi otomatis menyesuaikan fakultas atau program pascasarjana yang
              dipilih.
            </p>
          </div>
        </div>

        <div className="field-grid">
          <Field error={fieldErrors.faculty_id?.[0]} label="Fakultas / Unit Akademik" required>
            <select
              className="select"
              name="faculty_id"
              onChange={(e) => handleFacultyChange(e.target.value)}
              required
              value={facultyId}
            >
              <option disabled value="">
                Pilih fakultas (9 unit tersedia)
              </option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.code} — {faculty.name}
                </option>
              ))}
            </select>
          </Field>

          <Field error={fieldErrors.study_program_id?.[0]} label="Program Studi" required>
            <select
              className="select"
              disabled={!facultyId}
              name="study_program_id"
              onChange={(e) => setStudyProgramId(e.target.value)}
              required
              value={studyProgramId}
            >
              <option disabled value="">
                {facultyId ? "Pilih program studi" : "Pilih fakultas terlebih dahulu"}
              </option>
              {availablePrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  [{program.degree}] {program.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </SpotlightCard>

      <SpotlightCard>
        <div className="bento-card__head">
          <div>
            <h2 className="bento-card__title">3. Asal Daerah &amp; Alamat Sesuai KTP</h2>
            <p className="bento-card__sub">
              Asal daerah digunakan untuk statistik demografi; alamat lengkap KTP hanya tampil pada
              halaman administrasi.
            </p>
          </div>
        </div>

        <div className="field-grid">
          <Field
            error={fieldErrors.origin_region?.[0]}
            label="Asal Daerah (Kabupaten/Kota, Provinsi)"
            required
          >
            <input
              className="input"
              list="origin-region-list"
              name="origin_region"
              onChange={(e) => setOriginRegion(e.target.value)}
              placeholder="Contoh: Kota Surabaya, Jawa Timur"
              required
              type="text"
              value={originRegion}
            />
            <datalist id="origin-region-list">
              {ORIGIN_SUGGESTIONS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </Field>

          <Field error={fieldErrors.ktp_address?.[0]} label="Alamat Lengkap Sesuai KTP" required>
            <textarea
              className="textarea"
              name="ktp_address"
              onChange={(e) => setKtpAddress(e.target.value)}
              placeholder="Contoh: Jl. Raya Darmo No. 45, RT 02/RW 04, Wonokromo, Kota Surabaya"
              required
              value={ktpAddress}
            />
          </Field>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
            paddingTop: "8px",
            borderTop: "1px solid var(--line)",
          }}
        >
          <Link
            className="btn btn--secondary"
            href={studentId ? `/admin/students/${studentId}` : "/admin/students"}
          >
            Batal
          </Link>
          <button className="btn btn--primary" disabled={submitting} type="submit">
            <Icon name="circle-check" />
            {submitting
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Mahasiswa Baru"}
          </button>
        </div>
      </SpotlightCard>
    </form>
  );
}

function Field({
  children,
  label,
  required = false,
  error,
}: {
  children: ReactNode;
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required ? <span className="field__req"> *</span> : null}
      </span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
