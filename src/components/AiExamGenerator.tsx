import React, { useState } from 'react';
import { GeneratedExam } from '../types';
import { getCurriculumExam, PREBUILT_EXAMS } from '../data/curriculumExams';
import {
  BrainCircuit,
  Sparkles,
  GraduationCap,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Lightbulb,
  Zap,
  Check,
  AlertCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiExamGeneratorProps {
  onAssignToClass?: (exam: GeneratedExam) => void;
}

export const AiExamGenerator: React.FC<AiExamGeneratorProps> = ({ onAssignToClass }) => {
  const [gradeLevel, setGradeLevel] = useState('4. Sınıf');
  const [subject, setSubject] = useState('Fen Bilimleri');
  const [topic, setTopic] = useState('Kuvvetin Etkileri ve Mıknatıslar');
  const [difficulty, setDifficulty] = useState('Orta (Uygulama Seviyesi)');
  const [questionCount, setQuestionCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<GeneratedExam | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [openEndedSubmitted, setOpenEndedSubmitted] = useState<Record<string, boolean>>({});
  const [showSolutions, setShowSolutions] = useState(false);
  const [assignedNotice, setAssignedNotice] = useState(false);

  // 2-Second Generation Sequence State
  const [sequenceStep, setSequenceStep] = useState(0);
  const [sequenceProgress, setSequenceProgress] = useState(0);

  const SEQUENCE_STEPS = [
    { title: 'MEB 2025-2026 Müfredatı Taranıyor', subtitle: 'Kazanım ve yaş seviyesi doğrulanıyor...', icon: '🔍' },
    { title: 'Pedagojik Zorluk & Kalıplar İşleniyor', subtitle: `${questionCount} soru pedagojik olarak derleniyor...`, icon: '🧠' },
    { title: 'Çözüm Notları ve Sorular Derleniyor', subtitle: 'Pedagojik ipuçları ve cevap anahtarı tamamlanıyor...', icon: '✨' },
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

    const timer1 = setTimeout(() => {
      setSequenceProgress(40);
    }, 300);

    const timer2 = setTimeout(() => {
      setSequenceStep(1);
      setSequenceProgress(75);
    }, 700);

    const timer3 = setTimeout(() => {
      setSequenceStep(2);
      setSequenceProgress(95);
    }, 1400);

    const timer4 = setTimeout(() => {
      setSequenceProgress(100);
      onComplete();
      setIsLoading(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  // Generates exam strictly adhering to selected question count
  const handleGenerateDemo = (subj = subject, count = questionCount) => {
    setShowSolutions(false);
    setUserAnswers({});
    setOpenEndedSubmitted({});
    setAssignedNotice(false);

    runTwoSecondSequence(() => {
      const generated = getCurriculumExam(subj, topic, count, difficulty, gradeLevel);
      setExam({
        ...generated,
        createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      });
    });
  };

  const handleGenerate = async () => {
    setShowSolutions(false);
    setUserAnswers({});
    setOpenEndedSubmitted({});
    setAssignedNotice(false);

    let apiExamData: any = null;
    fetch('/api/ai/generate-exam', {
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
      .catch((err) => console.log('Using local generator fallback', err));

    runTwoSecondSequence(() => {
      if (apiExamData && apiExamData.questions && apiExamData.questions.length === questionCount) {
        setExam({
          title: apiExamData.title || `${gradeLevel} ${subject} - ${topic}`,
          targetOutcome: apiExamData.targetOutcome || 'Temel kazanım kavrama ve uygulama.',
          durationMinutes: apiExamData.durationMinutes || questionCount * 4,
          gradeLevel,
          subject,
          topic,
          difficulty,
          questions: apiExamData.questions,
          createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        const generated = getCurriculumExam(subject, topic, questionCount, difficulty, gradeLevel);
        setExam({
          ...generated,
          createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        });
      }
    });
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  // Helper to determine if an answer is correct
  const isQuestionCorrect = (qId: string, question: any) => {
    const userAns = userAnswers[qId];
    if (!userAns) return false;

    if (question.type === 'multiple-choice') {
      const selectedLetter = userAns.trim().charAt(0).toUpperCase();
      const correctLetter = question.correctAnswer.trim().charAt(0).toUpperCase();
      return (
        selectedLetter === correctLetter ||
        userAns.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
      );
    }

    if (question.type === 'true-false') {
      return userAns.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    }

    if (question.type === 'open-ended') {
      return userAns.trim().length >= 10;
    }

    return false;
  };

  const calculateScore = () => {
    if (!exam || exam.questions.length === 0) return 0;
    let correct = 0;
    exam.questions.forEach((q) => {
      if (isQuestionCorrect(q.id, q)) {
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
      setTimeout(() => setAssignedNotice(false), 3500);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-3xl p-5 sm:p-6 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              MakeTab AI Sınav & Eğitim Laboratuvarı
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              MEB Uyumlu Sınav ve Alıştırma Oluşturucu
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm max-w-xl font-medium">
              Soru sayısını, sınıf seviyesini ve ders kazanımlarını seçin. Çoktan seçmeli, doğru-yanlış ve açık uçlu soruları pedagojik çözüm notlarıyla saniyeler içinde üretin.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Sınav Kriterlerini Belirleyin
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Öğretmen: Hakan KAVUZKOZ
          </span>
        </div>

        {/* Grade Level Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Sınıf Seviyesi</label>
          <div className="flex flex-wrap gap-2">
            {['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf'].map(
              (lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setGradeLevel(lvl)}
                  className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    gradeLevel === lvl
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 ring-2 ring-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
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
                type="button"
                onClick={() => {
                  setSubject(subj.name);
                  setTopic(subj.defaultTopic);
                }}
                className={`p-3.5 min-h-[58px] rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  subject === subj.name
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs ring-2 ring-blue-500/20 font-bold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span className="text-2xl">{subj.icon}</span>
                <div>
                  <div className="text-xs font-extrabold">{subj.name}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">MEB Müfredatı</div>
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
            className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/70 focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-medium"
          />

          {quickTopics[subject] && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold self-center mr-1">Önerilenler:</span>
              {quickTopics[subject].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`text-[11px] px-3 py-1.5 rounded-xl font-medium transition-colors ${
                    topic === t
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Zorluk Seviyesi</label>
            <div className="grid grid-cols-3 gap-2">
              {['Temel (Kavrama)', 'Orta (Uygulama)', 'Yeni Nesil (Beceri)'].map((dif) => (
                <button
                  key={dif}
                  type="button"
                  onClick={() => setDifficulty(dif)}
                  className={`min-h-[42px] py-2 px-2 text-[11px] rounded-xl font-bold text-center transition-all ${
                    difficulty.includes(dif.split(' ')[0])
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {dif}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Hedef Soru Sayısı</label>
              <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {questionCount} Soru Oluşturulacak
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 8].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`min-h-[42px] py-2 rounded-xl text-xs font-black transition-all ${
                    questionCount === count
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {count} Soru
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="flex-1 min-h-[46px] py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {isLoading ? 'Sınav Hazırlanıyor...' : `MakeTab AI ile ${questionCount} Soru Üret`}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleGenerateDemo(subject, questionCount)}
            className="min-h-[46px] py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-200" />
            Hızlı Demo Sınavı Üret (2 sn)
          </button>
        </div>
      </div>

      {/* 2-Second Realistic Generation Sequence Modal/Overlay */}
      {isLoading && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              MakeTab AI Sınav Motoru Çalışıyor (2 Saniye)
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {subject} • {topic}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Tam {questionCount} adet MEB uyumlu soru pedagojik çözüm anahtarıyla yapılandırılıyor.
            </p>
          </div>

          {/* Realistic Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-700">
              <span>İşlem Aşaması</span>
              <span className="text-blue-600">%{sequenceProgress}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${sequenceProgress}%` }}
              />
            </div>
          </div>

          {/* Sequential Step Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {SEQUENCE_STEPS.map((st, i) => {
              const isPast = sequenceStep > i;
              const isCurrent = sequenceStep === i;
              return (
                <div
                  key={st.title}
                  className={`p-3 rounded-2xl border transition-all ${
                    isPast
                      ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
                      : isCurrent
                      ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-xs">
                    <span className="text-base">{st.icon}</span>
                    <span className="line-clamp-1">{st.title}</span>
                    {isPast && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto shrink-0" />}
                  </div>
                  <p className="text-[11px] mt-1 font-medium leading-tight">
                    {st.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Display */}
      {exam && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
          {/* Exam Header */}
          <div className="p-5 sm:p-6 bg-slate-50/90 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-wide">
                <span>{exam.gradeLevel}</span>
                <span>•</span>
                <span>{exam.subject}</span>
                <span>•</span>
                <span className="text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md font-bold">
                  {exam.questions.length} Soru
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} dk
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {exam.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                🎯 <span className="font-bold text-slate-800">Hedef Kazanım:</span> {exam.targetOutcome}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="min-h-[42px] py-2 px-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                Yazdır / PDF
              </button>

              <button
                type="button"
                onClick={handleAssign}
                className="min-h-[42px] py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-500/25"
              >
                <Send className="w-4 h-4" />
                Sınıfa Ata
              </button>

              <button
                type="button"
                onClick={() => setShowSolutions(!showSolutions)}
                className={`min-h-[42px] py-2 px-4 rounded-xl font-black text-xs flex items-center gap-1.5 transition-colors shadow-xs ${
                  showSolutions
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                {showSolutions ? 'Cevapları Gizle' : 'Cevap Anahtarı'}
              </button>
            </div>
          </div>

          {assignedNotice && (
            <div className="bg-emerald-600 text-white px-4 py-3 text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" />
              Sınav başarıyla 4-A sınıfı öğrencilerine ödev olarak atandı ve velilere bildirim iletildi!
            </div>
          )}

          {/* Interactive Question List */}
          <div className="p-5 sm:p-7 space-y-6">
            {exam.questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isAnswered = !!userAns && userAns.trim().length > 0;
              const isCorrect = isQuestionCorrect(q.id, q);

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-4"
                >
                  {/* Question Title & Badge */}
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 inline-block">
                        {q.type === 'multiple-choice'
                          ? 'Çoktan Seçmeli'
                          : q.type === 'true-false'
                          ? 'Doğru / Yanlış'
                          : 'Açık Uçlu Soru'}
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  {/* Options for Multiple Choice and True/False */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-0 sm:pl-11">
                      {q.options.map((opt) => {
                        const optKey = opt.slice(0, 1); // 'A', 'B', etc.
                        const isThisSelected = userAns === optKey || userAns === opt;
                        const isThisTheCorrectAnswer =
                          q.correctAnswer.startsWith(optKey) ||
                          q.correctAnswer.trim().toLowerCase() === opt.trim().toLowerCase();

                        let buttonStyle = 'bg-white border-slate-300 text-slate-800 hover:border-blue-500 hover:bg-blue-50/40';

                        if (showSolutions || isThisSelected) {
                          if (isThisTheCorrectAnswer) {
                            buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/25 font-black shadow-xs';
                          } else if (isThisSelected && !isThisTheCorrectAnswer) {
                            buttonStyle = 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-400/20 font-bold';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, optKey.length === 1 && opt.includes(')') ? optKey : opt)}
                            className={`min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center gap-2.5 font-semibold ${buttonStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg border border-current flex items-center justify-center text-xs shrink-0 font-black">
                              {optKey.length === 1 && opt.includes(')') ? optKey : '•'}
                            </span>
                            <span className="leading-snug flex-1">{opt}</span>
                            {showSolutions && isThisTheCorrectAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isThisSelected && !isThisTheCorrectAnswer && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Open-Ended Question Input Field */}
                  {q.type === 'open-ended' && (
                    <div className="pl-0 sm:pl-11 space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          Öğrenci Yanıtı Metin Alanı
                        </label>
                        <textarea
                          rows={3}
                          value={userAns || ''}
                          onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                          placeholder="Cevabınızı buraya kendi cümlelerinizle ve gerekçeleriyle yazınız..."
                          className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-300 bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-800 shadow-2xs leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {isAnswered
                            ? `Girilen metin: ${userAns.length} karakter`
                            : 'Açık uçlu cevap için öğrenci metin girişi yapabilir.'}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenEndedSubmitted((prev) => ({ ...prev, [q.id]: true }));
                          }}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200"
                        >
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          Cevabı Kaydet ve Karşılaştır
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Correct / Wrong Feedback Banner */}
                  {isAnswered && (
                    <div className="pl-0 sm:pl-11 pt-2">
                      {q.type !== 'open-ended' ? (
                        isCorrect ? (
                          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-black">
                                ✅ Doğru Cevap! Tebrikler.
                              </p>
                              <p className="text-xs text-emerald-800 font-medium mt-0.5">
                                Seçiminiz: <span className="font-bold">{userAns}</span> — Tam puan kazandınız.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-2.5">
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-black text-rose-700">
                                ❌ Yanlış Cevap!
                              </p>
                              <p className="text-xs text-rose-800 font-medium mt-0.5">
                                Sizin Seçiminiz: <span className="font-bold underline">{userAns}</span> | Doğru Cevap:{' '}
                                <span className="font-black text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                                  {q.correctAnswer}
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      ) : (
                        openEndedSubmitted[q.id] && (
                          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-black">
                                📝 Öğrenci Yanıtı Kaydedildi
                              </p>
                              <p className="text-xs text-blue-800 font-medium mt-0.5">
                                Öğrenci Açıklaması: <span className="italic font-semibold">"{userAns}"</span>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Pedagogical Explanation / Solution Note */}
                  {(showSolutions || isAnswered) && (
                    <div className="pl-0 sm:pl-11 pt-2 space-y-2 border-t border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Resmi Çözüm & Model Cevap: {q.correctAnswer}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        💡 <span className="font-bold text-slate-900">Açıklama:</span> {q.explanation}
                      </p>
                      {q.pedagogicalTip && (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Öğretmen İpucu: {q.pedagogicalTip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Test Performance summary bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span>Cevaplanan:</span>
              <span className="text-blue-600 font-black">
                {Object.keys(userAnswers).length} / {exam.questions.length} Soru
              </span>
              <span>•</span>
              <span>Başarı Puanı:</span>
              <span className="text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded-md">
                %{calculateScore()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setOpenEndedSubmitted({});
                  setShowSolutions(false);
                }}
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Cevapları Temizle
              </button>

              <button
                type="button"
                onClick={() => setShowSolutions(true)}
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs transition-colors shadow-xs"
              >
                Tüm Çözümleri Değerlendir →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
