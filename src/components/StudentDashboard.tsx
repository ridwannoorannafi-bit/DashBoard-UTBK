import React, { useState } from 'react';
import { Student, SubtestKey, TryOutResult, PortalUiSettings } from '../types/utbk';
import { SUBTEST_DEFINITIONS, NATIONAL_AVERAGES } from '../data/utbkMeta';
import { DEFAULT_UI_SETTINGS } from '../utils/storage';
import { 
  GraduationCap, 
  TrendingUp, 
  Target, 
  Award, 
  School, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  FileText, 
  Check, 
  Compass, 
  Brain, 
  Layers,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  onOpenReport: () => void;
  activeNavTab?: string;
  uiSettings?: PortalUiSettings;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onOpenReport,
  activeNavTab = 'overview',
  uiSettings = DEFAULT_UI_SETTINGS
}) => {
  const themeGradients = {
    tesla_classic: 'from-slate-900 via-sky-950 to-emerald-950 border-slate-800',
    sapphire_gold: 'from-slate-950 via-blue-950 to-slate-900 border-blue-900/60',
    emerald_teal: 'from-teal-950 via-slate-900 to-emerald-950 border-teal-800/60',
    crimson_amber: 'from-rose-950 via-slate-950 to-slate-900 border-rose-900/60'
  };
  const activeHeroGradient = themeGradients[uiSettings.theme || 'tesla_classic'];

  const [selectedSubtestKey, setSelectedSubtestKey] = useState<SubtestKey>('pu');
  const [subtestFilterCategory, setSubtestFilterCategory] = useState<'ALL' | 'TPS' | 'Literasi'>('ALL');
  const [hoveredTO, setHoveredTO] = useState<TryOutResult | null>(null);

  const tryOuts = student.tryOuts;
  const latestTO = tryOuts[tryOuts.length - 1];
  const initialTO = tryOuts[0];
  const currentTotalScore = latestTO ? latestTO.totalScore : 0;
  const deltaTotal = latestTO && initialTO ? latestTO.totalScore - initialTO.totalScore : 0;

  // Passing grade comparison
  const choice1Passing = student.choice1.passingGradeEstimate;
  const choice2Passing = student.choice2.passingGradeEstimate;
  const isPassingChoice1 = currentTotalScore >= choice1Passing;
  const isPassingChoice2 = currentTotalScore >= choice2Passing;
  const targetGap = currentTotalScore - student.targetScore;

  // Filtered subtest evaluations
  const evaluations = student.evaluations || [];
  const filteredEvaluations = evaluations.filter((ev) => {
    if (subtestFilterCategory === 'ALL') return true;
    return ev.category === subtestFilterCategory;
  });

  const selectedEvaluation = evaluations.find((e) => e.subtestKey === selectedSubtestKey) || evaluations[0];
  const selectedMeta = selectedEvaluation ? SUBTEST_DEFINITIONS[selectedEvaluation.subtestKey] : SUBTEST_DEFINITIONS.pu;

  // Chart coordinate calculations
  const chartHeight = 220;
  const chartWidth = 650;
  const paddingX = 40;
  const paddingY = 30;
  const minScore = 500;
  const maxScore = 800;

  const getX = (index: number, total: number) => {
    if (total <= 1) return chartWidth / 2;
    return paddingX + (index / (total - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (score: number) => {
    const clamped = Math.max(minScore, Math.min(maxScore, score));
    return chartHeight - paddingY - ((clamped - minScore) / (maxScore - minScore)) * (chartHeight - paddingY * 2);
  };

  // Build SVG path for student line
  const points = tryOuts.map((to, i) => `${getX(i, tryOuts.length)},${getY(to.totalScore)}`).join(' ');
  const areaPoints = `${getX(0, tryOuts.length)},${chartHeight - paddingY} ` +
    points +
    ` ${getX(tryOuts.length - 1, tryOuts.length)},${chartHeight - paddingY}`;

  const targetLineY = getY(student.targetScore);
  const choice1LineY = getY(choice1Passing);

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. HERO STUDENT REPORT CARD BANNER */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${activeHeroGradient} text-white shadow-xl`}>
        {/* Glow ambient background rings */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          
          {/* Top meta strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm flex items-center justify-center shrink-0">
                <img
                  src="/assets/aistudio/Dokumen_dari_RNA__1__5243d24d.png"
                  alt="Rumah Belajar Tesla"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-slate-950 tracking-wide uppercase">
                {student.classGroup}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                NISN / ID: <span className="text-white font-bold">{student.id}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenReport}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-950" />
                Cetak Rapor Resmi
              </button>
            </div>
          </div>

          {/* Student Profile & Target Campus Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
            
            {/* Left: Student Identity */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-400 p-1 shrink-0 shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl font-black text-amber-300">
                    {student.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {student.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1 font-medium">
                    <School className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{student.school}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-2 flex flex-wrap gap-2">
                {isPassingChoice1 ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Memenuhi Passing Grade Pilihan 1!
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Selisih {Math.abs(choice1Passing - currentTotalScore)} Poin Menuju Pilihan 1
                  </div>
                )}
              </div>
            </div>

            {/* Right: Target PTN & Score Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pilihan 1 Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-sky-500/30 hover:border-sky-400/50 transition-all backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Pilihan 1 (Prioritas Utama)
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isPassingChoice1 ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {isPassingChoice1 ? 'LOLOS ESTIMASI' : 'KEJAR POIN'}
                  </span>
                </div>
                <div className="font-bold text-sm text-white">{student.choice1.major}</div>
                <div className="text-xs text-sky-200 mt-0.5">{student.choice1.university}</div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Passing Grade:</span>
                  <span className="font-bold text-sky-300 tabular-nums">{student.choice1.passingGradeEstimate} Skor</span>
                </div>
              </div>

              {/* Pilihan 2 Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30 hover:border-emerald-400/50 transition-all backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Pilihan 2 (Cadangan Strategis)
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isPassingChoice2 ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {isPassingChoice2 ? 'AMAN' : 'WASPADA'}
                  </span>
                </div>
                <div className="font-bold text-sm text-white">{student.choice2.major}</div>
                <div className="text-xs text-emerald-200 mt-0.5">{student.choice2.university}</div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Passing Grade:</span>
                  <span className="font-bold text-emerald-300 tabular-nums">{student.choice2.passingGradeEstimate} Skor</span>
                </div>
              </div>

            </div>

          </div>

          {/* 4-KPI Strip below hero */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Skor TO Terkini</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                  {currentTotalScore}
                </span>
                <span className="text-xs text-slate-400">/ 850</span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Target Ambis Siswa</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tabular-nums">
                  {student.targetScore}
                </span>
                <span className="text-[11px] font-bold text-amber-200">
                  {targetGap >= 0 ? `+${targetGap} Poin` : `${targetGap} Poin`}
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Kenaikan Skor</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono tabular-nums">
                  +{deltaTotal}
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> 6 Try Out
                </span>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3.5 border border-white/5">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Persentil Nasional</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tabular-nums">
                  Top {100 - (latestTO?.percentileRank || 95)}%
                </span>
                <span className="text-xs text-slate-400">Nasional</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. PROGRESS SCORE TRY OUT SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Progress Score Try Out Intensif
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pantau fluktuasi grafik nilai TO 1 sampai TO 6 terhadap garis Passing Grade PTN Pilihan & Target Skor Siswa.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500" />
              <span className="text-slate-700">Skor Siswa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-sky-600" />
              <span className="text-slate-700">Passing Grade Pilihan 1 ({choice1Passing})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-amber-500" />
              <span className="text-slate-700">Target Ambis ({student.targetScore})</span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Chart Viewport */}
        <div className="relative w-full overflow-x-auto bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-6">
          <div className="min-w-[620px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-64 overflow-visible"
            >
              <defs>
                <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines & Y-Axis labels */}
              {[500, 600, 700, 800].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94a3b8"
                      className="font-mono tabular-nums font-bold"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Target Line (Amber / Yellow) */}
              {uiSettings.showTargetLine && (
                <>
                  <line
                    x1={paddingX}
                    y1={targetLineY}
                    x2={chartWidth - paddingX}
                    y2={targetLineY}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <text
                    x={chartWidth - paddingX + 6}
                    y={targetLineY + 3}
                    fontSize="9"
                    fill="#d97706"
                    fontWeight="bold"
                  >
                    Target: {student.targetScore}
                  </text>
                </>
              )}

              {/* Choice 1 Passing Grade Line (Sky Blue) */}
              <line
                x1={paddingX}
                y1={choice1LineY}
                x2={chartWidth - paddingX}
                y2={choice1LineY}
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <text
                x={chartWidth - paddingX + 6}
                y={choice1LineY + 3}
                fontSize="9"
                fill="#0369a1"
                fontWeight="bold"
              >
                FK UI: {choice1Passing}
              </text>

              {/* Area gradient under score line */}
              <polygon points={areaPoints} fill="url(#emeraldArea)" />

              {/* Main Score Line (Emerald Green) */}
              <polyline
                points={points}
                fill="none"
                stroke="#059669"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & interactive circles */}
              {tryOuts.map((to, i) => {
                const x = getX(i, tryOuts.length);
                const y = getY(to.totalScore);
                const isHovered = hoveredTO?.toId === to.toId;
                const isLast = i === tryOuts.length - 1;

                return (
                  <g
                    key={to.toId}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredTO(to)}
                    onClick={() => setHoveredTO(to)}
                  >
                    <circle
                      cx={x}
                      y={y}
                      r={isHovered ? 8 : isLast ? 6.5 : 5}
                      fill={isLast ? '#f59e0b' : '#059669'}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all"
                    />

                    {/* Value label on top of point */}
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#0f172a"
                      fontWeight="bold"
                      className="font-mono tabular-nums"
                    >
                      {to.totalScore}
                    </text>

                    {/* X-Axis TO Title label */}
                    <text
                      x={x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                      fontWeight="600"
                    >
                      TO-{i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active / Hovered TO Detail Popover */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                Detail Skor {hoveredTO ? hoveredTO.title : latestTO?.title}:
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono tabular-nums">
                Total: {hoveredTO ? hoveredTO.totalScore : latestTO?.totalScore}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-600 font-mono text-[11px]">
              {Object.entries((hoveredTO || latestTO)?.subtests || {}).map(([key, val]) => (
                <span key={key} className="bg-white border border-slate-200 px-2 py-0.5 rounded">
                  <strong className="text-slate-800 uppercase">{key}:</strong>{' '}
                  <span className="text-emerald-700 font-bold tabular-nums">{val}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* TO Table History Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {tryOuts.map((to, i) => {
            const prevTO = i > 0 ? tryOuts[i - 1] : null;
            const diff = prevTO ? to.totalScore - prevTO.totalScore : 0;
            const isHighest = to.totalScore === Math.max(...tryOuts.map((t) => t.totalScore));

            return (
              <div
                key={to.toId}
                onClick={() => setHoveredTO(to)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  (hoveredTO?.toId || latestTO?.toId) === to.toId
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-bold">TO {i + 1}</span>
                  {isHighest && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                      Rekor
                    </span>
                  )}
                </div>
                <div className="text-lg font-black text-slate-900 font-mono tabular-nums">
                  {to.totalScore}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  {to.date}
                </div>
                {i > 0 && (
                  <div
                    className={`text-[10px] font-bold mt-1.5 flex items-center justify-center gap-0.5 ${
                      diff >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    <span>{diff >= 0 ? `+${diff}` : `${diff}`}</span>
                    <TrendingUp className={`w-3 h-3 ${diff < 0 ? 'rotate-180 text-rose-500' : ''}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* 3. EVALUASI TIAP SUBTEST UTBK SNBT */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Evaluasi Tiap Subtest UTBK
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analisis akurasi, perbandingan skor terhadap target & rata-rata nasional, serta rekomendasi perbaikan materi.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSubtestFilterCategory('ALL')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                subtestFilterCategory === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua (7 Subtest)
            </button>
            <button
              onClick={() => setSubtestFilterCategory('TPS')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                subtestFilterCategory === 'TPS'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TPS (4 Subtest)
            </button>
            <button
              onClick={() => setSubtestFilterCategory('Literasi')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                subtestFilterCategory === 'Literasi'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Literasi (3 Subtest)
            </button>
          </div>
        </div>

        {/* Subtest Horizontal Selector Pills/Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
          {evaluations.map((ev) => {
            const isSelected = ev.subtestKey === selectedSubtestKey;
            const meta = SUBTEST_DEFINITIONS[ev.subtestKey];

            return (
              <button
                key={ev.subtestKey}
                onClick={() => setSelectedSubtestKey(ev.subtestKey)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-2 ring-sky-400/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {meta.code}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                      ev.status === 'Aman'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ev.status === 'Waspada'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {meta.shortName}
                </div>
                <div className="text-base font-black text-slate-900 font-mono tabular-nums mt-1">
                  {ev.currentScore}
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Evaluation Spotlight for Selected Subtest */}
        {selectedEvaluation && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                    {selectedEvaluation.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedMeta.questionCount} Soal · Durasi {selectedMeta.durationMinutes} Menit
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {selectedEvaluation.subtestName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  {selectedMeta.description}
                </p>
              </div>

              {/* Score Comparison Bars */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 min-w-[260px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Skor Siswa:</span>
                  <span className="font-black text-emerald-600 font-mono text-base tabular-nums">
                    {selectedEvaluation.currentScore}
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (selectedEvaluation.currentScore / 850) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Min: 300</span>
                    <span className="text-amber-700 font-bold">Target: {selectedEvaluation.targetScore}</span>
                    <span>Max: 850</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Rata-rata Nasional:</span>
                  <span className="font-bold text-slate-700 font-mono tabular-nums">
                    {selectedEvaluation.nationalAverage}
                  </span>
                </div>
              </div>

            </div>

            {/* Strengths, Weaknesses, and Actionable Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              
              {/* Strengths */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm mb-3">
                  <Check className="w-4 h-4 bg-emerald-100 rounded-full p-0.5" />
                  Kekuatan Siswa
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {selectedEvaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
                <div className="flex items-center gap-2 text-amber-700 font-extrabold text-sm mb-3">
                  <AlertTriangle className="w-4 h-4 bg-amber-100 rounded-full p-0.5" />
                  Titik Rawan / Kelemahan
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {selectedEvaluation.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-white p-5 rounded-2xl border border-sky-200 shadow-xs">
                <div className="flex items-center gap-2 text-sky-700 font-extrabold text-sm mb-3">
                  <Zap className="w-4 h-4 bg-sky-100 rounded-full p-0.5" />
                  Rekomendasi Tutor
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {selectedEvaluation.recommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}

      </section>

      {/* 4. CATATAN & ARAHAN EVALUASI TUTOR / MENTOR BIMBEL */}
      {uiSettings.showMentorNotesToStudent && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Catatan Bimbingan Mentor Intensif
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Instruksi personal, strategi pemilihan jurusan, dan catatan psikologi belajar dari konselor & pengajar.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {student.tutorNotes && student.tutorNotes.length > 0 ? (
              student.tutorNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {note.tutorName}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          note.category === 'Akademik'
                            ? 'bg-sky-100 text-sky-800'
                            : note.category === 'Strategi'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {note.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {note.date}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    "{note.note}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Belum ada catatan mentor untuk siswa ini.
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};
