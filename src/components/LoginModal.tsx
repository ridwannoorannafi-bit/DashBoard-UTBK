import React, { useState } from 'react';
import { AuthUser, Student } from '../types/utbk';
import { INITIAL_HOST } from '../data/initialStudents';
import { GraduationCap, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  students: Student[];
  onLoginSuccess: (user: AuthUser) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  students,
  onLoginSuccess,
  onClose
}) => {
  const [role, setRole] = useState<'student' | 'host'>('student');
  const [idInput, setIdInput] = useState('UTBK-2025-001');
  const [passwordInput, setPasswordInput] = useState('siswa123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (newRole: 'student' | 'host') => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'student') {
      setIdInput('UTBK-2025-001');
      setPasswordInput('siswa123');
    } else {
      setIdInput('HOST-ADMIN');
      setPasswordInput('admin123');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedId = idInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedId || !trimmedPass) {
      setErrorMessage('Harap masukkan ID dan Password dengan lengkap.');
      return;
    }

    if (role === 'student') {
      const found = students.find(
        (s) => s.id.toLowerCase() === trimmedId.toLowerCase()
      );

      if (!found) {
        setErrorMessage(`ID Siswa "${trimmedId}" tidak terdaftar. Gunakan contoh ID seperti: UTBK-2025-001`);
        return;
      }

      if (found.password && found.password !== trimmedPass) {
        setErrorMessage('Password siswa salah. Password default: siswa123');
        return;
      }

      onLoginSuccess({
        role: 'student',
        student: found
      });
    } else {
      // Host login
      if (
        (trimmedId.toUpperCase() === 'HOST-ADMIN' || trimmedId.toLowerCase() === 'admin') &&
        (trimmedPass === 'admin123' || trimmedPass === 'tutor123' || trimmedPass === 'host123')
      ) {
        onLoginSuccess({
          role: 'host',
          host: INITIAL_HOST
        });
      } else {
        setErrorMessage('ID Host atau Password salah. (Gunakan ID: HOST-ADMIN & Password: admin123)');
      }
    }
  };

  const handleQuickDemo = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      onLoginSuccess({
        role: 'student',
        student
      });
    }
  };

  const handleQuickHostDemo = () => {
    onLoginSuccess({
      role: 'host',
      host: INITIAL_HOST
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Banner with Official Rumah Belajar Tesla Branding */}
        <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Portal Intensif UTBK SNBT
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                RUMAH BELAJAR TESLA
              </h1>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Bimbingan Sukses PTN · Rumah keduanya siswa
              </p>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white p-1 rounded-2xl shadow-md shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/Dokumen_dari_RNA__1__5243d24d.png"
                alt="Logo Tesla Bimbingan Sukses PTN"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Role Selector Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                role === 'student'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              Sebagai Siswa
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('host')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                role === 'host'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Sebagai Host / Tutor
            </button>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2">
              <span className="font-bold shrink-0">Perhatian:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Login */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {role === 'student' ? 'ID Siswa / NISN' : 'ID Host / Admin'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  {role === 'student' ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>
                <input
                  type="text"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder={role === 'student' ? 'Contoh: UTBK-2025-001' : 'Contoh: HOST-ADMIN'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-emerald-600 via-sky-600 to-emerald-700 hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login Options */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500">
                Pilihan Akun Demo (Klik untuk Masuk Cepat):
              </span>
              <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Instan 1-Klik
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('UTBK-2025-001')}
                className="text-left p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    M. Farel Pratama
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                    724 Skor
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                  Pilihan 1: FK Universitas Indonesia
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                  ID: UTBK-2025-001 · Pass: siswa123
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('UTBK-2025-002')}
                className="text-left p-3 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100/70 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-sky-800">
                    Aisyah Putri Azzahra
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-600 text-white">
                    726 Skor
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                  Pilihan 1: STEI Institut Teknologi Bandung
                </p>
                <p className="text-[10px] text-sky-700 font-semibold mt-1">
                  ID: UTBK-2025-002 · Pass: siswa123
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('UTBK-2025-003')}
                className="text-left p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                    Bintang Bagaskara
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white">
                    658 Skor
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                  Pilihan 1: Ilkom Universitas Padjadjaran
                </p>
                <p className="text-[10px] text-amber-700 font-semibold mt-1">
                  ID: UTBK-2025-003 · Pass: siswa123
                </p>
              </button>

              <button
                type="button"
                onClick={handleQuickHostDemo}
                className="text-left p-3 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Host Bimbel / Tutor
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                    Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Upload data, nilai TO & kelola siswa
                </p>
                <p className="text-[10px] text-slate-700 font-semibold mt-1">
                  ID: HOST-ADMIN · Pass: admin123
                </p>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
