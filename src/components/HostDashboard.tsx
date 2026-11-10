import React, { useState, useRef, useEffect } from 'react';
import { Student, TryOutResult, SubtestScoreMap, TutorNote, SubtestKey, PortalUiSettings } from '../types/utbk';
import { SUBTEST_DEFINITIONS, NATIONAL_AVERAGES } from '../data/utbkMeta';
import { recalculateEvaluations, createNewStudent, resetToDefaultData, DEFAULT_UI_SETTINGS } from '../utils/storage';
import { 
  Users, 
  Upload, 
  PlusCircle, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  Search, 
  Download, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Award, 
  TrendingUp, 
  School, 
  AlertCircle,
  FileSpreadsheet,
  MessageSquarePlus,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Wand2,
  Bot,
  Pencil,
  Layers,
  Sliders,
  Check,
  ListChecks,
  History,
  ClipboardEdit
} from 'lucide-react';
import { AiDataEditorModal } from './AiDataEditorModal';
import { EditStudentModal } from './EditStudentModal';
import { PortalSettingsModal } from './PortalSettingsModal';

interface HostDashboardProps {
  students: Student[];
  onUpdateStudents: (newStudents: Student[]) => void;
  onViewStudent: (studentId: string) => void;
  onPrintStudentReport: (student: Student) => void;
  activeHostTab: string;
  onHostTabChange: (tab: string) => void;
  uiSettings?: PortalUiSettings;
  onUpdateUiSettings?: (settings: PortalUiSettings) => void;
}

