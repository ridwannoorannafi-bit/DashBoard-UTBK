import React, { useState } from 'react';
import { PortalUiSettings } from '../types/utbk';
import { DEFAULT_UI_SETTINGS } from '../utils/storage';
import { 
  Palette, 
  Layout, 
  Sliders, 
  Printer, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  ShieldCheck,
  Building,
  GraduationCap
} from 'lucide-react';

interface PortalSettingsModalProps {
  currentSettings: PortalUiSettings;
  onSave: (newSettings: PortalUiSettings) => void;
  onClose: () => void;
}

export const PortalSettingsModal: React.FC<PortalSettingsModalProps> = ({
  currentSettings,
  onSave,
  onClose
}) => {
  const [settings, setSettings] = useState<PortalUiSettings>({ ...currentSettings });
  const [activeTab, setActiveTab] = useState<'theme' | 'visibility' | 'thresholds' | 'letterhead'>('theme');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const themeOptions = [
    {
      id: 'tesla_classic' as const,
      name: 'Tesla Classic (Resmi)',
      desc: 'Hijau Zamrud, Biru Tesla & Aksen Kuning Emas khas Rumah Belajar Tesla.',
      badgeBg: 'bg-emerald-600',
      previewColors: ['bg-emerald-600', 'bg-sky-600', 'bg-amber-400']
    },
    {
      id: 'sapphire_gold' as const,
      name: 'Sapphire & Gold',
      desc: 'Biru Navy Sapphire megah dipadu aksen emas mewah berkarakter akademik.',
      badgeBg: 'bg-blue-800',
      previewColors: ['bg-blue-800', 'bg-indigo-600', 'bg-yellow-400']
    },
    {
      id: 'emerald_teal' as const,
      name: 'Emerald & Teal',
      desc: 'Nuansa hijau toska cerah, segar, dan fokus untuk kenyamanan belajar intensif.',
      badgeBg: 'bg-teal-600',
      previewColors: ['bg-teal-600', 'bg-emerald-500', 'bg-cyan-400']
    },
    {
      id: 'crimson_amber' as const,
      name: 'Crimson Sigma & Amber',
      desc: 'Merah Sigma bersemangat tinggi dan oranye amber untuk atmosfer ambis PTN.',
      badgeBg: 'bg-rose-600',
      previewColors: ['bg-rose-600', 'bg-amber-500', 'bg-slate-800']
    }
  ];

  const handleSave = () => {
    onSave(settings);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    if (confirm('Kembalikan seluruh pengaturan UI/UX ke konfigurasi standar Rumah Belajar Tesla?')) {
      setSettings({ ...DEFAULT_UI_SETTINGS });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-emerald-950 text-white p-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-xs">
              <Sliders className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Panel Pengaturan Host
                </span>
                <span className="text-xs text-emerald-300 font-bold">Kustomisasi UI/UX Portal</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Pengaturan Tampilan & Sistem Rapor
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-emerald-600" />
            Tema & Warna
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'visibility'
                ? 'border-sky-600 text-sky-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4 text-sky-600" />
            Visibilitas Modul Siswa
          </button>

          <button
            onClick={() => setActiveTab('thresholds')}
            className={`py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'thresholds'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Ambang Batas Nilai
          </button>

          <button
            onClick={() => setActiveTab('letterhead')}
            className={`py-3.5 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'letterhead'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            Kop Rapor & Dokumen
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs sm:text-sm text-emerald-900 font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Pengaturan UI/UX berhasil disimpan dan diterapkan langsung ke portal!</span>
            </div>
          )}

          {/* TAB 1: TEMA WARNA */}
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Pilih Aksen & Nuansa Visual Portal</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tema warna ini akan menyesuaikan aksen navigasi, gradient card, dan banner dashboard siswa maupun host.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {themeOptions.map((opt) => {
                  const isSelected = settings.theme === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSettings({ ...settings, theme: opt.id })}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mb-2.5">
                        {opt.previewColors.map((col, idx) => (
                          <span key={idx} className={`w-4 h-4 rounded-full ${col} shadow-2xs`} />
                        ))}
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900">{opt.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: VISIBILITAS MODUL */}
          {activeTab === 'visibility' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Visibilitas Fitur pada Tampilan Siswa</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Host dapat menyembunyikan atau menampilkan modul analitik sesuai tahap bimbingan berjalan.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                
                {/* 1. Garis Target */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <div className="pr-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Garis Target Skor pada Grafik Tren TO
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Menampilkan garis putus-putus emas penanda target skor ambis PTN siswa pada grafik kemajuan.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTargetLine}
                    onChange={(e) => setSettings({ ...settings, showTargetLine: e.target.checked })}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                </label>

                {/* 2. Passing Grade Status */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <div className="pr-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Status Kelulusan Passing Grade Pilihan 1 & 2
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Menampilkan indikator "Lolos Estimasi" atau "Kejar Poin" berdasarkan skor TO terakhir.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showPassingGradeStatus}
                    onChange={(e) => setSettings({ ...settings, showPassingGradeStatus: e.target.checked })}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                </label>

                {/* 3. AI Recommendations */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <div className="pr-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Rekomendasi Belajar Cerdas (AI Insights)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Menampilkan analisis taktis subtest yang paling mendesak ditingkatkan untuk siswa.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showAiRecommendations}
                    onChange={(e) => setSettings({ ...settings, showAiRecommendations: e.target.checked })}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                </label>

                {/* 4. Mentor Notes */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <div className="pr-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Tampilkan Modul Catatan & Bimbingan Mentor
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Siswa dapat membaca pesan strategi dan motivasi dari mentor di dashboard mereka.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showMentorNotesToStudent}
                    onChange={(e) => setSettings({ ...settings, showMentorNotesToStudent: e.target.checked })}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                </label>

                {/* 5. Subtest Breakdown */}
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:bg-slate-50/80 transition-colors cursor-pointer">
                  <div className="pr-4">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      Tabel Rincian Evaluasi 7 Subtest UTBK
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Menampilkan rincian skor, tingkat akurasi, kekuatan, dan kelemahan di tab evaluasi siswa.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showSubtestBreakdown}
                    onChange={(e) => setSettings({ ...settings, showSubtestBreakdown: e.target.checked })}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                  />
                </label>

              </div>
            </div>
          )}

          {/* TAB 3: AMBANG BATAS NILAI */}
          {activeTab === 'thresholds' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-900">Kriteria Status Kelulusan Subtest</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesuaikan batas skor untuk menentukan apakah performa subtest siswa masuk kategori "Aman", "Waspada", atau "Kritis".
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <label className="block text-xs font-extrabold text-emerald-900 mb-1">
                    Batas Minimum Status "Aman" (Skor)
                  </label>
                  <p className="text-[11px] text-emerald-700 mb-3">
                    Skor subtest di atas nilai ini ditandai hijau (Aman / Siap UTBK).
                  </p>
                  <input
                    type="number"
                    min="500"
                    max="800"
                    step="5"
                    value={settings.thresholdSafe}
                    onChange={(e) => setSettings({ ...settings, thresholdSafe: Number(e.target.value) })}
                    className="w-full py-2.5 px-3 bg-white border border-emerald-300 rounded-xl text-base font-black text-emerald-950 font-mono"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-xs font-extrabold text-amber-900 mb-1">
                    Batas Minimum Status "Waspada" (Skor)
                  </label>
                  <p className="text-[11px] text-amber-700 mb-3">
                    Skor di bawah ini otomatis menjadi status merah ("Kritis / Perlu Klinik").
                  </p>
                  <input
                    type="number"
                    min="400"
                    max="750"
                    step="5"
                    value={settings.thresholdWarning}
                    onChange={(e) => setSettings({ ...settings, thresholdWarning: Number(e.target.value) })}
                    className="w-full py-2.5 px-3 bg-white border border-amber-300 rounded-xl text-base font-black text-amber-950 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Petunjuk Standar BP3 SNBT:</span>
                Umumnya skor UTBK nasional berkisar rata-rata 520 - 550. Passing grade PTN favorit (UI, ITB, UGM, Unpad, ITS) biasanya berada pada rentang 640 - 720.
              </div>
            </div>
          )}

          {/* TAB 4: KOP RAPOR & PENANDATANGAN */}
          {activeTab === 'letterhead' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Kustomisasi Kop Dokumen & Penandatangan Rapor</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi ini dicetak resmi pada bagian atas (kop) dan lembar pengesahan cetak PDF laporan siswa.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lembaga / Bimbel pada Kop Surat
                  </label>
                  <input
                    type="text"
                    value={settings.kopTitle}
                    onChange={(e) => setSettings({ ...settings, kopTitle: e.target.value })}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                    placeholder="Contoh: RUMAH BELAJAR TESLA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tagline / Subtitle Program Bimbel
                  </label>
                  <input
                    type="text"
                    value={settings.kopSubtitle}
                    onChange={(e) => setSettings({ ...settings, kopSubtitle: e.target.value })}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900"
                    placeholder="Contoh: BIMBINGAN SUKSES PTN · Rumah keduanya siswa"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Cabang / Keterangan Legalitas
                  </label>
                  <input
                    type="text"
                    value={settings.kopAddress}
                    onChange={(e) => setSettings({ ...settings, kopAddress: e.target.value })}
                    className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900"
                    placeholder="Contoh: Layanan Konsultasi Akademik, Try Out Berstandar BP3 Kemendikbudristek & Bimbingan Klinik"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Penandatangan Rapor
                    </label>
                    <input
                      type="text"
                      value={settings.signatoryName}
                      onChange={(e) => setSettings({ ...settings, signatoryName: e.target.value })}
                      className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                      placeholder="Contoh: Dr. H. Hendra Wijaya, M.Pd"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jabatan Penandatangan
                    </label>
                    <input
                      type="text"
                      value={settings.signatoryTitle}
                      onChange={(e) => setSettings({ ...settings, signatoryTitle: e.target.value })}
                      className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                      placeholder="Contoh: Kepala Program Bimbingan Intensif PTN"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Default Tesla
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:opacity-95 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Simpan & Terapkan Pengaturan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
