import { SubtestMeta, SubtestKey } from '../types/utbk';

export const SUBTEST_DEFINITIONS: Record<SubtestKey, SubtestMeta> = {
  pu: {
    key: 'pu',
    code: 'PU',
    name: 'Penalaran Umum',
    shortName: 'Penalaran Umum',
    category: 'TPS',
    questionCount: 30,
    durationMinutes: 30,
    description: 'Penalaran deduktif, induktif, dan penalaran kuantitatif analitis.'
  },
  ppu: {
    key: 'ppu',
    code: 'PPU',
    name: 'Pengetahuan & Pemahaman Umum',
    shortName: 'Pengetahuan Umum',
    category: 'TPS',
    questionCount: 20,
    durationMinutes: 15,
    description: 'Memahami ide pokok, sinonim, antonim, makna kata, dan kaitan antarkalimat.'
  },
  kbm: {
    key: 'kbm',
    code: 'PBM',
    name: 'Kemampuan Memahami Bacaan & Menulis',
    shortName: 'Bacaan & Menulis',
    category: 'TPS',
    questionCount: 20,
    durationMinutes: 25,
    description: 'Kaidah Ejaan Bahasa Indonesia (PUEBI/EYD V), kohesi wacana, dan perbaikan kalimat.'
  },
  pk: {
    key: 'pk',
    code: 'PK',
    name: 'Pengetahuan Kuantitatif',
    shortName: 'Kuantitatif',
    category: 'TPS',
    questionCount: 15,
    durationMinutes: 20,
    description: 'Matematika dasar, aritmetika, aljabar, geometri, dan logika numerik analitik.'
  },
  lbi: {
    key: 'lbi',
    code: 'LBI',
    name: 'Literasi Bahasa Indonesia',
    shortName: 'Lit. Indonesia',
    category: 'Literasi',
    questionCount: 30,
    durationMinutes: 45,
    description: 'Analisis teks naratif, eksposisi, opini, pemecahan masalah berbasis teks.'
  },
  lbe: {
    key: 'lbe',
    code: 'LBE',
    name: 'Literasi Bahasa Inggris',
    shortName: 'Lit. Inggris',
    category: 'Literasi',
    questionCount: 20,
    durationMinutes: 30,
    description: 'Main idea, tone of the author, inference, contextual vocabulary, and text synthesis.'
  },
  pm: {
    key: 'pm',
    code: 'PM',
    name: 'Penalaran Matematika',
    shortName: 'Penalaran MTK',
    category: 'Literasi',
    questionCount: 20,
    durationMinutes: 37.5,
    description: 'Pemecahan masalah kontekstual dunia nyata menggunakan model matematis.'
  }
};

export const NATIONAL_AVERAGES: Record<SubtestKey, number> = {
  pu: 554,
  ppu: 528,
  kbm: 542,
  pk: 512,
  lbi: 560,
  lbe: 518,
  pm: 508,
};
