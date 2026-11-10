import React, { useState, useRef } from 'react';
import { Student } from '../types/utbk';
import { 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  X, 
  FileText, 
  Wand2, 
  Database,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

interface AiDataEditorModalProps {
  students: Student[];
  onApplyChanges: (updatedStudents: Student[], summary: string) => void;
  onClose: () => void;
}

export const AiDataEditorModal: React.FC<AiDataEditorModalProps> = ({
  students,
  onApplyChanges,
  onClose
}) => {
  const [rawText, setRawText] = useState('');
  const [fileName, setFileName] = useState('');
  const [instruction, setInstruction] = useState('Ekstrak dan rapikan data siswa berikut, normalisasi nama PTN dan passing grade, serta buatkan evaluasi subtest awal.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Results from AI
  const [aiResult, setAiResult] = useState<{
    summary: string;
    actionType: string;
    warnings?: string[];
    students: Student[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick preset instructions for Host
  const presetPrompts = [
    {
      title: 'Tambahkan TO-7 Seluruh Siswa',
      instruction: 'Tambahkan data Try Out 7 (Try Out Final Simulasi UTBK) untuk semua siswa saat ini dengan rata-rata naik +10 s/d +25 poin dibanding TO-6, lengkap dengan rincian 7 subtest.',
      rawSample: ''
    },
    {
      title: 'Import Siswa Baru dari Chat/Form',
      instruction: 'Ekstrak data calon siswa baru ini, masukkan pilihan kampus PTN dengan passing grade realistis, dan hitung estimasi target skornya.',
      rawSample: `1. Naufal Azka - SMAN 5 Surabaya - Target: FK UNAIR (pilihan 1), Farmasi ITS (pilihan 2) - Nilai TO Terakhir: PU 690, PPU 670, KBM 710, PK 740, LBI 700, LBE 680, PM 660.
2. Clarissa Zahra - SMA Al-Azhar 1 Jakarta - Target: SBM ITB (pilihan 1), Manajemen UI (pilihan 2) - Nilai TO Terakhir: PU 720, PPU 700, KBM 730, PK 690, LBI 750, LBE 740, PM 680.`
    },
    {
      title: 'Koreksi Target & Evaluasi Ambis',
      instruction: 'Evaluasi ulang seluruh siswa: jika siswa sudah tembus passing grade Pilihan 1, naikkan target ambisnya sebesar +15 poin dan berikan rekomendasi mempertahankan skor di subtest terkuatnya.',
      rawSample: ''
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawText(text);
    };
    reader.readAsText(file);
  };

  const handleProcessWithAi = async () => {
    if (!rawText.trim() && !instruction.trim()) {
      setErrorMsg('Harap masukkan teks data atau instruksi untuk AI.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/ai/edit-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: rawText,
          instruction,
          currentStudents: students,
          mode: 'smart_edit'
        })
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || 'Gagal memproses data dengan AI');
      }

      setAiResult(resJson.data);
    } catch (err: any) {
      console.error('Error invoking AI:', err);
      setErrorMsg(err.message || 'Terjadi gangguan saat menghubungi Gemini AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!aiResult || !aiResult.students) return;

    // Determine merge strategy
    let finalStudents: Student[] = [];
    if (aiResult.actionType === 'add') {
      finalStudents = [...aiResult.students, ...students];
    } else if (aiResult.actionType === 'replace') {
      finalStudents = aiResult.students;
    } else {
      // Update existing or add if not found
      const existingMap = new Map(students.map((s) => [s.id, s]));
      for (const updatedStudent of aiResult.students) {
        existingMap.set(updatedStudent.id, updatedStudent);
      }
      finalStudents = Array.from(existingMap.values());
    }

    onApplyChanges(finalStudents, aiResult.summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[92vh]">
        
        {/* Header with Emerald-Sky-Yellow gradient */}
        <div className="bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">
                  AI Smart Editor & Data Uploader
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-emerald-800">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Otomatisasi pengeditan, normalisasi format kampus, kalkulasi subtest, dan impor data massal.
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs sm:text-sm text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-amber-500" />
              Pilih Skenario Edit Cepat AI (Klik Salah Satu):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {presetPrompts.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInstruction(preset.instruction);
                    if (preset.rawSample) setRawText(preset.rawSample);
                  }}
                  className="p-3 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 block">
                    {preset.title}
                  </span>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {preset.instruction}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Upload File or Paste Box */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Data Mentah / File Upload:
              </label>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{fileName ? `File: ${fileName}` : 'Unggah File (CSV/TXT/JSON)'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".csv,.json,.txt"
                className="hidden"
              />
            </div>

            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Tempelkan (paste) teks pendaftaran siswa, format chat WA, atau baris data spreadsheet di sini. AI akan mengenali nama, sekolah, PTN pilihan, dan nilai subtest secara otomatis..."
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Prompt / Instruction Input */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-600" />
              Instruksi Pengeditan Data untuk AI:
            </label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Contoh: Perbaiki typo nama kampus, tambahkan TO-7, dan buatkan analisis kekuatan subtest..."
              className="w-full py-2.5 px-3.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Action Trigger Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleProcessWithAi}
              disabled={isLoading}
              className={`py-3 px-6 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-sky-600 to-amber-500 hover:opacity-95'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Sedang Menganalisis & Mengedit Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Jalankan AI Data Editor</span>
                </>
              )}
            </button>
          </div>

          {/* AI Result Preview Panel */}
          {aiResult && (
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Hasil Pengolahan AI Gemini
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-1">
                    {aiResult.summary}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {aiResult.students.length} Siswa Terproses
                </span>
              </div>

              {aiResult.warnings && aiResult.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                  <span className="font-bold block">Catatan Penyesuaian AI:</span>
                  {aiResult.warnings.map((w, idx) => (
                    <div key={idx}>• {w}</div>
                  ))}
                </div>
              )}

              {/* Preview Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white max-h-56">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold text-[11px] border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="py-2 px-3">Nama Siswa</th>
                      <th className="py-2 px-3">Asal Sekolah</th>
                      <th className="py-2 px-3">Pilihan 1 & PG</th>
                      <th className="py-2 px-3 text-center">Jumlah TO</th>
                      <th className="py-2 px-3 text-center">Skor Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {aiResult.students.map((st) => {
                      const latest = st.tryOuts[st.tryOuts.length - 1];
                      return (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold">{st.name}</td>
                          <td className="py-2 px-3">{st.school}</td>
                          <td className="py-2 px-3">
                            <span className="font-semibold text-sky-800">{st.choice1.major}</span>{' '}
                            <span className="text-slate-500">({st.choice1.university})</span>
                          </td>
                          <td className="py-2 px-3 text-center font-mono">{st.tryOuts.length}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700">
                            {latest ? latest.totalScore : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Confirm Apply Button */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600">
                  Perubahan siap diterapkan langsung ke database siswa.
                </span>

                <button
                  onClick={handleApply}
                  className="py-2.5 px-5 rounded-xl font-bold text-white text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Terapkan Perubahan ke Database
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>

    </div>
  );
};
