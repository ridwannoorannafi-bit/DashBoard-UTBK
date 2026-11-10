import { Student } from '../types/utbk';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'UTBK-2025-001',
    password: 'siswa123',
    name: 'Muhammad Farel Pratama',
    school: 'SMAN 1 Teladan Yogyakarta',
    phone: '0812-3456-7890',
    email: 'farel.pratama@example.com',
    classGroup: 'Intensif Ambis PTN 2025 - Gold Class',
    targetScore: 720,
    choice1: {
      university: 'Universitas Indonesia (UI)',
      major: 'Pendidikan Dokter (FK)',
      passingGradeEstimate: 715,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    choice2: {
      university: 'Universitas Gadjah Mada (UGM)',
      major: 'Farmasi',
      passingGradeEstimate: 668,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    tryOuts: [
      {
        toId: 'TO-1',
        title: 'Try Out Intensif 1 (Diagnostik)',
        date: '2024-11-10',
        totalScore: 592,
        subtests: { pu: 605, ppu: 580, kbm: 610, pk: 540, lbi: 630, lbe: 595, pm: 584 },
        percentileRank: 78
      },
      {
        toId: 'TO-2',
        title: 'Try Out Intensif 2',
        date: '2024-12-05',
        totalScore: 624,
        subtests: { pu: 640, ppu: 615, kbm: 645, pk: 585, lbi: 660, lbe: 620, pm: 603 },
        percentileRank: 84
      },
      {
        toId: 'TO-3',
        title: 'Try Out Intensif 3 (Mid-Evaluation)',
        date: '2025-01-12',
        totalScore: 658,
        subtests: { pu: 685, ppu: 640, kbm: 675, pk: 620, lbi: 690, lbe: 660, pm: 636 },
        percentileRank: 91
      },
      {
        toId: 'TO-4',
        title: 'Try Out Akbar Nasional 1',
        date: '2025-02-02',
        totalScore: 682,
        subtests: { pu: 710, ppu: 665, kbm: 700, pk: 655, lbi: 720, lbe: 680, pm: 644 },
        percentileRank: 94
      },
      {
        toId: 'TO-5',
        title: 'Try Out Intensif 4 (Speed & Accuracy)',
        date: '2025-02-23',
        totalScore: 706,
        subtests: { pu: 735, ppu: 680, kbm: 725, pk: 685, lbi: 745, lbe: 710, pm: 662 },
        percentileRank: 97
      },
      {
        toId: 'TO-6',
        title: 'Try Out Simulasi Realistis UTBK',
        date: '2025-03-15',
        totalScore: 724,
        subtests: { pu: 750, ppu: 710, kbm: 740, pk: 715, lbi: 760, lbe: 720, pm: 673 },
        percentileRank: 98
      }
    ],
    evaluations: [
      {
        subtestKey: 'pu',
        subtestName: 'Penalaran Umum',
        category: 'TPS',
        currentScore: 750,
        targetScore: 740,
        nationalAverage: 554,
        status: 'Aman',
        accuracyRate: 88,
        strengths: [
          'Penguasaan silogisme logika formal dan penalaran deduktif sangat solid',
          'Cepat menganalisis argumen sebab-akibat pada teks kompleks'
        ],
        weaknesses: [
          'Terkadang kurang teliti pada pola barisan angka campuran non-linear'
        ],
        recommendations: [
          'Pertahankan kecepatan saat ini, biasakan latihan pola angka berbasis tabel'
        ]
      },
      {
        subtestKey: 'ppu',
        subtestName: 'Pengetahuan & Pemahaman Umum',
        category: 'TPS',
        currentScore: 710,
        targetScore: 710,
        nationalAverage: 528,
        status: 'Aman',
        accuracyRate: 82,
        strengths: [
          'Kosakata serapan dan istilah kontekstual dipahami dengan sangat baik',
          'Kemampuan menentukan gagasan utama teks dalam waktu singkat'
        ],
        weaknesses: [
          'Masih sering terkecoh pada pertanyaan implikasi kalimat'
        ],
        recommendations: [
          'Perbanyak membaca artikel jurnal ilmiah populer tempo dan kompas'
        ]
      },
      {
        subtestKey: 'kbm',
        subtestName: 'Kemampuan Memahami Bacaan & Menulis',
        category: 'TPS',
        currentScore: 740,
        targetScore: 730,
        nationalAverage: 542,
        status: 'Aman',
        accuracyRate: 86,
        strengths: [
          'Penguasaan EYD V, konjungsi antarkalimat, dan pembentukan kata baku prima',
          'Sangat akurat dalam memperbaiki kalimat tidak efektif'
        ],
        weaknesses: [
          'Analisis koherensi paragraf berukuran panjang memerlukan waktu sedikit lebih lama'
        ],
        recommendations: [
          'Latihan skimming paragraf 300+ kata untuk efisiensi waktu pengerjaan'
        ]
      },
      {
        subtestKey: 'pk',
        subtestName: 'Pengetahuan Kuantitatif',
        category: 'TPS',
        currentScore: 715,
        targetScore: 720,
        nationalAverage: 512,
        status: 'Waspada',
        accuracyRate: 78,
        strengths: [
          'Aljabar dasar, persamaan linear, dan aritmetika sosial mantap',
          'Soal tipe kecukupan data (1) dan (2) sudah terbiasa dengan baik'
        ],
        weaknesses: [
          'Geometri analitik bangun ruang dan fungsi kuadrat masih sering ragu',
          'Kecepatan rata-rata 65 detik/soal (target bimbel: ≤ 50 detik/soal)'
        ],
        recommendations: [
          'Drilling 50 soal geometri transformasi dan bangun ruang tipe UTBK 2023-2024'
        ]
      },
      {
        subtestKey: 'lbi',
        subtestName: 'Literasi Bahasa Indonesia',
        category: 'Literasi',
        currentScore: 760,
        targetScore: 730,
        nationalAverage: 560,
        status: 'Aman',
        accuracyRate: 91,
        strengths: [
          'Pemahaman teks argumentatif dan infografis statistik sangat tajam',
          'Akurasi pengerjaan soal kesimpulan teks mencapai 94%'
        ],
        weaknesses: [
          'Teks sastra alegori kadang butuh pembacaan ulang'
        ],
        recommendations: [
          'Pertahankan ritme membaca, alokasikan sisa waktu untuk cek jawaban ragu'
        ]
      },
      {
        subtestKey: 'lbe',
        subtestName: 'Literasi Bahasa Inggris',
        category: 'Literasi',
        currentScore: 720,
        targetScore: 710,
        nationalAverage: 518,
        status: 'Aman',
        accuracyRate: 84,
        strengths: [
          'Inference dan identifying tone/attitude author terjawab dengan tepat',
          'Vocabulary academic dan connectives dikuasai dengan baik'
        ],
        weaknesses: [
          'Kecepatan pengerjaan di 5 soal terakhir teks sains ilmiah menurun'
        ],
        recommendations: [
          'Biasakan membaca 1 artikel New York Times / Scientific American per hari'
        ]
      },
      {
        subtestKey: 'pm',
        subtestName: 'Penalaran Matematika',
        category: 'Literasi',
        currentScore: 673,
        targetScore: 710,
        nationalAverage: 508,
        status: 'Waspada',
        accuracyRate: 72,
        strengths: [
          'Pemodelan masalah optimasi biaya dan laju perubahan linier baik'
        ],
        weaknesses: [
          'Peluang kejadian majemuk bersyarat dan statistika terapan butuh pendalaman',
          'Sering terjebak narasi soal cerita panjang yang mengandung variabel distraktor'
        ],
        recommendations: [
          'Sesi konsultasi klinik intensif dengan Guru Matematika untuk materi Peluang & Statistika'
        ]
      }
    ],
    tutorNotes: [
      {
        id: 'note-1',
        date: '2025-03-16',
        tutorName: 'Kak Dimas Prasetyo, S.Si (Tutor Matematika & PK)',
        note: 'Farel sudah berhasil menembus passing grade FK UI di TO-6 (724 vs 715). Fokus 3 minggu ke depan adalah memantapkan Penalaran Matematika agar stabil di atas 700. Jangan biarkan PM menjadi titik rawan.',
        category: 'Strategi'
      },
      {
        id: 'note-2',
        date: '2025-02-25',
        tutorName: 'Kak Nabila Larasati, M.Pd (Tutor TPS & Bahasa)',
        note: 'Skor LBI & PU luar biasa stabil di atas 740. Mental pengerjaan sangat tenang, manajemen waktu sudah rapi.',
        category: 'Akademik'
      },
      {
        id: 'note-3',
        date: '2025-01-15',
        tutorName: 'Kak Rizki Firdaus (Konselor Pendidikan PTN)',
        note: 'Pilihan 1 FK UI dan Pilihan 2 Farmasi UGM sangat proporsional. Peluang kelulusan Pilihan 1 berada pada kisaran 85% dengan tren konsisten seperti ini.',
        category: 'Motivasi'
      }
    ],
    updatedAt: '2025-03-16T14:30:00Z'
  },
  {
    id: 'UTBK-2025-002',
    password: 'siswa123',
    name: 'Aisyah Putri Azzahra',
    school: 'SMA Labschool Kebayoran Jakarta',
    phone: '0813-9876-5432',
    email: 'aisyah.azzahra@example.com',
    classGroup: 'Intensif Ambis PTN 2025 - Gold Class',
    targetScore: 710,
    choice1: {
      university: 'Institut Teknologi Bandung (ITB)',
      major: 'Sekolah Teknik Elektro & Informatika (STEI)',
      passingGradeEstimate: 705,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    choice2: {
      university: 'Universitas Indonesia (UI)',
      major: 'Ilmu Komputer (Fasilkom)',
      passingGradeEstimate: 698,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    tryOuts: [
      {
        toId: 'TO-1',
        title: 'Try Out Intensif 1 (Diagnostik)',
        date: '2024-11-10',
        totalScore: 615,
        subtests: { pu: 640, ppu: 590, kbm: 605, pk: 660, lbi: 620, lbe: 645, pm: 645 },
        percentileRank: 82
      },
      {
        toId: 'TO-2',
        title: 'Try Out Intensif 2',
        date: '2024-12-05',
        totalScore: 642,
        subtests: { pu: 670, ppu: 610, kbm: 625, pk: 690, lbi: 635, lbe: 670, pm: 694 },
        percentileRank: 88
      },
      {
        toId: 'TO-3',
        title: 'Try Out Intensif 3 (Mid-Evaluation)',
        date: '2025-01-12',
        totalScore: 670,
        subtests: { pu: 695, ppu: 635, kbm: 640, pk: 725, lbi: 660, lbe: 700, pm: 735 },
        percentileRank: 93
      },
      {
        toId: 'TO-4',
        title: 'Try Out Akbar Nasional 1',
        date: '2025-02-02',
        totalScore: 695,
        subtests: { pu: 720, ppu: 650, kbm: 665, pk: 750, lbi: 685, lbe: 725, pm: 770 },
        percentileRank: 96
      },
      {
        toId: 'TO-5',
        title: 'Try Out Intensif 4 (Speed & Accuracy)',
        date: '2025-02-23',
        totalScore: 712,
        subtests: { pu: 730, ppu: 660, kbm: 675, pk: 770, lbi: 705, lbe: 740, pm: 804 },
        percentileRank: 98
      },
      {
        toId: 'TO-6',
        title: 'Try Out Simulasi Realistis UTBK',
        date: '2025-03-15',
        totalScore: 726,
        subtests: { pu: 745, ppu: 675, kbm: 690, pk: 785, lbi: 720, lbe: 755, pm: 812 },
        percentileRank: 99
      }
    ],
    evaluations: [
      {
        subtestKey: 'pu',
        subtestName: 'Penalaran Umum',
        category: 'TPS',
        currentScore: 745,
        targetScore: 710,
        nationalAverage: 554,
        status: 'Aman',
        accuracyRate: 87,
        strengths: ['Kemampuan analisis data kuantitatif luar biasa cepat'],
        weaknesses: ['Perlu ekstra waspada pada silogisme negasi ganda'],
        recommendations: ['Latihan variasi soal silogisme tipe HOTS']
      },
      {
        subtestKey: 'ppu',
        subtestName: 'Pengetahuan & Pemahaman Umum',
        category: 'TPS',
        currentScore: 675,
        targetScore: 680,
        nationalAverage: 528,
        status: 'Waspada',
        accuracyRate: 75,
        strengths: ['Identifikasi makna kontekstual istilah sains baik'],
        weaknesses: ['Pengetahuan idiom dan kata serapan arkais perlu ditambah'],
        recommendations: ['Baca modul KBBI dan latihan kata berimbuhan']
      },
      {
        subtestKey: 'kbm',
        subtestName: 'Kemampuan Memahami Bacaan & Menulis',
        category: 'TPS',
        currentScore: 690,
        targetScore: 700,
        nationalAverage: 542,
        status: 'Waspada',
        accuracyRate: 77,
        strengths: ['Penggunaan tanda baca titik koma dan petik tepat'],
        weaknesses: ['Sering keliru pada penulisan huruf kapital nama geografi'],
        recommendations: ['Review aturan EYD V bab penulisan nama geografi dan gelar']
      },
      {
        subtestKey: 'pk',
        subtestName: 'Pengetahuan Kuantitatif',
        category: 'TPS',
        currentScore: 785,
        targetScore: 750,
        nationalAverage: 512,
        status: 'Aman',
        accuracyRate: 94,
        strengths: ['Kombinatorika, fungsi aljabar, matriks, dan kalkulus dasar sempurna'],
        weaknesses: ['Hampir tidak ada, pertahankan konsistensi'],
        recommendations: ['Bantu teman sekelas di klinik belajar untuk memperkuat retensi']
      },
      {
        subtestKey: 'lbi',
        subtestName: 'Literasi Bahasa Indonesia',
        category: 'Literasi',
        currentScore: 720,
        targetScore: 700,
        nationalAverage: 560,
        status: 'Aman',
        accuracyRate: 83,
        strengths: ['Akurat menarik kesimpulan dari grafik dan tabel sosial'],
        weaknesses: ['Sedikit terburu-buru di 3 soal terakhir'],
        recommendations: ['Alokasikan 1.5 menit per soal teks wacana panjang']
      },
      {
        subtestKey: 'lbe',
        subtestName: 'Literasi Bahasa Inggris',
        category: 'Literasi',
        currentScore: 755,
        targetScore: 720,
        nationalAverage: 518,
        status: 'Aman',
        accuracyRate: 89,
        strengths: ['Skor reading comprehension sains teknologi sangat tinggi'],
        weaknesses: ['Beberapa kosakata metafora sastra klasik'],
        recommendations: ['Pertahankan, modal utama penopang skor rata-rata']
      },
      {
        subtestKey: 'pm',
        subtestName: 'Penalaran Matematika',
        category: 'Literasi',
        currentScore: 812,
        targetScore: 780,
        nationalAverage: 508,
        status: 'Aman',
        accuracyRate: 96,
        strengths: ['Salah satu peraih skor tertinggi nasional di bimbel ini'],
        weaknesses: ['Tidak ada kelemahan signifikan'],
        recommendations: ['Pertahankan konsentrasi dan stamina fisik menjelang hari H']
      }
    ],
    tutorNotes: [
      {
        id: 'note-201',
        date: '2025-03-16',
        tutorName: 'Kak Dimas Prasetyo, S.Si',
        note: 'Skor STEI ITB sudah terlampaui aman di TO-6 (726 vs 705). PM dan PK merupakan senjata utama Aisyah.',
        category: 'Akademik'
      }
    ],
    updatedAt: '2025-03-16T15:00:00Z'
  },
  {
    id: 'UTBK-2025-003',
    password: 'siswa123',
    name: 'Bintang Bagaskara',
    school: 'SMAN 3 Bandung',
    phone: '0821-4321-8765',
    email: 'bintang.bagas@example.com',
    classGroup: 'Intensif Ambis PTN 2025 - Silver Class',
    targetScore: 660,
    choice1: {
      university: 'Universitas Padjadjaran (UNPAD)',
      major: 'Ilmu Komunikasi (Fikom)',
      passingGradeEstimate: 652,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    choice2: {
      university: 'Universitas Pendidikan Indonesia (UPI)',
      major: 'Desain Komunikasi Visual',
      passingGradeEstimate: 620,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    tryOuts: [
      {
        toId: 'TO-1',
        title: 'Try Out Intensif 1 (Diagnostik)',
        date: '2024-11-10',
        totalScore: 530,
        subtests: { pu: 560, ppu: 540, kbm: 570, pk: 460, lbi: 590, lbe: 540, pm: 450 },
        percentileRank: 55
      },
      {
        toId: 'TO-2',
        title: 'Try Out Intensif 2',
        date: '2024-12-05',
        totalScore: 565,
        subtests: { pu: 590, ppu: 575, kbm: 605, pk: 490, lbi: 625, lbe: 580, pm: 490 },
        percentileRank: 67
      },
      {
        toId: 'TO-3',
        title: 'Try Out Intensif 3 (Mid-Evaluation)',
        date: '2025-01-12',
        totalScore: 598,
        subtests: { pu: 620, ppu: 610, kbm: 635, pk: 520, lbi: 655, lbe: 620, pm: 526 },
        percentileRank: 76
      },
      {
        toId: 'TO-4',
        title: 'Try Out Akbar Nasional 1',
        date: '2025-02-02',
        totalScore: 626,
        subtests: { pu: 650, ppu: 635, kbm: 660, pk: 550, lbi: 685, lbe: 645, pm: 557 },
        percentileRank: 82
      },
      {
        toId: 'TO-5',
        title: 'Try Out Intensif 4 (Speed & Accuracy)',
        date: '2025-02-23',
        totalScore: 645,
        subtests: { pu: 670, ppu: 650, kbm: 680, pk: 575, lbi: 705, lbe: 660, pm: 575 },
        percentileRank: 87
      },
      {
        toId: 'TO-6',
        title: 'Try Out Simulasi Realistis UTBK',
        date: '2025-03-15',
        totalScore: 658,
        subtests: { pu: 680, ppu: 660, kbm: 695, pk: 590, lbi: 720, lbe: 675, pm: 586 },
        percentileRank: 90
      }
    ],
    evaluations: [
      {
        subtestKey: 'pu',
        subtestName: 'Penalaran Umum',
        category: 'TPS',
        currentScore: 680,
        targetScore: 660,
        nationalAverage: 554,
        status: 'Aman',
        accuracyRate: 80,
        strengths: ['Penalaran induktif dan analisis argumen wacana mantap'],
        weaknesses: ['Perlu perbaikan pada logika posisi dan urutan bersyarat'],
        recommendations: ['Latihan tabel eliminasi untuk tipe soal logika posisi']
      },
      {
        subtestKey: 'ppu',
        subtestName: 'Pengetahuan & Pemahaman Umum',
        category: 'TPS',
        currentScore: 660,
        targetScore: 650,
        nationalAverage: 528,
        status: 'Aman',
        accuracyRate: 78,
        strengths: ['Kemampuan pemaknaan idiom sosial dan konotasi kata baik'],
        weaknesses: ['Perlu memperluas perbendaharaan kata serapan baku'],
        recommendations: ['Flashcard kosakata 10 kata per hari']
      },
      {
        subtestKey: 'kbm',
        subtestName: 'Kemampuan Memahami Bacaan & Menulis',
        category: 'TPS',
        currentScore: 695,
        targetScore: 680,
        nationalAverage: 542,
        status: 'Aman',
        accuracyRate: 82,
        strengths: ['Kekuatan utama Bintang ada di pemahaman teks dan ejaan bahasa'],
        weaknesses: ['Penataan paragraf rumpang sesekali ragu'],
        recommendations: ['Kupas pola kalimat baku Subjek-Predikat']
      },
      {
        subtestKey: 'pk',
        subtestName: 'Pengetahuan Kuantitatif',
        category: 'TPS',
        currentScore: 590,
        targetScore: 630,
        nationalAverage: 512,
        status: 'Kritis',
        accuracyRate: 64,
        strengths: ['Statistika deskriptif (mean, median, modus) cukup baik'],
        weaknesses: ['Kerap bingung rumus geometri ruang dan eksponen'],
        recommendations: ['Ikuti klinik matrikulasi rumus dasar matematika setiap Sabtu pagi']
      },
      {
        subtestKey: 'lbi',
        subtestName: 'Literasi Bahasa Indonesia',
        category: 'Literasi',
        currentScore: 720,
        targetScore: 690,
        nationalAverage: 560,
        status: 'Aman',
        accuracyRate: 85,
        strengths: ['Analisis wacana opini publik dan berita sangat kuat'],
        weaknesses: ['Terkadang terlalu cepat menyimpulkan tanpa cek bukti teks'],
        recommendations: ['Garis bawahi bukti kalimat kunci sebelum memilih opsi']
      },
      {
        subtestKey: 'lbe',
        subtestName: 'Literasi Bahasa Inggris',
        category: 'Literasi',
        currentScore: 675,
        targetScore: 650,
        nationalAverage: 518,
        status: 'Aman',
        accuracyRate: 79,
        strengths: ['Main idea dan factual information aman'],
        weaknesses: ['Author attitude dan inferential vocabulary'],
        recommendations: ['Latihan reading passage bertema sosiologi dan seni']
      },
      {
        subtestKey: 'pm',
        subtestName: 'Penalaran Matematika',
        category: 'Literasi',
        currentScore: 586,
        targetScore: 630,
        nationalAverage: 508,
        status: 'Kritis',
        accuracyRate: 62,
        strengths: ['Soal pemodelan perbandingan senilai dapat diselesaikan'],
        weaknesses: ['Soal cerita multi-tahap dan laju persentase majemuk'],
        recommendations: ['Fokus amankan soal berbobot mudah-sedang terlebih dahulu']
      }
    ],
    tutorNotes: [
      {
        id: 'note-301',
        date: '2025-03-16',
        tutorName: 'Kak Rizki Firdaus',
        note: 'Skor TO-6 sudah 658, melewati passing grade UNPAD Ilkom (652)! Dorong sedikit lagi di PK dan PM agar makin kokoh.',
        category: 'Strategi'
      }
    ],
    updatedAt: '2025-03-16T16:00:00Z'
  },
  {
    id: 'UTBK-2025-004',
    password: 'siswa123',
    name: 'Daffa Raditya Pratama',
    school: 'SMAN 8 Jakarta',
    phone: '0811-2233-4455',
    email: 'daffa.raditya@example.com',
    classGroup: 'Intensif Ambis PTN 2025 - Gold Class',
    targetScore: 695,
    choice1: {
      university: 'Universitas Gadjah Mada (UGM)',
      major: 'Teknik Sipil',
      passingGradeEstimate: 675,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    choice2: {
      university: 'Institut Teknologi Sepuluh Nopember (ITS)',
      major: 'Teknik Lingkungan',
      passingGradeEstimate: 645,
      degree: 'S1',
      accreditation: 'Unggul'
    },
    tryOuts: [
      {
        toId: 'TO-1',
        title: 'Try Out Intensif 1 (Diagnostik)',
        date: '2024-11-10',
        totalScore: 580,
        subtests: { pu: 600, ppu: 550, kbm: 590, pk: 620, lbi: 610, lbe: 560, pm: 530 },
        percentileRank: 74
      },
      {
        toId: 'TO-2',
        title: 'Try Out Intensif 2',
        date: '2024-12-05',
        totalScore: 610,
        subtests: { pu: 630, ppu: 580, kbm: 610, pk: 655, lbi: 635, lbe: 590, pm: 570 },
        percentileRank: 81
      },
      {
        toId: 'TO-3',
        title: 'Try Out Intensif 3 (Mid-Evaluation)',
        date: '2025-01-12',
        totalScore: 640,
        subtests: { pu: 660, ppu: 610, kbm: 635, pk: 685, lbi: 660, lbe: 620, pm: 610 },
        percentileRank: 87
      },
      {
        toId: 'TO-4',
        title: 'Try Out Akbar Nasional 1',
        date: '2025-02-02',
        totalScore: 668,
        subtests: { pu: 685, ppu: 630, kbm: 655, pk: 715, lbi: 685, lbe: 655, pm: 651 },
        percentileRank: 92
      },
      {
        toId: 'TO-5',
        title: 'Try Out Intensif 4 (Speed & Accuracy)',
        date: '2025-02-23',
        totalScore: 688,
        subtests: { pu: 705, ppu: 650, kbm: 675, pk: 735, lbi: 705, lbe: 675, pm: 671 },
        percentileRank: 95
      },
      {
        toId: 'TO-6',
        title: 'Try Out Simulasi Realistis UTBK',
        date: '2025-03-15',
        totalScore: 702,
        subtests: { pu: 720, ppu: 665, kbm: 690, pk: 750, lbi: 720, lbe: 690, pm: 679 },
        percentileRank: 96
      }
    ],
    evaluations: [
      {
        subtestKey: 'pu',
        subtestName: 'Penalaran Umum',
        category: 'TPS',
        currentScore: 720,
        targetScore: 700,
        nationalAverage: 554,
        status: 'Aman',
        accuracyRate: 84,
        strengths: ['Analisis hubungan sebab akibat dan silogisme sangat baik'],
        weaknesses: ['Perlu ketelitian ekstra saat membaca tabel statistik'],
        recommendations: ['Latihan 10 soal penalaran kuantitatif analitik per hari']
      },
      {
        subtestKey: 'ppu',
        subtestName: 'Pengetahuan & Pemahaman Umum',
        category: 'TPS',
        currentScore: 665,
        targetScore: 680,
        nationalAverage: 528,
        status: 'Waspada',
        accuracyRate: 74,
        strengths: ['Kosakata umum sains dan istilah teknik sangat baik'],
        weaknesses: ['Sinonim dan antonim kata baku serapan'],
        recommendations: ['Pelajari kumpulan daftar kata baku EYD V']
      },
      {
        subtestKey: 'kbm',
        subtestName: 'Kemampuan Memahami Bacaan & Menulis',
        category: 'TPS',
        currentScore: 690,
        targetScore: 690,
        nationalAverage: 542,
        status: 'Aman',
        accuracyRate: 79,
        strengths: ['Koreksi kalimat mubazir dan tanda baca koma'],
        weaknesses: ['Kohesi antarkalimat pada teks panjang'],
        recommendations: ['Fokus latihan menentukan kalimat utama paragraf']
      },
      {
        subtestKey: 'pk',
        subtestName: 'Pengetahuan Kuantitatif',
        category: 'TPS',
        currentScore: 750,
        targetScore: 720,
        nationalAverage: 512,
        status: 'Aman',
        accuracyRate: 88,
        strengths: ['Geometri analitik, trigonometri dasar, dan aljabar mantap'],
        weaknesses: ['Kadang tergesa-gesa menghitung operasi pecahan bertingkat'],
        recommendations: ['Pertahankan, salah satu kekuatan terbesar Daffa']
      },
      {
        subtestKey: 'lbi',
        subtestName: 'Literasi Bahasa Indonesia',
        category: 'Literasi',
        currentScore: 720,
        targetScore: 700,
        nationalAverage: 560,
        status: 'Aman',
        accuracyRate: 84,
        strengths: ['Kecepatan membaca teks ilmiah teknik sangat tinggi'],
        weaknesses: ['Sedikit kurang fokus saat menjumpai teks bertema sastra/sejarah'],
        recommendations: ['Perbanyak variasi wacana lintas disiplin ilmu']
      },
      {
        subtestKey: 'lbe',
        subtestName: 'Literasi Bahasa Inggris',
        category: 'Literasi',
        currentScore: 690,
        targetScore: 690,
        nationalAverage: 518,
        status: 'Aman',
        accuracyRate: 80,
        strengths: ['Vocabulary engineering and physical science kuat'],
        weaknesses: ['Questions regarding author implied perspective'],
        recommendations: ['Review strategi skimming & scanning topik non-teknik']
      },
      {
        subtestKey: 'pm',
        subtestName: 'Penalaran Matematika',
        category: 'Literasi',
        currentScore: 679,
        targetScore: 700,
        nationalAverage: 508,
        status: 'Waspada',
        accuracyRate: 75,
        strengths: ['Pemodelan fungsi linear dan sistem persamaan linear'],
        weaknesses: ['Peluang kejadian saling lepas dan eksponensial'],
        recommendations: ['Fokus drilling materi Peluang & Statistika terapan']
      }
    ],
    tutorNotes: [
      {
        id: 'note-401',
        date: '2025-03-16',
        tutorName: 'Kak Dimas Prasetyo, S.Si',
        note: 'Skor total 702 sudah mengamankan Pilihan 1 Teknik Sipil UGM (675). Tinggal menstabilkan PM.',
        category: 'Strategi'
      }
    ],
    updatedAt: '2025-03-16T16:15:00Z'
  }
];

export const INITIAL_HOST: { id: string; name: string; role: 'host'; institution: string } = {
  id: 'HOST-ADMIN',
  name: 'Rumah Belajar TESLA',
  role: 'host',
  institution: 'Rumah Belajar TESLA - Bimbingan Sukses PTN'
};
