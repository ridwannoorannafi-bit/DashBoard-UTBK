import React from 'react';
import { AuthUser, Student } from '../types/utbk';
import { GraduationCap, LogOut, ShieldCheck, User, Users, FileText, BarChart3, PlusCircle } from 'lucide-react';
import { TESLA_LOGO_ICON } from '../utils/assets';

interface NavbarProps {
  user: AuthUser;
  students: Student[];
  currentStudentId?: string;
  onSelectStudent?: (studentId: string) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onPrintReport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  students,
  currentStudentId,
  onSelectStudent,
  onLogout,
  onOpenLogin,
  activeTab,
  onTabChange,
  onPrintReport
}) => {
  const isHost = user?.role === 'host';
  const isStudent = user?.role === 'student';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Zone 1: Wordmark Brand with Official Bimbel Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-white p-0.5 shadow-xs border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={TESLA_LOGO_ICON}
                alt="Logo Rumah Belajar Tesla"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                  RUMAH BELAJAR <span className="text-blue-600">TE<span className="text-red-600 font-serif font-black">Σ</span>LA</span>
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  INTENSIF UTBK
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-700 hidden sm:block">
                Bimbingan Sukses PTN · Rumah Keduanya Siswa
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-Line Controls) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-semibold">
            {isStudent && (
              <>
                <button
                  onClick={() => onTabChange('overview')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    activeTab === 'overview'
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Progress Skor TO
                </button>
                <button
                  onClick={() => onTabChange('evaluations')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    activeTab === 'evaluations'
                      ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  Evaluasi Subtest
                </button>
                <button
                  onClick={() => onTabChange('report')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    activeTab === 'report'
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  Rapor Hasil Belajar
                </button>
              </>
            )}

            {isHost && (
              <>
                <button
                  onClick={() => onTabChange('students')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    activeTab === 'students'
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  Daftar Siswa ({students.length})
                </button>
                <button
                  onClick={() => onTabChange('input-score')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    activeTab === 'input-score'
                      ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-sky-600" />
                  Input Nilai TO
                </button>
                <button
                  onClick={() => onTabChange('upload')}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    activeTab === 'upload'
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-amber-600" />
                  Upload & Kelola Data
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action / User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Student Switcher for Host */}
            {isHost && onSelectStudent && (
              <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Preview Siswa:</span>
                <select
                  value={currentStudentId || ''}
                  onChange={(e) => onSelectStudent(e.target.value)}
                  className="bg-slate-100 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {onPrintReport && (
              <button
                onClick={onPrintReport}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
                title="Cetak Rapor Resmi UTBK"
              >
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                Cetak Rapor
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {user.role === 'student' ? user.student.name : user.host.name}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-end gap-1">
                    {user.role === 'student' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <User className="w-3 h-3" /> Siswa Intensif
                      </span>
                    ) : (
                      <span className="text-sky-600 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Host / Tutor
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Keluar / Ganti Akun"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                Masuk / Login
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-2 text-xs">
          {isStudent && (
            <>
              <button
                onClick={() => onTabChange('overview')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
                  activeTab === 'overview' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                }`}
              >
                Progress TO
              </button>
              <button
                onClick={() => onTabChange('evaluations')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
                  activeTab === 'evaluations' ? 'bg-sky-600 text-white' : 'text-slate-600'
                }`}
              >
                Evaluasi Subtest
              </button>
              <button
                onClick={() => onTabChange('report')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
                  activeTab === 'report' ? 'bg-amber-600 text-white' : 'text-slate-600'
                }`}
              >
                Rapor Resmi
              </button>
            </>
          )}

          {isHost && (
            <>
              <button
                onClick={() => onTabChange('students')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
                  activeTab === 'students' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                }`}
              >
                Daftar Siswa
              </button>
              <button
                onClick={() => onTabChange('input-score')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
                  activeTab === 'input-score' ? 'bg-sky-600 text-white' : 'text-slate-600'
                }`}
              >
                Input Nilai
              </button>
              <button
                onClick={() => onTabChange('upload')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
                  activeTab === 'upload' ? 'bg-amber-600 text-white' : 'text-slate-600'
                }`}
              >
                Upload Data
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
