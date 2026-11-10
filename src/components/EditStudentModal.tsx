import React, { useState } from 'react';
import { Student } from '../types/utbk';
import { recalculateEvaluations } from '../utils/storage';
import { 
  Pencil, 
  X, 
  CheckCircle2, 
  School, 
  Award, 
  Target, 
  Layers, 
  User, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

interface EditStudentModalProps {
  student: Student;
  onSave: (updatedStudent: Student) => void;
  onClose: () => void;
  existingClassTypes?: string[];
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  onSave,
  onClose,
  existingClassTypes = []
}) => {
  const [formData, setFormData] = useState({
    name: student.name,
    id: student.id,
    school: student.school,
    classGroup: student.classGroup,
    customClassGroup: '',
    targetScore: student.targetScore,
    phone: student.phone || '',
    email: student.email || '',
    // Pilihan 1
    choice1Univ: student.choice1.university,
    choice1Major: student.choice1.major,
    choice1Pass: student.choice1.passingGradeEstimate,
    // Pilihan 2
    choice2Univ: student.choice2.university,
    choice2Major: student.choice2.major,
    choice2Pass: student.choice2.passingGradeEstimate
  });

  const [isCustomClass, setIsCustomClass] = useState(
    !['Intensif Ambis PTN 2025 - Gold Class', 'Intensif Ambis PTN 2025 - Silver Class', 'Super Intensif Kedokteran', 'Intensif Reguler Sore', 'Kelas Garansi PTN'].includes(student.classGroup)
  );

  const defaultClasses = [
    'Intensif Ambis PTN 2025 - Gold Class',
    'Intensif Ambis PTN 2025 - Silver Class',
    'Super Intensif Kedokteran',
    'Intensif Reguler Sore',
    'Kelas Garansi PTN'
  ];

  // Merge default and existing unique classes
  const allClasses = Array.from(new Set([...defaultClasses, ...existingClassTypes]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalClassGroup = isCustomClass
      ? (formData.customClassGroup.trim() || formData.classGroup)
      : formData.classGroup;

    const updatedStudent: Student = {
      ...student,
      name: formData.name.trim(),
      school: formData.school.trim(),
      classGroup: finalClassGroup,
      targetScore: Number(formData.targetScore),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      choice1: {
        ...student.choice1,
        university: formData.choice1Univ.trim(),
        major: formData.choice1Major.trim(),
        passingGradeEstimate: Number(formData.choice1Pass)
      },
      choice2: {
        ...student.choice2,
        university: formData.choice2Univ.trim(),
        major: formData.choice2Major.trim(),
        passingGradeEstimate: Number(formData.choice2Pass)
      },
      updatedAt: new Date().toISOString()
    };

    const recalculated = recalculateEvaluations(updatedStudent);
    onSave(recalculated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Pencil className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">
                  Edit Data Siswa & Tipe Kelas
                </h2>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-slate-900">
                  {student.id}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Perbarui tipe kelas bimbingan, profil siswa, target skor ambis, dan jurusan PTN tujuan.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* SECTION 1: TIPE KELAS / KELOMPOK BIMBINGAN (Highlight Utama) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50/50 border-2 border-amber-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                  Tipe Kelas / Kelompok Bimbingan Belajar
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Penting
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Pilih Tipe Kelas
                </label>
                <select
                  disabled={isCustomClass}
                  value={formData.classGroup}
                  onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {allClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Option to specify custom class name */}
              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCustomClass}
                    onChange={(e) => {
                      setIsCustomClass(e.target.checked);
                      if (e.target.checked && !formData.customClassGroup) {
                        setFormData({ ...formData, customClassGroup: formData.classGroup });
                      }
                    }}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Tulis nama tipe kelas baru / kustom</span>
                </label>

                {isCustomClass && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.customClassGroup}
                      onChange={(e) => setFormData({ ...formData, customClassGroup: e.target.value })}
                      placeholder="Contoh: Kelas Super Intensif Kedokteran 2025"
                      className="w-full py-2 px-3 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                      required={isCustomClass}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFIL IDENTITAS SISWA */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-600" />
              Data Profil Siswa
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asal Sekolah
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Skor UTBK Ambis (300 - 850)
                </label>
                <input
                  type="number"
                  min="400"
                  max="850"
                  value={formData.targetScore}
                  onChange={(e) => setFormData({ ...formData, targetScore: Number(e.target.value) })}
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-amber-700 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Siswa / Orang Tua (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xx-xxxx-xxxx"
                  className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: KAMPUS & JURUSAN PILIHAN */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Target Kampus & Jurusan (Passing Grade)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pilihan 1 */}
              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-3">
                <span className="text-xs font-extrabold text-sky-900 block">
                  Pilihan 1 (Prioritas Utama)
                </span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Universitas / PTN</label>
                  <input
                    type="text"
                    value={formData.choice1Univ}
                    onChange={(e) => setFormData({ ...formData, choice1Univ: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                  <input
                    type="text"
                    value={formData.choice1Major}
                    onChange={(e) => setFormData({ ...formData, choice1Major: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimasi Passing Grade</label>
                  <input
                    type="number"
                    value={formData.choice1Pass}
                    onChange={(e) => setFormData({ ...formData, choice1Pass: Number(e.target.value) })}
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
                    value={formData.choice2Univ}
                    onChange={(e) => setFormData({ ...formData, choice2Univ: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jurusan / Program Studi</label>
                  <input
                    type="text"
                    value={formData.choice2Major}
                    onChange={(e) => setFormData({ ...formData, choice2Major: e.target.value })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimasi Passing Grade</label>
                  <input
                    type="number"
                    value={formData.choice2Pass}
                    onChange={(e) => setFormData({ ...formData, choice2Pass: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs font-bold font-mono text-emerald-800"
                    required
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl font-bold text-white text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Perubahan Siswa
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