export const HostDashboard: React.FC<HostDashboardProps> = ({
  students,
  onUpdateStudents,
  onViewStudent,
  onPrintStudentReport,
  activeHostTab,
  onHostTabChange,
  uiSettings = DEFAULT_UI_SETTINGS,
  onUpdateUiSettings
}) => {
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSING' | 'NEED_HELP'>('ALL');
  const [classFilter, setClassFilter] = useState<string>('ALL');

  // Edit Student State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // UI Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Tab 2: Progress & Score Mode (Sub-Tabs)
  const [scoreSubTab, setScoreSubTab] = useState<'new-to' | 'history-to' | 'edit-eval'>('new-to');

  // Input Score State (New TO)
  const [selectedStudentForScore, setSelectedStudentForScore] = useState<string>(
    students[0]?.id || ''
  );
  const [toTitle, setToTitle] = useState('Try Out Intensif 7');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [scores, setScores] = useState<SubtestScoreMap>({
    pu: 730,
    ppu: 690,
    kbm: 720,
    pk: 710,
    lbi: 740,
    lbe: 700,
    pm: 680
  });
  const [scoreSuccessMsg, setScoreSuccessMsg] = useState('');

  // Edit Existing TO State
  const studentForScore = students.find((s) => s.id === selectedStudentForScore) || students[0];
  const [selectedToId, setSelectedToId] = useState<string>('');
  const [editToTitle, setEditToTitle] = useState('');
  const [editToDate, setEditToDate] = useState('');
  const [editToScores, setEditToScores] = useState<SubtestScoreMap>({
    pu: 650,
    ppu: 650,
    kbm: 650,
    pk: 650,
    lbi: 650,
    lbe: 650,
    pm: 650
  });

  // Edit Subtest Evaluation State
  const [selectedEvalSubtest, setSelectedEvalSubtest] = useState<SubtestKey>('pu');
  const [evalStatus, setEvalStatus] = useState<'Aman' | 'Waspada' | 'Kritis'>('Aman');
  const [evalAccuracy, setEvalAccuracy] = useState<number>(75);
  const [evalStrengthsText, setEvalStrengthsText] = useState('');
  const [evalWeaknessesText, setEvalWeaknessesText] = useState('');
  const [evalRecommendationsText, setEvalRecommendationsText] = useState('');
  const [evalSuccessMsg, setEvalSuccessMsg] = useState('');

  // Sync when studentForScore changes for TO history
  useEffect(() => {
    if (studentForScore && studentForScore.tryOuts.length > 0) {
      const targetTo = studentForScore.tryOuts.find((t) => t.toId === selectedToId) || studentForScore.tryOuts[studentForScore.tryOuts.length - 1];
      if (targetTo) {
        setSelectedToId(targetTo.toId);
        setEditToTitle(targetTo.title);
        setEditToDate(targetTo.date);
        setEditToScores({ ...targetTo.subtests });
      }
    }
  }, [selectedStudentForScore, studentForScore]);

  // Sync evaluation text when student or subtest changes
  useEffect(() => {
    if (!studentForScore) return;
    const ev = (studentForScore.evaluations || []).find((e) => e.subtestKey === selectedEvalSubtest);
    if (ev) {
      setEvalStatus(ev.status);
      setEvalAccuracy(ev.accuracyRate || 75);
      setEvalStrengthsText(ev.strengths?.join('\n') || '');
      setEvalWeaknessesText(ev.weaknesses?.join('\n') || '');
      setEvalRecommendationsText(ev.recommendations?.join('\n') || '');
    } else {
      setEvalStatus('Aman');
      setEvalAccuracy(75);
      setEvalStrengthsText('Penguasaan konsep dasar sudah baik.');
      setEvalWeaknessesText('Tingkatkan kecepatan analisis soal HOTS.');
      setEvalRecommendationsText('Latihan berkala dengan simulasi waktu.');
    }
  }, [selectedStudentForScore, selectedEvalSubtest, studentForScore]);

  // Add Student Form State
  const [newStudentData, setNewStudentData] = useState({
    id: `UTBK-2025-00${students.length + 1}`,
    name: '',
    school: '',
    targetScore: 700,
    classGroup: 'Intensif Ambis PTN 2025 - Gold Class',
    choice1Univ: 'Universitas Indonesia (UI)',
    choice1Major: 'Ilmu Hukum',
    choice1Pass: 675,
    choice2Univ: 'Universitas Gadjah Mada (UGM)',
    choice2Major: 'Ilmu Hubungan Internasional',
    choice2Pass: 660
  });
  const [addStudentSuccess, setAddStudentSuccess] = useState('');

  // Batch Upload State
  const [rawJsonText, setRawJsonText] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<{ status: 'idle' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tutor Note State - Extended with Edit Mode
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<string>(
    students[0]?.id || ''
  );
  const [tutorName, setTutorName] = useState('Kak Dimas Prasetyo, S.Si');
  const [noteCategory, setNoteCategory] = useState<'Akademik' | 'Strategi' | 'Motivasi'>('Strategi');
  const [noteContent, setNoteContent] = useState('');
  const [noteSuccess, setNoteSuccess] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // AI Data Assistant State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSuccessToast, setAiSuccessToast] = useState('');

  const handleAiApplyChanges = (updatedStudents: Student[], summary: string) => {
    onUpdateStudents(updatedStudents);
    setAiSuccessToast(summary || 'Data siswa berhasil diperbarui oleh AI!');
    setTimeout(() => setAiSuccessToast(''), 6000);
  };

  // Aggregated analytics
  const totalStudents = students.length;
  const averageClassScore = Math.round(
    students.reduce((acc, s) => {
      const latest = s.tryOuts[s.tryOuts.length - 1];
      return acc + (latest ? latest.totalScore : 0);
    }, 0) / (totalStudents || 1)
  );
  const passingStudents = students.filter((s) => {
    const latest = s.tryOuts[s.tryOuts.length - 1];
    return latest && latest.totalScore >= s.choice1.passingGradeEstimate;
  });
  const passingRate = Math.round((passingStudents.length / (totalStudents || 1)) * 100);

  // Unique class types for filter
  const uniqueClassTypes = Array.from(new Set(students.map((s) => s.classGroup))).filter(Boolean);

  // Filtered Students for Table
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.classGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.choice1.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.choice1.major.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = classFilter === 'ALL' || s.classGroup === classFilter;
    if (!matchesClass) return false;

    const latest = s.tryOuts[s.tryOuts.length - 1];
    const isPassing = latest ? latest.totalScore >= s.choice1.passingGradeEstimate : false;

    if (statusFilter === 'PASSING') return matchesSearch && isPassing;
    if (statusFilter === 'NEED_HELP') return matchesSearch && !isPassing;
    return matchesSearch;
  });

  // Handle Score Input Submit
  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForScore) return;

    const subtestValues = Object.values(scores);
    const calculatedAverage = Math.round(
      subtestValues.reduce((a, b) => a + b, 0) / subtestValues.length
    );

    const newTO: TryOutResult = {
      toId: `TO-${Date.now()}`,
      title: toTitle,
      date: toDate,
      totalScore: calculatedAverage,
      subtests: { ...scores },
      percentileRank: Math.min(99, Math.max(50, Math.round((calculatedAverage / 850) * 100)))
    };

    const updated = students.map((s) => {
      if (s.id === selectedStudentForScore) {
        const updatedStudent: Student = {
          ...s,
          tryOuts: [...s.tryOuts, newTO]
        };
        return recalculateEvaluations(updatedStudent);
      }
      return s;
    });

    onUpdateStudents(updated);
    setScoreSuccessMsg(`Berhasil menambahkan skor ${toTitle} (Rata-rata: ${calculatedAverage}) untuk siswa!`);
    setTimeout(() => setScoreSuccessMsg(''), 4000);
  };

  // Handle Add Student
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name || !newStudentData.school) {
      alert('Nama dan Asal Sekolah wajib diisi');
      return;
    }

    const created = createNewStudent({
      id: newStudentData.id,
      name: newStudentData.name,
      school: newStudentData.school,
      targetScore: Number(newStudentData.targetScore),
      classGroup: newStudentData.classGroup,
      choice1: {
        university: newStudentData.choice1Univ,
        major: newStudentData.choice1Major,
        passingGradeEstimate: Number(newStudentData.choice1Pass),
        degree: 'S1',
        accreditation: 'Unggul'
      },
      choice2: {
        university: newStudentData.choice2Univ,
        major: newStudentData.choice2Major,
        passingGradeEstimate: Number(newStudentData.choice2Pass),
        degree: 'S1',
        accreditation: 'Unggul'
      }
    });

    onUpdateStudents([created, ...students]);
    setAddStudentSuccess(`Siswa ${created.name} (${created.id}) berhasil didaftarkan!`);
    setNewStudentData({
      id: `UTBK-2025-00${students.length + 2}`,
      name: '',
      school: '',
      targetScore: 700,
      classGroup: 'Intensif Ambis PTN 2025 - Gold Class',
      choice1Univ: 'Universitas Indonesia (UI)',
      choice1Major: 'Ilmu Hukum',
      choice1Pass: 675,
      choice2Univ: 'Universitas Gadjah Mada (UGM)',
      choice2Major: 'Ilmu Hubungan Internasional',
      choice2Pass: 660
    });
    setTimeout(() => setAddStudentSuccess(''), 4000);
  };

  // Handle selecting an existing TO to edit
  const handleSelectToForEdit = (toId: string) => {
    setSelectedToId(toId);
    if (!studentForScore) return;
    const targetTo = studentForScore.tryOuts.find((t) => t.toId === toId);
    if (targetTo) {
      setEditToTitle(targetTo.title);
      setEditToDate(targetTo.date);
      setEditToScores({ ...targetTo.subtests });
    }
  };

  // Handle Edit Existing TO Submit
  const handleEditExistingToSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForScore || !selectedToId) return;

    const subtestValues = Object.values(editToScores);
    const calculatedAverage = Math.round(
      subtestValues.reduce((a, b) => a + b, 0) / subtestValues.length
    );

    const updated = students.map((s) => {
      if (s.id === selectedStudentForScore) {
        const updatedTOs = s.tryOuts.map((to) => {
          if (to.toId === selectedToId) {
            return {
              ...to,
              title: editToTitle,
              date: editToDate,
              totalScore: calculatedAverage,
              subtests: { ...editToScores },
              percentileRank: Math.min(99, Math.max(50, Math.round((calculatedAverage / 850) * 100)))
            };
          }
          return to;
        });

        const updatedStudent: Student = {
          ...s,
          tryOuts: updatedTOs
        };
        return recalculateEvaluations(updatedStudent);
      }
      return s;
    });

    onUpdateStudents(updated);
    setScoreSuccessMsg(`Berhasil memperbarui nilai "${editToTitle}" (Rata-rata baru: ${calculatedAverage})!`);
    setTimeout(() => setScoreSuccessMsg(''), 4000);
  };

  // Handle Delete TO
  const handleDeleteExistingTo = (toIdToDelete: string) => {
    const student = students.find((s) => s.id === selectedStudentForScore);
    if (!student) return;
    if (student.tryOuts.length <= 1) {
      alert('Siswa harus memiliki minimal 1 riwayat Try Out.');
      return;
    }
    if (confirm('Yakin ingin menghapus data Try Out ini dari riwayat siswa?')) {
      const updated = students.map((s) => {
        if (s.id === selectedStudentForScore) {
          const updatedStudent: Student = {
            ...s,
            tryOuts: s.tryOuts.filter((to) => to.toId !== toIdToDelete)
          };
          return recalculateEvaluations(updatedStudent);
        }
        return s;
      });
      onUpdateStudents(updated);
      setScoreSuccessMsg('Data riwayat Try Out berhasil dihapus!');
      setTimeout(() => setScoreSuccessMsg(''), 3000);
    }
  };

  // Handle Save Subtest Evaluation
  const handleSaveSubtestEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForScore) return;

    const parseLines = (text: string) =>
      text
        .split('\n')
        .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
        .filter((l) => l.length > 0);

    const updated = students.map((s) => {
      if (s.id === selectedStudentForScore) {
        const evals = s.evaluations || [];
        const existingIdx = evals.findIndex((e) => e.subtestKey === selectedEvalSubtest);
        const meta = SUBTEST_DEFINITIONS[selectedEvalSubtest];

        const updatedEval = {
          subtestKey: selectedEvalSubtest,
          subtestName: meta.name,
          category: meta.category,
          currentScore: (evals[existingIdx]?.currentScore) || 600,
          targetScore: (evals[existingIdx]?.targetScore) || Math.round(s.targetScore * 0.98),
          nationalAverage: (evals[existingIdx]?.nationalAverage) || 530,
          status: evalStatus,
          accuracyRate: evalAccuracy,
          strengths: parseLines(evalStrengthsText),
          weaknesses: parseLines(evalWeaknessesText),
          recommendations: parseLines(evalRecommendationsText)
        };

        let newEvals;
        if (existingIdx >= 0) {
          newEvals = [...evals];
          newEvals[existingIdx] = updatedEval;
        } else {
          newEvals = [...evals, updatedEval];
        }

        return {
          ...s,
          evaluations: newEvals,
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    onUpdateStudents(updated);
    setEvalSuccessMsg(`Evaluasi subtest ${SUBTEST_DEFINITIONS[selectedEvalSubtest].name} berhasil disimpan!`);
    setTimeout(() => setEvalSuccessMsg(''), 4000);
  };

  // Reset Subtest Evaluation to standard template
  const handleResetSubtestEvaluationToDefault = () => {
    if (!studentForScore) return;
    const meta = SUBTEST_DEFINITIONS[selectedEvalSubtest];
    setEvalStatus('Aman');
    setEvalAccuracy(78);
    setEvalStrengthsText(`Penguasaan materi konsep ${meta.shortName} sudah cukup konsisten.`);
    setEvalWeaknessesText(`Tingkatkan kecepatan analisis soal bertipe analitis dan variasi baru.`);
    setEvalRecommendationsText(`Perbanyak latihan soal paket 20 soal dengan batas waktu ${meta.durationMinutes} menit.`);
  };

  // Handle Add or Edit Tutor Note
  const handleAddTutorNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim() || !selectedStudentForNote) return;

    if (editingNoteId) {
      // Update existing note
      const updated = students.map((s) => {
        if (s.id === selectedStudentForNote) {
          return {
            ...s,
            tutorNotes: (s.tutorNotes || []).map((n) =>
              n.id === editingNoteId
                ? {
                    ...n,
                    tutorName,
                    category: noteCategory,
                    note: noteContent.trim()
                  }
                : n
            )
          };
        }
        return s;
      });

      onUpdateStudents(updated);
      setNoteSuccess('Catatan mentor berhasil diperbarui!');
      setEditingNoteId(null);
      setNoteContent('');
      setTimeout(() => setNoteSuccess(''), 4000);
    } else {
      // Create new note
      const newNote: TutorNote = {
        id: `note-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        tutorName,
        note: noteContent.trim(),
        category: noteCategory
      };

      const updated = students.map((s) => {
        if (s.id === selectedStudentForNote) {
          return {
            ...s,
            tutorNotes: [newNote, ...(s.tutorNotes || [])]
          };
        }
        return s;
      });

      onUpdateStudents(updated);
      setNoteSuccess('Catatan evaluasi bimbingan baru berhasil disimpan!');
      setNoteContent('');
      setTimeout(() => setNoteSuccess(''), 4000);
    }
  };

  const handleStartEditNote = (note: TutorNote) => {
    setEditingNoteId(note.id);
    setTutorName(note.tutorName);
    setNoteCategory(note.category);
    setNoteContent(note.note);
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setNoteContent('');
  };

  const handleDeleteTutorNote = (noteId: string) => {
    if (confirm('Yakin ingin menghapus catatan mentor ini?')) {
      const updated = students.map((s) => {
        if (s.id === selectedStudentForNote) {
          return {
            ...s,
            tutorNotes: (s.tutorNotes || []).filter((n) => n.id !== noteId)
          };
        }
        return s;
      });
      onUpdateStudents(updated);
      if (editingNoteId === noteId) {
        setEditingNoteId(null);
        setNoteContent('');
      }
      setNoteSuccess('Catatan mentor berhasil dihapus!');
      setTimeout(() => setNoteSuccess(''), 3000);
    }
  };

  // Delete Student
  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (confirm(`Yakin ingin menghapus data siswa ${studentName}?`)) {
      const updated = students.filter((s) => s.id !== studentId);
      onUpdateStudents(updated);
    }
  };

  // Handle CSV/JSON File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const processed = parsed.map((item) => createNewStudent(item));
            onUpdateStudents([...processed, ...students]);
            setUploadFeedback({
              status: 'success',
              message: `Berhasil mengimpor ${processed.length} data siswa dari file JSON!`
            });
          } else {
            throw new Error('Format JSON harus berupa Array objek siswa.');
          }
        } else if (file.name.endsWith('.csv')) {
          // Parse CSV lines
          const lines = text.split('\n').filter((l) => l.trim().length > 0);
          if (lines.length <= 1) throw new Error('File CSV kosong atau tidak ada baris data.');

          const newStudentsList: Student[] = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
            if (cols.length >= 4) {
              const [id, name, school, targetScore, univ1, major1, pass1] = cols;
              newStudentsList.push(
                createNewStudent({
                  id: id || `UTBK-CSV-${i}`,
                  name: name || `Siswa CSV ${i}`,
                  school: school || 'SMA',
                  targetScore: Number(targetScore) || 680,
                  choice1: {
                    university: univ1 || 'Universitas Indonesia',
                    major: major1 || 'Ilmu Komputer',
                    passingGradeEstimate: Number(pass1) || 680,
                    degree: 'S1',
                    accreditation: 'Unggul'
                  }
                })
              );
            }
          }

          if (newStudentsList.length > 0) {
            onUpdateStudents([...newStudentsList, ...students]);
            setUploadFeedback({
              status: 'success',
              message: `Berhasil mengimpor ${newStudentsList.length} data siswa dari file CSV!`
            });
          } else {
            throw new Error('Tidak ada baris data valid yang terbaca dari CSV.');
          }
        } else {
          throw new Error('Hanya mendukung file .csv atau .json');
        }
      } catch (err: any) {
        setUploadFeedback({
          status: 'error',
          message: `Gagal membaca file: ${err.message || 'Format tidak valid'}`
        });
      }
    };
    reader.readAsText(file);
  };

  // Download Templates
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      'ID,Nama,AsalSekolah,TargetSkor,KampusPilihan1,JurusanPilihan1,PassingGrade1\n' +
      'UTBK-2025-010,"Reza Aditya","SMAN 3 Yogyakarta",710,"Universitas Indonesia","Teknik Industri",685\n' +
      'UTBK-2025-011,"Tiara Ananda","SMAN 70 Jakarta",680,"Universitas Padjadjaran","Manajemen",660';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_siswa_utbk.csv';
    link.click();
  };

  const handleDownloadJsonBackup = () => {
    const blob = new Blob([JSON.stringify(students, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_siswa_utbk_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke data simulasi default?')) {
      const reset = resetToDefaultData();
      onUpdateStudents(reset);
      alert('Data siswa berhasil direset ke pengaturan awal!');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. HOST HERO & CLASS ANALYTICS */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src="/assets/aistudio/Dokumen_dari_RNA__1__5243d24d.png"
                  alt="Logo Rumah Belajar Tesla"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[11px] font-bold mb-1">
                  RUMAH BELAJAR TESLA · Bimbingan Sukses PTN
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                  Dashboard Monitoring Angkatan Intensif UTBK
                </h1>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Pusat Kendali Pengajar · Manajemen Data Siswa & Tipe Kelas
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="px-3.5 py-2 text-xs font-black bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-xl hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md border border-white/20"
                title="Atur Tema Warna, Visibilitas Modul Siswa & Kop Rapor"
              >
                <Sliders className="w-4 h-4 text-amber-300" />
                <span>Pengaturan UI/UX</span>
              </button>
              <button
                onClick={() => setShowAiModal(true)}
                className="px-4 py-2 text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 rounded-xl hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                title="Buka AI Assistant untuk mengedit dan mengunggah data siswa"
              >
                <Sparkles className="w-4 h-4 text-emerald-900" />
                <span>AI Data Editor</span>
                <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                  Gemini
                </span>
              </button>
              <button
                onClick={handleDownloadJsonBackup}
                className="px-3.5 py-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Download Backup JSON"
              >
                <Download className="w-3.5 h-3.5" />
                Backup Data
              </button>
              <button
                onClick={handleResetData}
                className="px-3.5 py-2 text-xs font-bold bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-400/30 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Reset Data ke Default"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Demo
              </button>
            </div>
          </div>

          {aiSuccessToast && (
            <div className="mt-4 p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs font-bold text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{aiSuccessToast}</span>
            </div>
          )}

          {/* 4 Analytics Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-slate-800/70 p-4 rounded-2xl border border-white/5">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Total Siswa Bimbingan</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                  {totalStudents}
                </span>
                <span className="text-xs text-slate-300">Siswa Aktif</span>
              </div>
            </div>

            <div className="bg-slate-800/70 p-4 rounded-2xl border border-white/5">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Rata-rata Skor Angkatan</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono tabular-nums">
                  {averageClassScore}
                </span>
                <span className="text-xs text-slate-300">/ 850</span>
              </div>
            </div>

            <div className="bg-slate-800/70 p-4 rounded-2xl border border-white/5">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Tembus Pilihan 1</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tabular-nums">
                  {passingRate}%
                </span>
                <span className="text-xs text-emerald-400 font-bold">
                  {passingStudents.length} Siswa
                </span>
              </div>
            </div>

            <div className="bg-slate-800/70 p-4 rounded-2xl border border-white/5">
              <span className="text-xs text-slate-400 font-semibold block mb-1">Skor Tertinggi TO-6</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tabular-nums">
                  {Math.max(...students.map((s) => s.tryOuts[s.tryOuts.length - 1]?.totalScore || 0))}
                </span>
                <span className="text-xs text-slate-300">Rekor</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS FOR HOST */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={() => onHostTabChange('students')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeHostTab === 'students'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Daftar Siswa & Laporan ({students.length})
        </button>

        <button
          onClick={() => onHostTabChange('input-score')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeHostTab === 'input-score'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Input Skor TO Baru
        </button>

        <button
          onClick={() => onHostTabChange('add-student')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeHostTab === 'add-student'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Tambah Siswa Baru
        </button>

        <button
          onClick={() => onHostTabChange('upload')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeHostTab === 'upload'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Data Siswa (CSV/JSON)
        </button>

        <button
          onClick={() => onHostTabChange('notes')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeHostTab === 'notes'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          Beri Catatan Mentor
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: DAFTAR SISWA & LAPORAN */}
      {activeHostTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          {/* Search & Filter Header with Class Type Filter */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari siswa berdasarkan nama, ID, sekolah, kelas, kampus..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Tipe Kelas */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <span className="text-[11px] font-bold text-slate-600 pl-2 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  Kelas:
                </span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Semua Kelas ({students.length})</option>
                  {uniqueClassTypes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('PASSING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'PASSING'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Lolos Pilihan 1 ({passingStudents.length})
              </button>
              <button
                onClick={() => setStatusFilter('NEED_HELP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === 'NEED_HELP'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                Butuh Peningkatan ({students.length - passingStudents.length})
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Siswa & NISN</th>
                  <th className="py-3.5 px-4">Asal Sekolah</th>
                  <th className="py-3.5 px-4">Pilihan 1 & Passing Grade</th>
                  <th className="py-3.5 px-4 text-center">Skor Terakhir</th>
                  <th className="py-3.5 px-4 text-center">Target Siswa</th>
                  <th className="py-3.5 px-4 text-center">Status Kelulusan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => {
                    const latest = s.tryOuts[s.tryOuts.length - 1];
                    const isPassing = latest ? latest.totalScore >= s.choice1.passingGradeEstimate : false;
                    const diff = latest ? latest.totalScore - s.choice1.passingGradeEstimate : 0;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{s.id}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-semibold">{s.school}</div>
                          <div className="mt-1">
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer group"
                              title="Klik untuk mengubah tipe kelas siswa"
                            >
                              <Layers className="w-3 h-3 text-amber-600" />
                              <span className="truncate max-w-[140px]">{s.classGroup}</span>
                              <Pencil className="w-2.5 h-2.5 text-amber-500 opacity-70 group-hover:opacity-100 shrink-0" />
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-sky-900">{s.choice1.major}</div>
                          <div className="text-[11px] text-slate-600">
                            {s.choice1.university} · PG: <strong className="font-mono text-sky-700">{s.choice1.passingGradeEstimate}</strong>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="text-sm font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 tabular-nums">
                            {latest ? latest.totalScore : '-'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-700 tabular-nums">
                          {s.targetScore}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          {isPassing ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Lolos (+{diff})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              {diff} Poin
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingStudent(s)}
                              className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Tipe Kelas & Data Siswa"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onViewStudent(s.id)}
                              className="p-1.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                              title="Buka Dashboard Detail Siswa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onPrintStudentReport(s)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Cetak Rapor Siswa"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudentForScore(s.id);
                                onHostTabChange('input-score');
                              }}
                              className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Input Skor TO Baru"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      Tidak ada siswa yang sesuai dengan filter pencarian "{searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: INPUT & KELOLA PROGRESS TRY OUT / EVALUASI SISWA */}
      {activeHostTab === 'input-score' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-sky-600" />
                Input & Kelola Evaluasi / Progress Siswa
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Input hasil Try Out baru, koreksi nilai TO yang sudah berjalan, atau kustomisasi evaluasi 7 subtest.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setScoreSubTab('new-to')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  scoreSubTab === 'new-to'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Input TO Baru
              </button>
              <button
                type="button"
                onClick={() => setScoreSubTab('history-to')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  scoreSubTab === 'history-to'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Koreksi Skor TO
              </button>
              <button
                type="button"
                onClick={() => setScoreSubTab('edit-eval')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  scoreSubTab === 'edit-eval'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardEdit className="w-3.5 h-3.5" />
                Evaluasi Subtest
              </button>
            </div>
          </div>

          {scoreSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{scoreSuccessMsg}</span>
            </div>
          )}

          {evalSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{evalSuccessMsg}</span>
            </div>
          )}

          {/* SUB-MODE 1: INPUT SKOR TO BARU */}
          {scoreSubTab === 'new-to' && (
            <form onSubmit={handleScoreSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Siswa Intensif
                  </label>
                  <select
                    value={selectedStudentForScore}
                    onChange={(e) => setSelectedStudentForScore(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 cursor-pointer"
                    required
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id}) - {s.school}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama / Seri Try Out Baru
                  </label>
                  <input
                    type="text"
                    value={toTitle}
                    onChange={(e) => setToTitle(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500"
                    placeholder="Contoh: Try Out Intensif 7"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Pelaksanaan
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>

              {/* 7 Subtests Input Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Nilai Tiap Subtest UTBK (Skala 300 - 850)
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Rata-rata Estimasi:{' '}
                    <span className="font-mono text-sm tabular-nums">
                      {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 7)}
                    </span>
                  </span>
                </div>

                {/* TPS Group */}
                <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 mb-4">
                  <span className="text-xs font-extrabold text-sky-800 block mb-3">
                    Kelompok 1: Tes Potensi Skolastik (TPS)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(['pu', 'ppu', 'kbm', 'pk'] as const).map((key) => (
                      <div key={key}>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {SUBTEST_DEFINITIONS[key].code} - {SUBTEST_DEFINITIONS[key].shortName}
                        </label>
                        <input
                          type="number"
                          min="300"
                          max="850"
                          value={scores[key]}
                          onChange={(e) =>
                            setScores({ ...scores, [key]: Number(e.target.value) })
                          }
                          className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-sky-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Literasi Group */}
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                  <span className="text-xs font-extrabold text-emerald-800 block mb-3">
                    Kelompok 2: Tes Literasi & Penalaran Matematika
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['lbi', 'lbe', 'pm'] as const).map((key) => (
                      <div key={key}>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {SUBTEST_DEFINITIONS[key].code} - {SUBTEST_DEFINITIONS[key].shortName}
                        </label>
                        <input
                          type="number"
                          min="300"
                          max="850"
                          value={scores[key]}
                          onChange={(e) =>
                            setScores({ ...scores, [key]: Number(e.target.value) })
                          }
                          className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 font-mono tabular-nums focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan & Tambah Try Out Baru
                </button>
              </div>
            </form>
          )}

          {/* SUB-MODE 2: KOREKSI SKOR TO SEBELUMNYA */}
          {scoreSubTab === 'history-to' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Siswa
                  </label>
                  <select
                    value={selectedStudentForScore}
                    onChange={(e) => setSelectedStudentForScore(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Try Out yang Ingin Diedit / Dikoreksi
                  </label>
                  <select
                    value={selectedToId}
                    onChange={(e) => handleSelectToForEdit(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-sky-900 focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    {(studentForScore?.tryOuts || []).map((to, idx) => (
                      <option key={to.toId} value={to.toId}>
                        TO #{idx + 1}: {to.title} ({to.date}) — Skor: {to.totalScore}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedToId ? (
                <form onSubmit={handleEditExistingToSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Judul / Seri Try Out
                      </label>
                      <input
                        type="text"
                        value={editToTitle}
                        onChange={(e) => setEditToTitle(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tanggal Pelaksanaan
                      </label>
                      <input
                        type="date"
                        value={editToDate}
                        onChange={(e) => setEditToDate(e.target.value)}
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  {/* 7 Subtests Score Correction */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-slate-700">
                        Koreksi Nilai 7 Subtest:
                      </span>
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                        Rata-rata Baru:{' '}
                        <span className="font-mono text-sm tabular-nums">
                          {Math.round(Object.values(editToScores).reduce((a, b) => a + b, 0) / 7)}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(['pu', 'ppu', 'kbm', 'pk', 'lbi', 'lbe', 'pm'] as const).map((key) => (
                        <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {SUBTEST_DEFINITIONS[key].code} - {SUBTEST_DEFINITIONS[key].shortName}
                          </label>
                          <input
                            type="number"
                            min="300"
                            max="850"
                            value={editToScores[key]}
                            onChange={(e) =>
                              setEditToScores({ ...editToScores, [key]: Number(e.target.value) })
                            }
                            className="w-full py-1.5 px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 font-mono tabular-nums"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingTo(selectedToId)}
                      className="px-4 py-2.5 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus Try Out Ini
                    </button>

                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Simpan Koreksi Nilai TO
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  Tidak ada data Try Out untuk siswa ini.
                </div>
              )}
            </div>
          )}

          {/* SUB-MODE 3: KUSTOMISASI EVALUASI TIAP SUBTEST */}
          {scoreSubTab === 'edit-eval' && (
            <form onSubmit={handleSaveSubtestEvaluation} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Siswa
                  </label>
                  <select
                    value={selectedStudentForScore}
                    onChange={(e) => setSelectedStudentForScore(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Subtest UTBK yang Ingin Dievaluasi
                  </label>
                  <select
                    value={selectedEvalSubtest}
                    onChange={(e) => setSelectedEvalSubtest(e.target.value as SubtestKey)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {(['pu', 'ppu', 'kbm', 'pk', 'lbi', 'lbe', 'pm'] as const).map((key) => (
                      <option key={key} value={key}>
                        {SUBTEST_DEFINITIONS[key].code} — {SUBTEST_DEFINITIONS[key].name} ({SUBTEST_DEFINITIONS[key].category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status & Accuracy Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Status Kelulusan Subtest
                  </label>
                  <select
                    value={evalStatus}
                    onChange={(e) => setEvalStatus(e.target.value as 'Aman' | 'Waspada' | 'Kritis')}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    <option value="Aman">🟢 Aman (Skor Memenuhi Target)</option>
                    <option value="Waspada">🟡 Waspada (Mendekati Batas Aman)</option>
                    <option value="Kritis">🔴 Kritis (Perlu Bimbingan Klinik Intensif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat Akurasi Soal ({evalAccuracy}%)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={evalAccuracy}
                      onChange={(e) => setEvalAccuracy(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <span className="w-12 text-center text-xs font-mono font-bold text-emerald-900 bg-white py-1 px-2 rounded-lg border border-slate-200">
                      {evalAccuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Textareas for Analysis */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center justify-between">
                    <span>1. Analisis Kekuatan Siswa (1 baris per poin):</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pisahkan dengan baris baru (Enter)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={evalStrengthsText}
                    onChange={(e) => setEvalStrengthsText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Penguasaan konsep silogisme dan penarikan kesimpulan konsisten."
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center justify-between">
                    <span>2. Analisis Kelemahan / Materi Butuh Perhatian (1 baris per poin):</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pisahkan dengan baris baru (Enter)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={evalWeaknessesText}
                    onChange={(e) => setEvalWeaknessesText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Masih sering terkecoh pada tipe soal analitis bertingkat dan waktu pengerjaan lambat."
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1 flex items-center justify-between">
                    <span>3. Rekomendasi Solusi & Program Klinik (1 baris per poin):</span>
                    <span className="text-[10px] text-slate-400 font-normal">Pisahkan dengan baris baru (Enter)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={evalRecommendationsText}
                    onChange={(e) => setEvalRecommendationsText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    placeholder="Contoh: Jadwalkan klinik intensif latihan 25 soal penalaran analitis per hari."
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetSubtestEvaluationToDefault}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Rekomendasi Standar
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Evaluasi Subtest Siswa
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* TAB 3: TAMBAH SISWA BARU */}
      {activeHostTab === 'add-student' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto">
          
          <div className="mb-6 pb-4 border-b border-slate-200">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-emerald-600" />
              Registrasi Siswa Baru Intensif UTBK
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tambahkan siswa baru lengkap dengan target skor ambis dan kampus tujuan pilihan 1 & 2.
            </p>
          </div>

          {addStudentSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{addStudentSuccess}</span>
            </div>
          )}

          <form onSubmit={handleAddStudentSubmit} className="space-y-6">
            
            {/* Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID Siswa / NISN
                </label>
                <input
                  type="text"
                  value={newStudentData.id}
                  onChange={(e) => setNewStudentData({ ...newStudentData, id: e.target.value })}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={newStudentData.name}
                  onChange={(e) => setNewStudentData({ ...newStudentData, name: e.target.value })}
                  placeholder="Contoh: Sarah Nurul Aulia"
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={newStudentData.school}
                  onChange={(e) => setNewStudentData({ ...newStudentData, school: e.target.value })}
                  placeholder="Contoh: SMAN 28 Jakarta"
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kelas / Kelompok Bimbingan
                </label>
                <input
                  type="text"
                  value={newStudentData.classGroup}
                  onChange={(e) => setNewStudentData({ ...newStudentData, classGroup: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Skor UTBK Ambis
                </label>
                <input
                  type="number"
                  min="400"
                  max="850"
                  value={newStudentData.targetScore}
                  onChange={(e) => setNewStudentData({ ...newStudentData, targetScore: Number(e.target.value) })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-amber-700 font-mono"
                  required
                />
              </div>
            </div>

            {/* Target Universities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Pilihan 1 */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-3">
                <span className="text-xs font-extrabold text-sky-900 block">
                  Pilihan 1 (Prioritas Utama)
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Universitas / PTN</label>
                  <input
                    type="text"
                    value={newStudentData.choice1Univ}
                    onChange={(e) => setNewStudentData({ ...newStudentData, choice1Univ: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                  <input
                    type="text"
                    value={newStudentData.choice1Major}
                    onChange={(e) => setNewStudentData({ ...newStudentData, choice1Major: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimasi Passing Grade</label>
                  <input
                    type="number"
                    value={newStudentData.choice1Pass}
                    onChange={(e) => setNewStudentData({ ...newStudentData, choice1Pass: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono text-sky-800"
                    required
                  />
                </div>
              </div>

              {/* Pilihan 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <span className="text-xs font-extrabold text-emerald-900 block">
                  Pilihan 2 (Cadangan)
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Universitas / PTN</label>
                  <input
                    type="text"
                    value={newStudentData.choice2Univ}
                    onChange={(e) => setNewStudentData({ ...newStudentData, choice2Univ: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                  <input
                    type="text"
                    value={newStudentData.choice2Major}
                    onChange={(e) => setNewStudentData({ ...newStudentData, choice2Major: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimasi Passing Grade</label>
                  <input
                    type="number"
                    value={newStudentData.choice2Pass}
                    onChange={(e) => setNewStudentData({ ...newStudentData, choice2Pass: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono text-emerald-800"
                    required
                  />
                </div>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="py-3 px-6 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Daftarkan Siswa Baru
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 4: UPLOAD DATA SISWA (CSV/JSON) */}
      {activeHostTab === 'upload' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
          
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Upload className="w-6 h-6 text-amber-500" />
              Upload & Edit Data Siswa Utama
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Impor dan edit data siswa intensif UTBK menggunakan asisten cerdas AI Gemini atau file spreadsheet/JSON.
            </p>
          </div>

          {/* AI FEATURE CARD: AI ASSISTANT FOR UPLOADING & EDITING MAIN DATA */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-emerald-950 p-6 sm:p-8 text-white border border-slate-800 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Fitur AI Host: Edit & Unggah Cerdas
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Asisten AI Pengunggah & Pengedit Data Siswa
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  Punya file data mentah, teks chat WhatsApp dari pendaftaran bimbel, atau ingin menambah nilai Try Out massal? Gemini AI siap membaca, merapikan ejaan kampus & jurusan, menghitung passing grade, dan memperbarui evaluasi subtest secara instan.
                </p>
                <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-semibold text-emerald-300">
                  <span className="bg-white/10 px-2 py-0.5 rounded">✓ Normalisasi Nama Kampus & PG</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded">✓ Input Batch TO Massal</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded">✓ Deteksi Format Chat/Excel Otomatis</span>
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAiModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 text-slate-950 rounded-2xl text-xs sm:text-sm font-black shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Bot className="w-5 h-5 text-emerald-950 group-hover:scale-110 transition-transform" />
                  <span>Buka AI Data Editor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Atau Gunakan Pengunggahan File Manual (CSV / JSON):
            </span>
          </div>

          {uploadFeedback.status === 'success' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{uploadFeedback.message}</span>
            </div>
          )}

          {uploadFeedback.status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{uploadFeedback.message}</span>
            </div>
          )}

          {/* Download Templates Bar */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                Unduh Template Contoh Format:
              </span>
              <span className="text-[11px] text-amber-700">
                Gunakan template resmi agar kolom dan format data terbaca sempurna oleh sistem.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCsvTemplate}
                className="px-3.5 py-2 text-xs font-bold bg-white text-slate-800 border border-amber-300 rounded-xl hover:bg-amber-100/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Template File CSV
              </button>
              <button
                onClick={handleDownloadJsonBackup}
                className="px-3.5 py-2 text-xs font-bold bg-white text-slate-800 border border-amber-300 rounded-xl hover:bg-amber-100/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                Contoh File JSON
              </button>
            </div>
          </div>

          {/* Drag & Drop / File Input Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 sm:p-12 text-center bg-slate-50/70 hover:bg-emerald-50/30 transition-all cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.json"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Klik atau Seret (Drag & Drop) File CSV / JSON ke Sini
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Mendukung file .csv (ekspor Excel) atau file .json hasil backup data UTBK bimbel.
            </p>
          </div>

        </div>
      )}

      {/* TAB 5: BERI & KELOLA CATATAN EVALUASI MENTOR (CRUD) */}
      {activeHostTab === 'notes' && (() => {
        const currentStudent = students.find((s) => s.id === selectedStudentForNote) || students[0];
        const studentNotes = currentStudent?.tutorNotes || [];

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-8">
            
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MessageSquarePlus className="w-6 h-6 text-sky-600" />
                  Kelola Catatan & Arahan Mentor Intensif
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Beri arahan strategi belajar, catatan pengerjaan subtest, atau edit dan hapus catatan yang sudah diberikan.
                </p>
              </div>

              {editingNoteId && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  <Pencil className="w-3.5 h-3.5 text-amber-700" />
                  Sedang Mode Edit Catatan
                </div>
              )}
            </div>

            {noteSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{noteSuccess}</span>
              </div>
            )}

            {/* FORM INPUT / EDIT NOTE */}
            <form onSubmit={handleAddTutorNote} className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Siswa Intensif
                  </label>
                  <select
                    value={selectedStudentForNote}
                    onChange={(e) => {
                      setSelectedStudentForNote(e.target.value);
                      if (editingNoteId) handleCancelEditNote();
                    }}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 cursor-pointer"
                    required
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.id}) - {s.school}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Mentor / Pengajar
                  </label>
                  <input
                    type="text"
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500"
                    placeholder="Contoh: Kak Dimas Prasetyo, S.Si"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Evaluasi
                </label>
                <div className="flex gap-2">
                  {(['Strategi', 'Akademik', 'Motivasi'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNoteCategory(cat)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        noteCategory === cat
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingNoteId ? 'Edit Teks Catatan Bimbingan' : 'Tulis Catatan Bimbingan Baru'}
                </label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Tuliskan arahan materi yang perlu difokuskan, analisis waktu pengerjaan subtest, atau rekomendasi pemilihan urutan PTN..."
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                {editingNoteId && (
                  <button
                    type="button"
                    onClick={handleCancelEditNote}
                    className="py-2.5 px-4 rounded-xl font-bold text-slate-600 bg-white hover:bg-slate-200 border border-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    Batal Edit
                  </button>
                )}

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingNoteId ? 'Perbarui Catatan Mentor' : 'Simpan Catatan Baru'}
                </button>
              </div>

            </form>

            {/* LIST RIWAYAT CATATAN MENTOR SISWA INI */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-emerald-600" />
                  Riwayat Catatan Bimbingan: {currentStudent?.name} ({studentNotes.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Total {studentNotes.length} Catatan Tersimpan
                </span>
              </div>

              {studentNotes.length > 0 ? (
                <div className="space-y-3">
                  {studentNotes.map((note) => {
                    const isBeingEdited = editingNoteId === note.id;
                    const catBg =
                      note.category === 'Akademik'
                        ? 'bg-sky-100 text-sky-800 border-sky-300'
                        : note.category === 'Strategi'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                    return (
                      <div
                        key={note.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                          isBeingEdited
                            ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${catBg}`}>
                              {note.category}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{note.tutorName}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] text-slate-500">{note.date}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                            {note.note}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditNote(note)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Edit Catatan Ini"
                          >
                            <Pencil className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTutorNote(note.id)}
                            className="p-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-1 cursor-pointer transition-colors"
                            title="Hapus Catatan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                  Belum ada catatan mentor untuk siswa ini. Gunakan form di atas untuk menambahkan catatan pertama.
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* PORTAL UI/UX SETTINGS MODAL */}
      {showSettingsModal && (
        <PortalSettingsModal
          currentSettings={uiSettings}
          onSave={(newSettings) => {
            if (onUpdateUiSettings) {
              onUpdateUiSettings(newSettings);
            }
            setShowSettingsModal(false);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* AI DATA EDITOR MODAL */}
      {showAiModal && (
        <AiDataEditorModal
          students={students}
          onApplyChanges={handleAiApplyChanges}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* EDIT STUDENT & CLASS TYPE MODAL */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          existingClassTypes={uniqueClassTypes}
          onSave={(updated) => {
            const updatedList = students.map((st) => (st.id === updated.id ? updated : st));
            onUpdateStudents(updatedList);
            setEditingStudent(null);
            setAiSuccessToast(`Data siswa "${updated.name}" & tipe kelas berhasil diperbarui!`);
            setTimeout(() => setAiSuccessToast(''), 5000);
          }}
          onClose={() => setEditingStudent(null)}
        />
      )}

    </div>
  );
};
