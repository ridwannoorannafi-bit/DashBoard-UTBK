import { Student, AuthUser, TryOutResult, TutorNote, SubtestKey, PortalUiSettings } from '../types/utbk';
import { INITIAL_STUDENTS, INITIAL_HOST } from '../data/initialStudents';
import { SUBTEST_DEFINITIONS, NATIONAL_AVERAGES } from '../data/utbkMeta';

const STORAGE_KEY_STUDENTS = 'ambis_utbk_students_v1';
const STORAGE_KEY_SESSION = 'ambis_utbk_session_v1';
const STORAGE_KEY_UI_SETTINGS = 'ambis_utbk_ui_settings_v1';

export const DEFAULT_UI_SETTINGS: PortalUiSettings = {
  theme: 'tesla_classic',
  showTargetLine: true,
  showPassingGradeStatus: true,
  showAiRecommendations: true,
  showMentorNotesToStudent: true,
  showSubtestBreakdown: true,
  thresholdSafe: 650,
  thresholdWarning: 580,
  kopTitle: 'RUMAH BELAJAR TESLA',
  kopSubtitle: 'BIMBINGAN SUKSES PTN · PROGRAM INTENSIF UTBK SNBT',
  kopAddress: 'Layanan Konsultasi Akademik, Try Out Berstandar BP3 Kemendikbudristek & Bimbingan Klinik',
  signatoryName: 'Dr. H. Hendra Wijaya, M.Pd',
  signatoryTitle: 'Kepala Program Bimbingan Intensif PTN'
};

export function getStoredUiSettings(): PortalUiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_UI_SETTINGS);
    if (!raw) return DEFAULT_UI_SETTINGS;
    return { ...DEFAULT_UI_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to read UI settings:', err);
    return DEFAULT_UI_SETTINGS;
  }
}

export function saveStoredUiSettings(settings: PortalUiSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_UI_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save UI settings:', err);
  }
}

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to read students from storage:', err);
    return INITIAL_STUDENTS;
  }
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to save students to storage:', err);
  }
}

export function resetToDefaultData(): Student[] {
  localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  return INITIAL_STUDENTS;
}

export function getStoredSession(): AuthUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read session:', err);
    return null;
  }
}

export function saveStoredSession(user: AuthUser): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

/**
 * Recalculate subtest evaluations when a student's TryOut is updated or added
 */
export function recalculateEvaluations(student: Student): Student {
  const latestTO = student.tryOuts[student.tryOuts.length - 1];
  if (!latestTO) return student;

  const subtestKeys: SubtestKey[] = ['pu', 'ppu', 'kbm', 'pk', 'lbi', 'lbe', 'pm'];

  const updatedEvaluations = subtestKeys.map(key => {
    const score = latestTO.subtests[key] || 500;
    const meta = SUBTEST_DEFINITIONS[key];
    const nationalAvg = NATIONAL_AVERAGES[key] || 530;
    const targetSubtestScore = Math.round(student.targetScore * 0.98); // approx

    let status: 'Aman' | 'Waspada' | 'Kritis' = 'Aman';
    if (score < 600) {
      status = 'Kritis';
    } else if (score < targetSubtestScore - 15) {
      status = 'Waspada';
    } else {
      status = 'Aman';
    }

    const existingEval = student.evaluations?.find(e => e.subtestKey === key);

    return {
      subtestKey: key,
      subtestName: meta.name,
      category: meta.category,
      currentScore: score,
      targetScore: targetSubtestScore,
      nationalAverage: nationalAvg,
      status,
      accuracyRate: Math.min(99, Math.max(50, Math.round((score / 850) * 100))),
      strengths: existingEval?.strengths || [
        `Penguasaan materi konsep ${meta.shortName} sudah cukup konsisten.`
      ],
      weaknesses: existingEval?.weaknesses || [
        `Tingkatkan kecepatan analisis soal bertipe analitis dan HOTS.`
      ],
      recommendations: existingEval?.recommendations || [
        `Perbanyak latihan soal paket 20 soal dengan batas waktu ${meta.durationMinutes} menit.`
      ]
    };
  });

  return {
    ...student,
    evaluations: updatedEvaluations,
    updatedAt: new Date().toISOString()
  };
}

export function createNewStudent(data: Partial<Student>): Student {
  const id = data.id || `UTBK-2025-${String(Math.floor(Math.random() * 900) + 100)}`;
  const student: Student = {
    id,
    password: data.password || 'siswa123',
    name: data.name || 'Siswa Baru',
    school: data.school || 'SMA Negeri 1',
    phone: data.phone || '',
    email: data.email || '',
    classGroup: data.classGroup || 'Intensif Ambis PTN 2025 - Gold Class',
    targetScore: data.targetScore || 680,
    choice1: data.choice1 || {
      university: 'Universitas Indonesia (UI)',
      major: 'Ilmu Komunikasi',
      passingGradeEstimate: 660,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    choice2: data.choice2 || {
      university: 'Universitas Gadjah Mada (UGM)',
      major: 'Sosiologi',
      passingGradeEstimate: 625,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    tryOuts: data.tryOuts || [
      {
        toId: 'TO-1',
        title: 'Try Out Diagnostik Awal',
        date: new Date().toISOString().split('T')[0],
        totalScore: 570,
        subtests: { pu: 580, ppu: 560, kbm: 575, pk: 540, lbi: 600, lbe: 570, pm: 565 },
        percentileRank: 70
      }
    ],
    evaluations: [],
    tutorNotes: [
      {
        id: `note-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        tutorName: 'Tim Akademik Bimbingan Intensif',
        note: 'Selamat bergabung dalam Program Intensif UTBK SNBT. Siapkan target ambis dan ikuti jadwal konsultasi klinik!',
        category: 'Motivasi'
      }
    ],
    updatedAt: new Date().toISOString()
  };

  return recalculateEvaluations(student);
}
