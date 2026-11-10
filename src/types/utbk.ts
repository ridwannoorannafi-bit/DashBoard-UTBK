export type SubtestKey = 'pu' | 'ppu' | 'kbm' | 'pk' | 'lbi' | 'lbe' | 'pm';

export type SubtestCategory = 'TPS' | 'Literasi';

export interface SubtestMeta {
  key: SubtestKey;
  code: string;
  name: string;
  shortName: string;
  category: SubtestCategory;
  questionCount: number;
  durationMinutes: number;
  description: string;
}

export interface SubtestScoreMap {
  pu: number;  // Penalaran Umum
  ppu: number; // Pengetahuan & Pemahaman Umum
  kbm: number; // Pemahaman Bacaan & Menulis
  pk: number;  // Pengetahuan Kuantitatif
  lbi: number; // Literasi Bahasa Indonesia
  lbe: number; // Literasi Bahasa Inggris
  pm: number;  // Penalaran Matematika
}

export interface TryOutResult {
  toId: string;
  title: string;
  date: string;
  totalScore: number;
  subtests: SubtestScoreMap;
  percentileRank?: number;
}

export interface SubtestEvaluationDetail {
  subtestKey: SubtestKey;
  subtestName: string;
  category: SubtestCategory;
  currentScore: number;
  targetScore: number;
  nationalAverage: number;
  status: 'Aman' | 'Waspada' | 'Kritis';
  accuracyRate: number; // percentage
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface UniversityChoice {
  university: string;
  major: string;
  passingGradeEstimate: number;
  degree: 'S1' | 'D4';
  accreditation: string;
}

export interface TutorNote {
  id: string;
  date: string;
  tutorName: string;
  note: string;
  category: 'Akademik' | 'Strategi' | 'Motivasi';
}

export interface Student {
  id: string;            // e.g. "UTBK-2025-001" or NISN
  password: string;      // default: "siswa123"
  name: string;
  school: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  classGroup: string;    // e.g. "Intensif Ambis PTN 2025 - Kelas A"
  targetScore: number;
  choice1: UniversityChoice;
  choice2: UniversityChoice;
  tryOuts: TryOutResult[];
  evaluations: SubtestEvaluationDetail[];
  tutorNotes: TutorNote[];
  updatedAt: string;
}

export interface HostUser {
  id: string;
  name: string;
  role: 'host' | 'admin' | 'tutor';
  institution: string;
}

export interface PortalUiSettings {
  theme: 'tesla_classic' | 'sapphire_gold' | 'emerald_teal' | 'crimson_amber';
  showTargetLine: boolean;
  showPassingGradeStatus: boolean;
  showAiRecommendations: boolean;
  showMentorNotesToStudent: boolean;
  showSubtestBreakdown: boolean;
  thresholdSafe: number;
  thresholdWarning: number;
  kopTitle: string;
  kopSubtitle: string;
  kopAddress: string;
  signatoryName: string;
  signatoryTitle: string;
}

export type AuthUser = 
  | { role: 'student'; student: Student }
  | { role: 'host'; host: HostUser }
  | null;
