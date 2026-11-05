export type AuthUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
};

export type StudyProgramItem = {
  id: number;
  faculty_id?: number;
  degree: string;
  name: string;
  active_students_count?: number;
  count?: number;
  percentage?: number;
};

export type FacultyItem = {
  id: number;
  code: string;
  name: string;
  active_students_count?: number;
  count?: number;
  percentage?: number;
  study_programs: StudyProgramItem[];
};

export type DashboardSummary = {
  total_active_students: number;
  male_count: number;
  female_count: number;
  male_percentage: number;
  female_percentage: number;
  total_faculties: number;
  active_faculties_count: number;
  total_study_programs: number;
  generated_at: string;
};

export type GenderDistributionItem = {
  key: "male" | "female";
  label: string;
  count: number;
  percentage: number;
};

export type OriginDistributionItem = {
  region: string;
  count: number;
  percentage: number;
};

export type AgeDistributionItem = {
  range: string;
  count: number;
  percentage: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  gender_distribution: GenderDistributionItem[];
  origin_distribution: OriginDistributionItem[];
  faculty_distribution: FacultyItem[];
  age_distribution: AgeDistributionItem[];
};

export type StudentItem = {
  id: number;
  name: string;
  npm: string;
  ktp_address: string;
  origin_region: string;
  faculty_id: number;
  study_program_id: number;
  faculty?: {
    id: number;
    code: string;
    name: string;
  };
  study_program?: {
    id: number;
    degree: string;
    name: string;
  };
  date_of_birth: string;
  age: number;
  gender: "male" | "female";
  gender_label: string;
  status: "active" | "inactive";
  status_label: string;
  deactivated_at: string | null;
  deactivated_by?: {
    id: number;
    name: string;
    username: string;
  } | null;
  created_at: string;
  updated_at: string;
};

export type StudentListResponse = {
  data: StudentItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    counts: {
      active: number;
      inactive: number;
      all: number;
    };
  };
};

export type StudentPayload = {
  name: string;
  npm: string;
  ktp_address: string;
  origin_region: string;
  faculty_id: number;
  study_program_id: number;
  date_of_birth: string;
  gender: "male" | "female";
};
