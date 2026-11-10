import React from 'react';
import { Student, PortalUiSettings } from '../types/utbk';
import { SUBTEST_DEFINITIONS } from '../data/utbkMeta';
import { DEFAULT_UI_SETTINGS } from '../utils/storage';
import { Printer, X, GraduationCap, CheckCircle2, Award } from 'lucide-react';
import { TESLA_LOGO_BANNER } from '../utils/assets';

interface ReportPrintViewProps {
  student: Student;
  onClose: () => void;
  uiSettings?: PortalUiSettings;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({ 
  student, 
  onClose,
  uiSettings = DEFAULT_UI_SETTINGS 
}) => {
  const latestTO = student.tryOuts[student.tryOuts.length - 1];
  const initialTO = student.tryOuts[0];
  const delta = latestTO && initialTO ? latestTO.totalScore - initialTO.totalScore : 0;
  const isPassingP1 = latestTO ? latestTO.totalScore >= student.choice1.passingGradeEstimate : false;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
      
      {/* Container */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Action Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">
              Pratinjau Rapor Resmi Perkembangan Siswa Intensif UTBK
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Rapor / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="p-8 sm:p-12 text-slate-900 space-y-8 bg-white print:p-4">
          
          {/* 1. KOP SURAT RESMI RUMAH BELAJAR TESLA */}
          <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                <img
                  src={TESLA_LOGO_BANNER}
                  alt="Logo Rumah Belajar Tesla"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase leading-none">
                  {uiSettings.kopTitle || 'RUMAH BELAJAR TESLA'}
                </h1>
                <p className="text-xs font-black text-blue-700 tracking-wider uppercase mt-1">
                  {uiSettings.kopSubtitle || 'BIMBINGAN SUKSES PTN · PROGRAM INTENSIF UTBK SNBT'}
                </p>
                <p className="text-[11px] text-emerald-800 font-serif italic font-bold">
                  "Rumah keduanya siswa"
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {uiSettings.kopAddress || 'Layanan Konsultasi Akademik, Try Out Berstandar BP3 Kemendikbudristek & Bimbingan Klinik'}
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-[11px] font-bold text-slate-900">NOMOR RAPOR</div>
              <div className="text-xs font-mono font-bold text-emerald-700">
                RPR/{student.id}/{new Date().getFullYear()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-900 underline decoration-amber-400 decoration-4 underline-offset-4">
              LAPORAN EVALUASI & PROGRESS SISWA INTENSIF UTBK
            </h2>
          </div>

          {/* 2. DATA IDENTITAS & TARGET KAMPUS SISWA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            
            {/* Student Info */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Identitas Siswa
              </span>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Nama Siswa</span>
                <span className="font-extrabold text-slate-950">: {student.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">ID / NISN</span>
                <span className="font-bold font-mono text-slate-900">: {student.id}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Asal Sekolah</span>
                <span className="font-bold text-slate-900">: {student.school}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Kelas Bimbingan</span>
                <span className="font-semibold text-emerald-800">: {student.classGroup}</span>
              </div>
            </div>

            {/* Target Campus */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block mb-1">
                Target Kampus & Kelulusan
              </span>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Target Skor</span>
                <span className="font-black text-amber-700 font-mono">: {student.targetScore} Skor</span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Pilihan 1 (PTN)</span>
                <span className="font-bold text-sky-900">
                  : {student.choice1.university} - {student.choice1.major} (PG: {student.choice1.passingGradeEstimate})
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Pilihan 2 (PTN)</span>
                <span className="font-bold text-emerald-900">
                  : {student.choice2.university} - {student.choice2.major} (PG: {student.choice2.passingGradeEstimate})
                </span>
              </div>
              <div className="flex">
                <span className="w-32 text-slate-500 font-medium">Status Estimasi</span>
                <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                  : {isPassingP1 ? 'Lolos Passing Grade Pilihan 1' : 'Mendekati Passing Grade'}
                </span>
              </div>
            </div>

          </div>

          {/* 3. PROGRESS TRY OUT REKAPITULASI */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              1. Rekapitulasi Nilai Try Out Intensif
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Try Out</th>
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3 text-center">Skor Rata-rata</th>
                    <th className="py-2.5 px-3 text-center">Passing Grade P1</th>
                    <th className="py-2.5 px-3 text-center">Status Kelulusan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {student.tryOuts.map((to, i) => {
                    const isPass = to.totalScore >= student.choice1.passingGradeEstimate;
                    return (
                      <tr key={to.toId} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-2 px-3 font-sans font-bold text-slate-800">{to.title}</td>
                        <td className="py-2 px-3 text-slate-500">{to.date}</td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-700 tabular-nums">
                          {to.totalScore}
                        </td>
                        <td className="py-2 px-3 text-center text-slate-600 tabular-nums">
                          {student.choice1.passingGradeEstimate}
                        </td>
                        <td className="py-2 px-3 text-center font-sans font-bold">
                          {isPass ? (
                            <span className="text-emerald-700">Tembus Target</span>
                          ) : (
                            <span className="text-amber-700">Kejar Skor</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. DETAIL EVALUASI 7 SUBTEST */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              2. Evaluasi Rinci Tiap Subtest UTBK SNBT
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Subtest</th>
                    <th className="py-2.5 px-3 text-center">Kategori</th>
                    <th className="py-2.5 px-3 text-center">Skor Terkini</th>
                    <th className="py-2.5 px-3 text-center">Target Siswa</th>
                    <th className="py-2.5 px-3 text-center">Rata-rata Nas.</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3">Rekomendasi Bimbingan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {student.evaluations.map((ev) => {
                    const meta = SUBTEST_DEFINITIONS[ev.subtestKey];
                    return (
                      <tr key={ev.subtestKey} className="hover:bg-slate-50">
                        <td className="py-2 px-3">
                          <strong className="text-slate-900 font-bold">{ev.subtestName}</strong>
                          <span className="text-[10px] text-slate-500 block">({meta.code})</span>
                        </td>
                        <td className="py-2 px-3 text-center text-slate-600 font-medium">
                          {ev.category}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-black text-emerald-700 tabular-nums">
                          {ev.currentScore}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-amber-700 tabular-nums">
                          {ev.targetScore}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-600 tabular-nums">
                          {ev.nationalAverage}
                        </td>
                        <td className="py-2 px-3 text-center font-bold">
                          <span
                            className={
                              ev.status === 'Aman'
                                ? 'text-emerald-700'
                                : ev.status === 'Waspada'
                                ? 'text-amber-700'
                                : 'text-red-700'
                            }
                          >
                            {ev.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-700 max-w-xs text-[10px]">
                          {ev.recommendations[0] || 'Pertahankan ritme belajar.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. CATATAN TUTOR & PENGESAHAN */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs border-t border-slate-200">
            <div>
              <span className="font-extrabold uppercase tracking-wider text-slate-700 block mb-2">
                Catatan Bimbingan Terkini:
              </span>
              <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 italic">
                "{student.tutorNotes?.[0]?.note || 'Pertahankan konsistensi belajar dan manajemen waktu latihan soal.'}"
              </p>
            </div>

            <div className="flex justify-between text-center pt-2">
              <div className="space-y-12">
                <p className="font-bold text-slate-700">Orang Tua / Wali Siswa</p>
                <p className="font-bold text-slate-900">( ........................................ )</p>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-slate-700">{uiSettings.signatoryTitle || 'Konselor Akademik UTBK'}</p>
                <p className="font-bold text-slate-900 font-mono underline">
                  {uiSettings.signatoryName || 'Kak Dimas Prasetyo, S.Si'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
