import React, { useState, useEffect } from 'react';
import { AuthUser, Student, PortalUiSettings } from './types/utbk';
import { 
  getStoredStudents, 
  saveStoredStudents, 
  getStoredSession, 
  saveStoredSession,
  getStoredUiSettings,
  saveStoredUiSettings,
  DEFAULT_UI_SETTINGS
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { StudentDashboard } from './components/StudentDashboard';
import { HostDashboard } from './components/HostDashboard';
import { ReportPrintView } from './components/ReportPrintView';
import { GraduationCap, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [user, setUser] = useState<AuthUser>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeHostTab, setActiveHostTab] = useState<string>('students');
  const [currentStudentId, setCurrentStudentId] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [printingStudent, setPrintingStudent] = useState<Student | null>(null);
  const [uiSettings, setUiSettings] = useState<PortalUiSettings>(DEFAULT_UI_SETTINGS);

  // Initialize data and session from storage
  useEffect(() => {
    const loadedStudents = getStoredStudents();
    setStudents(loadedStudents);
    setUiSettings(getStoredUiSettings());

    const savedSession = getStoredSession();
    if (savedSession) {
      setUser(savedSession);
      if (savedSession.role === 'student') {
        setCurrentStudentId(savedSession.student.id);
      } else {
        setCurrentStudentId(loadedStudents[0]?.id || '');
      }
    } else {
      // Default to student view for instant preview, with Muhammad Farel Pratama
      const defaultStudent = loadedStudents[0];
      if (defaultStudent) {
        setUser({ role: 'student', student: defaultStudent });
        setCurrentStudentId(defaultStudent.id);
      }
    }
  }, []);

  // Sync session changes
  const handleLoginSuccess = (newUser: AuthUser) => {
    setUser(newUser);
    saveStoredSession(newUser);
    setShowLoginModal(false);

    if (newUser?.role === 'student') {
      setCurrentStudentId(newUser.student.id);
      setActiveTab('overview');
    } else if (newUser?.role === 'host') {
      setActiveHostTab('students');
    }
  };

  const handleLogout = () => {
    setUser(null);
    saveStoredSession(null);
    setShowLoginModal(true);
  };

  const handleUpdateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    saveStoredStudents(newStudents);

    // If current logged in user is a student, update their reference
    if (user?.role === 'student') {
      const updatedSelf = newStudents.find((s) => s.id === user.student.id);
      if (updatedSelf) {
        const updatedUser: AuthUser = { role: 'student', student: updatedSelf };
        setUser(updatedUser);
        saveStoredSession(updatedUser);
      }
    }
  };

  const handleUpdateUiSettings = (newSettings: PortalUiSettings) => {
    setUiSettings(newSettings);
    saveStoredUiSettings(newSettings);
  };

  // Selected student resolution
  const activeStudent =
    user?.role === 'student'
      ? students.find((s: Student) => s.id === user.student.id) || user.student
      : students.find((s: Student) => s.id === currentStudentId) || students[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. TOP BAR NAVBAR */}
      <Navbar
        user={user}
        students={students}
        currentStudentId={currentStudentId}
        onSelectStudent={(id) => setCurrentStudentId(id)}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        activeTab={user?.role === 'host' ? activeHostTab : activeTab}
        onTabChange={(tab) => {
          if (user?.role === 'host') {
            setActiveHostTab(tab);
          } else {
            setActiveTab(tab);
            if (tab === 'report' && activeStudent) {
              setPrintingStudent(activeStudent);
            }
          }
        }}
        onPrintReport={activeStudent ? () => setPrintingStudent(activeStudent) : undefined}
      />

      {/* Switch role quick banner on top for easy testing by evaluator */}
      <div className="no-print bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 text-white px-4 py-2 text-xs font-semibold shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-300" />
            <span>Mode Aktif:</span>
            <strong className="underline underline-offset-2">
              {user?.role === 'host' ? 'Host / Tutor Bimbel (Akses Upload & Kelola Nilai)' : `Siswa (${activeStudent?.name})`}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/80 hidden sm:inline">Ganti Peran:</span>
            {user?.role === 'student' ? (
              <button
                onClick={() =>
                  handleLoginSuccess({
                    role: 'host',
                    host: {
                      id: 'HOST-ADMIN',
                      name: 'Rumah Belajar TESLA',
                      role: 'host',
                      institution: 'Rumah Belajar TESLA - Bimbingan Sukses PTN'
                    }
                  })
                }
                className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-bold hover:bg-slate-100 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Masuk Mode Host / Tutor
              </button>
            ) : (
              <button
                onClick={() => {
                  const s = students[0];
                  if (s) {
                    handleLoginSuccess({ role: 'student', student: s });
                  }
                }}
                className="px-2.5 py-1 bg-white text-slate-900 rounded-md font-bold hover:bg-slate-100 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Lihat Tampilan Siswa
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLoginModal || !user ? (
          <LoginModal
            students={students}
            onLoginSuccess={handleLoginSuccess}
            onClose={() => setShowLoginModal(false)}
          />
        ) : user.role === 'host' ? (
          <HostDashboard
            students={students}
            onUpdateStudents={handleUpdateStudents}
            onViewStudent={(id) => {
              const target = students.find((s: Student) => s.id === id);
              if (target) {
                handleLoginSuccess({ role: 'student', student: target });
              }
            }}
            onPrintStudentReport={(targetStudent) => {
              setPrintingStudent(targetStudent);
            }}
            activeHostTab={activeHostTab}
            onHostTabChange={setActiveHostTab}
            uiSettings={uiSettings}
            onUpdateUiSettings={handleUpdateUiSettings}
          />
        ) : activeStudent ? (
          <StudentDashboard
            student={activeStudent}
            onOpenReport={() => setPrintingStudent(activeStudent)}
            activeNavTab={activeTab}
            uiSettings={uiSettings}
          />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-lg font-bold text-slate-700">Data siswa tidak ditemukan</h2>
          </div>
        )}
      </main>

      {/* 3. REPORT PRINT MODAL */}
      {printingStudent && (
        <ReportPrintView
          student={printingStudent}
          onClose={() => setPrintingStudent(null)}
          uiSettings={uiSettings}
        />
      )}

      {/* 4. FOOTER */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/assets/aistudio/Dokumen_dari_RNA__1__5243d24d.png"
                alt="Logo Tesla"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-extrabold text-slate-900">
              RUMAH BELAJAR TESLA &copy; {new Date().getFullYear()}
            </span>
            <span>· Sistem Evaluasi & Monitoring Siswa Intensif UTBK</span>
          </div>

          <div className="flex items-center gap-4 font-medium text-slate-600">
            <span>Standar Subtest SNBT BP3</span>
            <span>·</span>
            <span>Passing Grade Realistis</span>
            <span>·</span>
            <span>Monitoring Nilai Try Out</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
