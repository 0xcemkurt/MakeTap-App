import React, { useState } from 'react';
import { Student, CharacterAnalysisResult } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Sparkles,
  Heart,
  Compass,
  GraduationCap,
  MessageSquare,
  Send,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Award,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiCharacterAnalystProps {
  students: Student[];
  onSendMessageToParent?: (student: Student, text: string) => void;
}

export const AiCharacterAnalyst: React.FC<AiCharacterAnalystProps> = ({
  students,
  onSendMessageToParent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CharacterAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleRunAnalysis = async () => {
    if (!currentStudent) return;
    setIsLoading(true);
    setSentNotice(false);

    try {
      const positiveBehaviors = currentStudent.behaviorLogs
        .filter((l) => l.type === 'positive')
        .map((l) => l.skillTitle);
      const needsWorkBehaviors = currentStudent.behaviorLogs
        .filter((l) => l.type === 'needsWork')
        .map((l) => l.skillTitle);

      const response = await fetch('/api/ai/character-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: `${currentStudent.name} ${currentStudent.surname}`,
          ageOrGrade: '4. Sınıf',
          totalPoints: currentStudent.totalPoints,
          positiveBehaviors,
          needsWorkBehaviors,
          recentNotes: currentStudent.notes,
        }),
      });

      const data = await response.json();
      if (data.archetype) {
        setAnalysis({
          studentId: currentStudent.id,
          studentName: `${currentStudent.name} ${currentStudent.surname}`,
          archetype: data.archetype,
          avatarMood: data.avatarMood || '🌟 İleri Görüşlü',
          summary: data.summary,
          characterStrengths: data.characterStrengths || [],
          growthOpportunities: data.growthOpportunities || [],
          teacherRecommendations: data.teacherRecommendations || [],
          parentFeedbackLetter: data.parentFeedbackLetter || '',
          analyzedAt: new Date().toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        });
        confetti({ particleCount: 55, spread: 65 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLetter = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.parentFeedbackLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToParent = () => {
    if (!analysis || !currentStudent) return;
    if (onSendMessageToParent) {
      onSendMessageToParent(currentStudent, analysis.parentFeedbackLetter);
      setSentNotice(true);
      confetti({ particleCount: 40, spread: 50 });
      setTimeout(() => setSentNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-sky-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              MakeTab Pedagojik AI Karakter Analisti
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Öğrenci Karakteri ve Davranış Haritası
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
              Öğrencinin kazandığı erdemleri, sınıf içi etkileşimlerini ve gelişim alanlarını yapay zeka psikolojisiyle analiz edin, velisine sıcak pedagojik mektuplar hazırlayın.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Student Selector Carousel / Strip */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Analiz Edilecek Öğrenciyi Seçin
          </span>
          <span className="text-xs font-semibold text-blue-600">
            {students.length} Öğrenci Kayıtlı
          </span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {students.map((std) => {
            const isSelected = std.id === selectedStudentId;
            return (
              <button
                key={std.id}
                onClick={() => {
                  setSelectedStudentId(std.id);
                  setAnalysis(null);
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center min-w-[84px] transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 shadow-md scale-105 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <StudentAvatar
                  name={std.name}
                  color={std.avatarColor}
                  points={std.totalPoints}
                  size="sm"
                />
                <span className="mt-1.5 text-xs font-bold text-slate-800 line-clamp-1">
                  {std.name}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  #{std.studentNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Student Highlight & Trigger */}
      {currentStudent && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <StudentAvatar
              name={currentStudent.name}
              color={currentStudent.avatarColor}
              points={currentStudent.totalPoints}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  {currentStudent.name} {currentStudent.surname}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                  +{currentStudent.totalPoints} Puan
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Veli: {currentStudent.parentName} • {currentStudent.parentPhone}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                <span>🟢 {currentStudent.positivePoints} Olumlu</span>
                <span>🟠 {currentStudent.needsWorkPoints} Geliştirilmeli</span>
                <span>📋 {currentStudent.behaviorLogs.length} Kayıt</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Pedagojik Karakter Analiz Ediliyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{currentStudent.name} İçin Karakter Analizi Yap</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Analysis Output Result Card */}
      {analysis && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-300 space-y-6 p-5 sm:p-7">
          {/* Top Banner of Student Analysis */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold shrink-0">
                🎖️
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                  Karakter Arketipi
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  {analysis.archetype}
                </h3>
                <p className="text-xs text-slate-400">
                  Analiz Tarihi: {analysis.analyzedAt} • MakeTab AI Psikolojik Modelleme
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="self-start sm:self-auto py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Raporu Yazdır
            </button>
          </div>

          {/* Pedagojik Özet */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Genel Pedagojik Değerlendirme
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.summary}
            </p>
          </div>

          {/* Karakter Güçleri (Bar göstergeleri) */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Öne Çıkan Karakter Güçleri & Erdemler
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.characterStrengths.map((st, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{st.trait}</span>
                    <span className="text-xs font-black text-emerald-600">%{st.level}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${st.level}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{st.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gelişim Fırsatları & Öğretmen Stratejileri (2 Sütun) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gelişim Alanları */}
            <div className="p-4 rounded-2xl border border-amber-200/70 bg-amber-50/40 space-y-2">
              <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-600" />
                Gelişim Fırsatları & Rehberlik
              </h4>
              <ul className="space-y-1.5">
                {analysis.growthOpportunities.map((g, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Öğretmene Tavsiyeler */}
            <div className="p-4 rounded-2xl border border-indigo-200/70 bg-indigo-50/40 space-y-2">
              <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-indigo-600" />
                Sınıf İçi Pedagojik Stratejiler
              </h4>
              <ul className="space-y-1.5">
                {analysis.teacherRecommendations.map((t, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Veli İçin Samimi Gelişim Mektubu (Letter) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Veliye Özel Pozitif Geribildirim Mektubu
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLetter}
                  className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Kopyalandı' : 'Mektubu Kopyala'}
                </button>

                <button
                  onClick={handleSendToParent}
                  className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Veliye Sohbetten İlet
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line italic">
              "{analysis.parentFeedbackLetter}"
            </div>

            {sentNotice && (
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Mektup {currentStudent.parentName} velisine mesaj olarak gönderildi!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
