<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\Student;
use App\Models\StudyProgram;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Seed sampel data mahasiswa lintas fakultas, daerah, dan kelompok usia.
     */
    public function run(): void
    {
        if (Student::query()->count() > 0) {
            return;
        }

        $faculties = Faculty::query()->with('studyPrograms')->get()->keyBy('code');
        if ($faculties->isEmpty()) {
            return;
        }

        $adminId = User::query()->where('role', 'admin')->value('id');

        $records = [
            ['npm' => '24101100001', 'name' => 'Raka Pratama Putra', 'gender' => 'male', 'dob' => '2006-05-14', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FASILKOM', 'program' => 'Teknik Informatika', 'address' => 'Jl. Raya Darmo No. 45, Wonokromo, Kota Surabaya', 'status' => 'active'],
            ['npm' => '24101100002', 'name' => 'Nadia Maharani', 'gender' => 'female', 'dob' => '2005-08-21', 'origin' => 'Kota Bandung, Jawa Barat', 'faculty' => 'FASILKOM', 'program' => 'Sains Data', 'address' => 'Jl. Dago Asri II No. 12, Coblong, Kota Bandung', 'status' => 'active'],
            ['npm' => '24101100003', 'name' => 'Dimas Arya Saputra', 'gender' => 'male', 'dob' => '2004-11-03', 'origin' => 'Kota Malang, Jawa Timur', 'faculty' => 'FASILKOM', 'program' => 'Sistem Informasi', 'address' => 'Jl. Soekarno Hatta Indah Blok C-8, Lowokwaru, Kota Malang', 'status' => 'active'],
            ['npm' => '24101100004', 'name' => 'Alya Zahra Putri', 'gender' => 'female', 'dob' => '2005-02-19', 'origin' => 'Kota Jakarta Selatan, DKI Jakarta', 'faculty' => 'FASILKOM', 'program' => 'Bisnis Digital', 'address' => 'Jl. Kemang Timur V No. 18, Mampang Prapatan, Jakarta Selatan', 'status' => 'active'],
            ['npm' => '23101200005', 'name' => 'Bagas Adi Nugroho', 'gender' => 'male', 'dob' => '2004-04-11', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FEB', 'program' => 'Manajemen', 'address' => 'Jl. Manyar Kertoarjo IV No. 27, Gubeng, Kota Surabaya', 'status' => 'active'],
            ['npm' => '23101200006', 'name' => 'Salsabila Khairunnisa', 'gender' => 'female', 'dob' => '2005-09-29', 'origin' => 'Kabupaten Sidoarjo, Jawa Timur', 'faculty' => 'FEB', 'program' => 'Akuntansi', 'address' => 'Perum Pondok Jati Blok BF-10, Kabupaten Sidoarjo', 'status' => 'active'],
            ['npm' => '23101200007', 'name' => 'Farhan Rizky Maulana', 'gender' => 'male', 'dob' => '2003-07-16', 'origin' => 'Kota Semarang, Jawa Tengah', 'faculty' => 'FEB', 'program' => 'Ekonomi Pembangunan', 'address' => 'Jl. Pandanaran No. 88, Semarang Tengah, Kota Semarang', 'status' => 'active'],
            ['npm' => '24101200008', 'name' => 'Tiara Kusuma Wardhani', 'gender' => 'female', 'dob' => '2006-01-25', 'origin' => 'Kota Yogyakarta, DI Yogyakarta', 'faculty' => 'FEB', 'program' => 'Kewirausahaan', 'address' => 'Jl. Kaliurang Km 5.5 Gg. Megatruh No. 9, Sleman', 'status' => 'active'],
            ['npm' => '22101300009', 'name' => 'Bima Sakti Wicaksono', 'gender' => 'male', 'dob' => '2003-03-08', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FT', 'program' => 'Teknik Industri', 'address' => 'Jl. Rungkut Asri Tengah No. 31, Rungkut, Kota Surabaya', 'status' => 'active'],
            ['npm' => '22101300010', 'name' => 'Anindya Sekar Ayu', 'gender' => 'female', 'dob' => '2004-06-17', 'origin' => 'Kabupaten Gresik, Jawa Timur', 'faculty' => 'FT', 'program' => 'Teknik Kimia', 'address' => 'Jl. Kalimantan No. 64, Gresik Kota Baru, Kabupaten Gresik', 'status' => 'active'],
            ['npm' => '23101300011', 'name' => 'Reza Pahlevi Hidayat', 'gender' => 'male', 'dob' => '2004-12-05', 'origin' => 'Kota Bandung, Jawa Barat', 'faculty' => 'FT', 'program' => 'Teknik Sipil', 'address' => 'Jl. Buah Batu No. 142, Lengkong, Kota Bandung', 'status' => 'active'],
            ['npm' => '24101300012', 'name' => 'Citra Dewi Lestari', 'gender' => 'female', 'dob' => '2006-03-22', 'origin' => 'Kota Malang, Jawa Timur', 'faculty' => 'FT', 'program' => 'Teknologi Pangan', 'address' => 'Jl. Ijen Besar No. 19, Klojen, Kota Malang', 'status' => 'active'],
            ['npm' => '23101300013', 'name' => 'Gilang Ramadhan', 'gender' => 'male', 'dob' => '2003-10-12', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FT', 'program' => 'Teknik Mesin', 'address' => 'Jl. Ketintang Baru III No. 14, Gayungan, Kota Surabaya', 'status' => 'active'],
            ['npm' => '23101400014', 'name' => 'Larasati Putri Utami', 'gender' => 'female', 'dob' => '2004-08-30', 'origin' => 'Kabupaten Jember, Jawa Timur', 'faculty' => 'FAPERTA', 'program' => 'Agroteknologi', 'address' => 'Jl. Kalimantan X No. 5, Sumbersari, Kabupaten Jember', 'status' => 'active'],
            ['npm' => '22101400015', 'name' => 'Hendri Kurniawan', 'gender' => 'male', 'dob' => '2002-05-19', 'origin' => 'Kota Malang, Jawa Timur', 'faculty' => 'FAPERTA', 'program' => 'Agribisnis', 'address' => 'Jl. Veteran No. 32, Lowokwaru, Kota Malang', 'status' => 'active'],
            ['npm' => '23101500016', 'name' => 'Keisya Aurelia', 'gender' => 'female', 'dob' => '2005-04-02', 'origin' => 'Kota Jakarta Selatan, DKI Jakarta', 'faculty' => 'FISIP', 'program' => 'Ilmu Komunikasi', 'address' => 'Jl. Radio Dalam Raya No. 23, Kebayoran Baru, Jakarta Selatan', 'status' => 'active'],
            ['npm' => '22101500017', 'name' => 'Rafi Ahmad Fauzan', 'gender' => 'male', 'dob' => '2003-09-14', 'origin' => 'Kota Bandung, Jawa Barat', 'faculty' => 'FISIP', 'program' => 'Hubungan Internasional', 'address' => 'Jl. Setiabudi No. 77, Sukasari, Kota Bandung', 'status' => 'active'],
            ['npm' => '24101500018', 'name' => 'Putri Melati Kusuma', 'gender' => 'female', 'dob' => '2006-07-09', 'origin' => 'Kota Denpasar, Bali', 'faculty' => 'FISIP', 'program' => 'Pariwisata', 'address' => 'Jl. Teuku Umar Barat No. 108, Denpasar Barat, Kota Denpasar', 'status' => 'active'],
            ['npm' => '23101500019', 'name' => 'Yoga Pratama', 'gender' => 'male', 'dob' => '2004-01-28', 'origin' => 'Kabupaten Sidoarjo, Jawa Timur', 'faculty' => 'FISIP', 'program' => 'Administrasi Negara (Administrasi Publik)', 'address' => 'Jl. Pahlawan No. 41, Sidoarjo, Kabupaten Sidoarjo', 'status' => 'active'],
            ['npm' => '23101600020', 'name' => 'Dinda Kirana Sari', 'gender' => 'female', 'dob' => '2005-06-11', 'origin' => 'Kota Yogyakarta, DI Yogyakarta', 'faculty' => 'FAD', 'program' => 'Desain Komunikasi Visual (DKV)', 'address' => 'Jl. Gejayan No. 55, Depok, Sleman, DI Yogyakarta', 'status' => 'active'],
            ['npm' => '22101600021', 'name' => 'Kevin Sanjaya Putra', 'gender' => 'male', 'dob' => '2003-11-23', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FAD', 'program' => 'Arsitektur', 'address' => 'Jl. Dharmahusada Indah Timur No. 16, Mulyorejo, Kota Surabaya', 'status' => 'active'],
            ['npm' => '22101700022', 'name' => 'Shania Mahendra', 'gender' => 'female', 'dob' => '2002-12-15', 'origin' => 'Kota Semarang, Jawa Tengah', 'faculty' => 'FH', 'program' => 'Ilmu Hukum', 'address' => 'Jl. Sultan Agung No. 63, Gajahmungkur, Kota Semarang', 'status' => 'active'],
            ['npm' => '21101700023', 'name' => 'Aldi Taher Prakoso', 'gender' => 'male', 'dob' => '2001-08-04', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FH', 'program' => 'Ilmu Hukum', 'address' => 'Jl. Diponegoro No. 92, Tegalsari, Kota Surabaya', 'status' => 'active'],
            ['npm' => '22101800024', 'name' => 'Clarissa Wijaya', 'gender' => 'female', 'dob' => '2004-02-07', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FK', 'program' => 'Pendidikan Dokter', 'address' => 'Jl. Kertajaya Indah Tengah No. 21, Sukolilo, Kota Surabaya', 'status' => 'active'],
            ['npm' => '20101800025', 'name' => 'dr. Muhammad Ilham Akbar', 'gender' => 'male', 'dob' => '2000-04-18', 'origin' => 'Kota Malang, Jawa Timur', 'faculty' => 'FK', 'program' => 'Profesi Dokter', 'address' => 'Jl. Basuki Rahmat No. 50, Klojen, Kota Malang', 'status' => 'active'],
            ['npm' => '24201900026', 'name' => 'Hendra Wijaya, S.Kom.', 'gender' => 'male', 'dob' => '1997-09-10', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'PASCASARJANA', 'program' => 'S2 (Magister) Teknologi Informasi', 'address' => 'Jl. Jemursari Selatan IV No. 8, Wonocolo, Kota Surabaya', 'status' => 'active'],
            ['npm' => '24201900027', 'name' => 'Maya Puspita, S.E.', 'gender' => 'female', 'dob' => '1998-03-27', 'origin' => 'Kota Jakarta Selatan, DKI Jakarta', 'faculty' => 'PASCASARJANA', 'program' => 'S2 (Magister) Manajemen', 'address' => 'Jl. Tebet Barat Dalam Raya No. 34, Tebet, Jakarta Selatan', 'status' => 'active'],
            ['npm' => '23301900028', 'name' => 'Dr. Cand. Bambang Sutrisno, M.M.', 'gender' => 'male', 'dob' => '1992-07-12', 'origin' => 'Kota Semarang, Jawa Tengah', 'faculty' => 'PASCASARJANA', 'program' => 'S3 (Doktor) Ilmu Manajemen', 'address' => 'Jl. Pemuda No. 119, Sekayu, Kota Semarang', 'status' => 'active'],
            ['npm' => '21101100029', 'name' => 'Bayu Anggara', 'gender' => 'male', 'dob' => '2002-10-01', 'origin' => 'Kabupaten Sidoarjo, Jawa Timur', 'faculty' => 'FASILKOM', 'program' => 'Teknik Informatika', 'address' => 'Jl. Brigjen Katamso No. 17, Waru, Kabupaten Sidoarjo', 'status' => 'inactive'],
            ['npm' => '21101200030', 'name' => 'Rina Oktaviani', 'gender' => 'female', 'dob' => '2002-01-15', 'origin' => 'Kota Surabaya, Jawa Timur', 'faculty' => 'FEB', 'program' => 'Akuntansi', 'address' => 'Jl. Ngagel Jaya Tengah No. 73, Gubeng, Kota Surabaya', 'status' => 'inactive'],
        ];

        foreach ($records as $item) {
            /** @var Faculty|null $faculty */
            $faculty = $faculties->get($item['faculty']);
            if (! $faculty) {
                continue;
            }

            /** @var StudyProgram|null $program */
            $program = $faculty->studyPrograms->firstWhere('name', $item['program']);
            if (! $program) {
                continue;
            }

            $isInactive = $item['status'] === 'inactive';

            Student::query()->updateOrCreate(
                ['npm' => $item['npm']],
                [
                    'name' => $item['name'],
                    'ktp_address' => $item['address'],
                    'origin_region' => $item['origin'],
                    'faculty_id' => $faculty->id,
                    'study_program_id' => $program->id,
                    'date_of_birth' => $item['dob'],
                    'gender' => $item['gender'],
                    'status' => $item['status'],
                    'deactivated_at' => $isInactive ? now()->subDays(14) : null,
                    'deactivated_by' => $isInactive ? $adminId : null,
                ],
            );
        }
    }
}
