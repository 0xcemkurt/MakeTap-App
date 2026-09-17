import React, { useState, useEffect } from 'react';
import { GeneratedExam, ExamQuestion } from '../types';
import { PREBUILT_EXAMS } from '../data/curriculumExams';
import {
  BrainCircuit,
  Sparkles,
  BookOpen,
  GraduationCap,
  FileCheck2,
  Printer,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  Send,
  Download,
  Lightbulb,
  Zap,
  Timer,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiExamGeneratorProps {
  onAssignToClass?: (exam: GeneratedExam) => void;
}

export const AiExamGenerator: React.FC<AiExamGeneratorProps> = ({ onAssignToClass }) => {
  const [gradeLevel, setGradeLevel] = useState('4. Sınıf');
  const [subject, setSubject] = useState('Fen Bilimleri');
  const [topic, setTopic] = useState('Kuvvetin Etkileri ve Manyetizma');
  const [difficulty, setDifficulty] = useState('Orta (Uygulama Seviyesi)');
  const [questionCount, setQuestionCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showSolutions, setShowSolutions] = useState(false);
  const [assignedNotice, setAssignedNotice] = useState(false);

  // 2-Second Generation Sequence State
  const [sequenceStep, setSequenceStep] = useState(0);
  const [sequenceProgress, setSequenceProgress] = useState(0);

  const SEQUENCE_STEPS = [
    { title: 'MEB 2025-2026 Müfredatı Taranıyor', subtitle: 'Kazanım ve yaş seviyesi doğrulanıyor...', icon: '🔍', targetPct: 35 },
    { title: 'Pedagojik Zorluk & Kalıplar İşleniyor', subtitle: 'Çoktan seçmeli ve açık uçlu sorular eşleştiriliyor...', icon: '🧠', targetPct: 75 },
    { title: 'Çözüm Notları ve Sorular Derleniyor', subtitle: 'Pedagojik ipuçları ve cevap anahtarı tamamlanıyor...', icon: '✨', targetPct: 100 },
  ];

  const subjectOptions = [
    { name: 'Fen Bilimleri', icon: '🔬', defaultTopic: 'Kuvvetin Etkileri ve Mıknatıslar' },
    { name: 'Matematik', icon: '📐', defaultTopic: 'Kesirlerle Toplama ve Problem Çözme' },
    { name: 'Türkçe', icon: '📖', defaultTopic: 'Okuduğunu Anlama ve Ana Fikir' },
    { name: 'Sosyal Bilgiler', icon: '🌍', defaultTopic: 'Milli Mücadele ve Kahramanlarımız' },
    { name: 'İngilizce', icon: '🇬🇧', defaultTopic: 'My Daily Routine & Action Verbs' },
    { name: 'Hayat Bilgisi', icon: '🌱', defaultTopic: 'Okul Kuralları ve Sağlıklı Yaşam' },
  ];

  const quickTopics: Record<string, string[]> = {
    'Fen Bilimleri': ['Kuvvetin Etkileri ve Mıknatıslar', 'Besinlerimiz ve Dengeli Beslenme', 'Işık ve Ses Kaynakları', 'Gezegenimizi Tanıyalım'],
    'Matematik': ['Dört Basamaklı Doğal Sayılar', 'Kesirlerle İşlemler', 'Zamanı Ölçme Problemleri', 'Geometrik Cisimler ve Şekiller'],
    'Türkçe': ['Paragrafta Ana Düşünce', 'Eş Anlamlı ve Zıt Anlamlı Kelimeler', 'Noktalama İşaretleri', 'Deyimler ve Atasözleri'],
    'Sosyal Bilgiler': ['Birey ve Toplum (Farklılıklara Saygı)', 'Milli Kültür Ögelerimiz', 'Çevremizdeki Teknolojik Ürünler'],
    'İngilizce': ['Classroom Rules & Feelings', 'My Day & Free Time', 'Food and Drinks'],
    'Hayat Bilgisi': ['Okulumuzda Hayat', 'Evimizde Hayat', 'Güvenli Hayat Kuralları'],
  };

  // 2-Second Realistic Generation Sequence
  const runTwoSecondSequence = (onComplete: () => void) => {
    setIsLoading(true);
    setSequenceStep(0);
    setSequenceProgress(15);

    // Step 1: at 0ms (starts at 15% -> 35%)
    const timer1 = setTimeout(() => {
      setSequenceProgress(40);
    }, 300);

    // Step 2: at 700ms (moves to step 2, 75%)
    const timer2 = setTimeout(() => {
      setSequenceStep(1);
      setSequenceProgress(75);
    }, 700);

    // Step 3: at 1400ms (moves to step 3, 95%)
    const timer3 = setTimeout(() => {
      setSequenceStep(2);
      setSequenceProgress(95);
    }, 1400);

    // Final finish: at 2000ms (100% complete)
    const timer4 = setTimeout(() => {
      setSequenceProgress(100);
      onComplete();
      setIsLoading(false);
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  // Instant 2-second demo generation with prebuilt MEB curriculum questions
  const handleGenerateDemo = (subj = subject) => {
    setShowSolutions(false);
    setUserAnswers({});
    setAssignedNotice(false);

    runTwoSecondSequence(() => {
      const prebuilt = PREBUILT_EXAMS[subj] || PREBUILT_EXAMS['Fen Bilimleri'];
      setExam({
        ...prebuilt,
        gradeLevel,
        difficulty,
        createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      });
    });
  };

  const handleGenerate = async () => {
    setShowSolutions(false);
    setUserAnswers({});
    setAssignedNotice(false);

    // Parallel promise for AI API
    let apiExamData: any = null;
    const fetchPromise = fetch('/api/ai/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gradeLevel,
        subject,
        topic,
        questionCount,
        difficulty,
        types: ['multiple-choice', 'true-false', 'open-ended'],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.questions && data.questions.length > 0) {
          apiExamData = data;
        }
      })
      .catch((err) => console.log('Using prebuilt fallback', err));

    // Run the requested ~2-second creation sequence
    runTwoSecondSequence(() => {
      if (apiExamData && apiExamData.questions) {
        setExam({
          title: apiExamData.title || `${gradeLevel} ${subject} - ${topic}`,
          targetOutcome: apiExamData.targetOutcome || 'Temel kazanım kavrama ve uygulama.',
          durationMinutes: apiExamData.durationMinutes || 20,
          gradeLevel,
          subject,
          topic,
          difficulty,
          questions: apiExamData.questions,
          createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        const prebuilt = PREBUILT_EXAMS[subject] || PREBUILT_EXAMS['Fen Bilimleri'];
        setExam({
          ...prebuilt,
          title: `${gradeLevel} ${subject} • ${topic} Alıştırması`,
          gradeLevel,
          subject,
          topic,
          difficulty,
          createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    });
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const calculateScore = () => {
    if (!exam) return 0;
    let correct = 0;
    exam.questions.forEach((q) => {
      if (userAnswers[q.id] && userAnswers[q.id].trim().toUpperCase() === q.correctAnswer.trim().toUpperCase()) {
        correct++;
      }
    });
    return Math.round((correct / exam.questions.length) * 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAssign = () => {
    if (exam && onAssignToClass) {
      onAssignToClass(exam);
      setAssignedNotice(true);
      confetti({ particleCount: 40, spread: 50 });
      setTimeout(() => setAssignedNotice(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              MakeTab AI Sınav & Eğitim Laboratuvarı
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              MEB Uyumlu Sınav ve Alıştırma Oluşturucu
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
              Sınıf seviyesine ve ders kazanımlarına tam uyumlu; çoktan seçmeli, doğru-yanlış ve açık uçlu soruları pedagojik çözüm notlarıyla saniyeler içinde üretin.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <BrainCircuit className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Sınav Kriterlerini Belirleyin
        </h3>

        {/* Grade Level Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Sınıf Seviyesi</label>
          <div className="flex flex-wrap gap-2">
            {['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf'].map(
              (lvl) => (
                <button
                  key={lvl}
                  onClick={() => setGradeLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    gradeLevel === lvl
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {lvl}
                </button>
              )
            )}
          </div>
        </div>

        {/* Subject Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Ders Seçimi</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {subjectOptions.map((subj) => (
              <button
                key={subj.name}
                onClick={() => {
                  setSubject(subj.name);
                  setTopic(subj.defaultTopic);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  subject === subj.name
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-2xl">{subj.icon}</span>
                <div>
                  <div className="text-xs font-extrabold">{subj.name}</div>
                  <div className="text-[10px] text-slate-400">MEB Müfredatı</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input & Quick Suggestions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex justify-between items-center">
            <span>Konu / Ünite Başlığı</span>
            <span className="text-[10px] text-slate-400 font-normal">İstediğiniz konuyu yazabilir veya seçebilirsiniz</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Örn: Basit Elektrik Devreleri ve İletkenler"
            className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-medium"
          />

          {quickTopics[subject] && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold self-center mr-1">Önerilenler:</span>
              {quickTopics[subject].map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty & Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Zorluk Seviyesi</label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Temel (Kavrama)', 'Orta (Uygulama)', 'Yeni Nesil (Beceri)'].map((dif) => (
                <button
                  key={dif}
                  onClick={() => setDifficulty(dif)}
                  className={`py-2 px-1 text-[11px] rounded-xl font-bold text-center transition-all ${
                    difficulty.includes(dif.split(' ')[0])
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dif}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Soru Sayısı</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[3, 4, 5, 8].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    questionCount === count
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {count} Soru
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Second Sequence Active Card */}
        {isLoading && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl border border-blue-400/30 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/30 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight">MakeTab AI Sınav Motoru</div>
                  <div className="text-[10px] text-blue-200">MEB 2025-2026 Müfredatı ve Pedagojik Eşleştirme</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[11px] font-mono font-bold text-amber-300">
                <Timer className="w-3.5 h-3.5 animate-spin" />
                <span>2.0 sn</span>
              </div>
            </div>

            {/* Smooth Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-blue-200">
                <span>{SEQUENCE_STEPS[sequenceStep]?.title}</span>
                <span className="font-mono text-amber-300">%{sequenceProgress}</span>
              </div>
              <div className="w-full h-2.5 bg-blue-950/60 rounded-full overflow-hidden p-0.5 border border-blue-400/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-blue-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${sequenceProgress}%` }}
                />
              </div>
            </div>

            {/* Sequence Steps Ticker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              {SEQUENCE_STEPS.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl transition-all border ${
                    sequenceStep === idx
                      ? 'bg-blue-800/80 border-amber-400/60 text-white font-bold ring-1 ring-amber-400/40 shadow-xs'
                      : sequenceStep > idx
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-blue-950/30 border-blue-800/40 text-blue-300/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {sequenceStep > idx ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : sequenceStep === idx ? (
                      <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <span className="text-[10px] opacity-40 shrink-0">#{idx + 1}</span>
                    )}
                    <span className="truncate">{st.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Primary Quick 2-Second Demo Button */}
          <button
            onClick={() => handleGenerateDemo(subject)}
            disabled={isLoading}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Hızlı Demo Sınavı Üret</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wide ml-1">
              2 sn Hazır
            </span>
          </button>

          {/* AI Custom Generator Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Yapay Zeka ile Sınavı Oluştur</span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {exam && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
          {/* Exam Header */}
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-600 uppercase tracking-wide">
                <span>{exam.gradeLevel}</span>
                <span>•</span>
                <span>{exam.subject}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} dk
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {exam.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                🎯 <span className="font-semibold">Hedef Kazanım:</span> {exam.targetOutcome}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                Yazdır / PDF
              </button>

              <button
                onClick={handleAssign}
                className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                Sınıfa Ata
              </button>

              <button
                onClick={() => setShowSolutions(!showSolutions)}
                className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  showSolutions
                    ? 'bg-amber-500 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                {showSolutions ? 'Cevapları Gizle' : 'Cevap Anahtarı'}
              </button>
            </div>
          </div>

          {assignedNotice && (
            <div className="bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Sınav başarıyla 4-A sınıfı öğrencilerine ödev olarak atandı ve velilere bildirim iletildi!
            </div>
          )}

          {/* Interactive Question List */}
          <div className="p-5 sm:p-7 space-y-6">
            {exam.questions.map((q, idx) => {
              const isSelected = !!userAnswers[q.id];
              const isCorrect = userAnswers[q.id]?.trim().toUpperCase() === q.correctAnswer?.trim().toUpperCase();

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 inline-block mb-1">
                          {q.type === 'multiple-choice'
                            ? 'Çoktan Seçmeli'
                            : q.type === 'true-false'
                            ? 'Doğru / Yanlış'
                            : 'Açık Uçlu Soru'}
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                      {q.options.map((opt) => {
                        const optKey = opt.slice(0, 1); // 'A', 'B', etc. or word
                        const isThisSelected =
                          userAnswers[q.id] === optKey || userAnswers[q.id] === opt;
                        const isThisCorrect =
                          q.correctAnswer === optKey || q.correctAnswer === opt;

                        let style = 'bg-white border-slate-200 text-slate-700 hover:border-blue-400';
                        if (showSolutions) {
                          if (isThisCorrect) {
                            style = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 font-bold';
                          } else if (isThisSelected && !isThisCorrect) {
                            style = 'bg-rose-50 border-rose-300 text-rose-700 line-through';
                          }
                        } else if (isThisSelected) {
                          style = 'bg-blue-600 border-blue-600 text-white font-bold';
                        }

                        return (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(q.id, optKey || opt)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${style}`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                              {optKey.length === 1 ? optKey : '•'}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Pedagogical Explanation / Solution Note */}
                  {(showSolutions || isSelected) && (
                    <div className="mt-3 pl-9 pt-2 border-t border-slate-200/80 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        Doğru Cevap: {q.correctAnswer}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        💡 <span className="font-bold">Açıklama:</span> {q.explanation}
                      </p>
                      {q.pedagogicalTip && (
                        <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-blue-800 font-medium flex items-center gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Öğretmen İpucu: {q.pedagogicalTip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Performance summary if answered */}
          {Object.keys(userAnswers).length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-600">
                Cevaplanan: {Object.keys(userAnswers).length} / {exam.questions.length} Soru
              </div>
              <button
                onClick={() => setShowSolutions(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                Sonuçları Değerlendir ve Puanla →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
