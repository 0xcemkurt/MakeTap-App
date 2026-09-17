import React, { useState } from 'react';
import {
  SchoolClassSummary,
  TeacherEvaluation,
  StaffMember,
  VisitorLog,
  PrincipalCalendarEvent,
  SchoolFinanceSummary,
  PrincipalAiInsight,
  AuthUser,
} from '../types';
import {
  Building2,
  Users,
  GraduationCap,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Calendar,
  UserCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Send,
  RefreshCw,
  FileText,
  Star,
  MessageSquare,
  Phone,
  Flame,
  ChevronRight,
  Eye,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrincipalDashboardProps {
  authUser: AuthUser;
  classesSummary: SchoolClassSummary[];
  teacherEvaluations: TeacherEvaluation[];
  staffMembers: StaffMember[];
  visitorLogs: VisitorLog[];
  calendarEvents: PrincipalCalendarEvent[];
  financialData: SchoolFinanceSummary;
  aiInsights: PrincipalAiInsight[];
  onUpdateTeacherNote: (teacherId: string, note: string) => void;
  onAddVisitor: (newVisitor: Omit<VisitorLog, 'id'>) => void;
  onCheckOutVisitor: (visitorId: string) => void;
  onAddCalendarEvent: (newEvent: Omit<PrincipalCalendarEvent, 'id'>) => void;
  onSwitchToTeacherMode?: () => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  authUser,
  classesSummary,
  teacherEvaluations,
  staffMembers,
  visitorLogs,
  calendarEvents,
  financialData,
  aiInsights,
  onUpdateTeacherNote,
  onAddVisitor,
  onCheckOutVisitor,
  onAddCalendarEvent,
  onSwitchToTeacherMode,
}) => {
  // Navigation tabs for Principal dashboard
  type PrincipalTab =
    | 'classes'
    | 'teachers'
    | 'ai-insights'
    | 'finance'
    | 'staff'
    | 'visitors'
    | 'calendar';

  const [activeTab, setActiveTab] = useState<PrincipalTab>('classes');

  // Interactive state for Teacher Note modal
  const [selectedTeacherForNote, setSelectedTeacherForNote] = useState<TeacherEvaluation | null>(null);
  const [teacherNoteInput, setTeacherNoteInput] = useState('');

  // Interactive state for New Visitor modal
  const [showAddVisitorModal, setShowAddVisitorModal] = useState(false);
  const [newVisitorName, setNewVisitorName] = useState('');
  const [newVisitorTc, setNewVisitorTc] = useState('');
  const [newVisitorPurpose, setNewVisitorPurpose] = useState('');
  const [newVisitorWhom, setNewVisitorWhom] = useState('Hakan KAVUZKOZ (4-A Sınıf Öğretmeni)');
  const [newVisitorBadge, setNewVisitorBadge] = useState('ZİYARETÇİ-21');

  // Interactive state for New Calendar Event modal
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('Müdürlük Makamı');
  const [newEventType, setNewEventType] = useState<'mem' | 'meeting' | 'inspection' | 'drill' | 'parent'>('meeting');

  // Search & Filter state for classes and teachers
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');

  // AI refresh simulation state
  const [isRefreshingAi, setIsRefreshingAi] = useState(false);
  const [aiReportGeneratedDate, setAiReportGeneratedDate] = useState('Bugün, 09:15');

  // Calculate executive summary statistics
  const totalStudents = classesSummary.reduce((acc, c) => acc + c.studentCount, 0);
  const averageAttendance = (
    classesSummary.reduce((acc, c) => acc + c.attendanceRate, 0) / classesSummary.length
  ).toFixed(1);
  const totalPointsAwarded = classesSummary.reduce((acc, c) => acc + c.totalPoints, 0);
  const averageTeacherRating = (
    teacherEvaluations.reduce((acc, t) => acc + t.overallRating, 0) / teacherEvaluations.length
  ).toFixed(2);
  const insideVisitorsCount = visitorLogs.filter((v) => v.status === 'inside').length;
  const onDutyStaffCount = staffMembers.filter((s) => s.status === 'on_duty').length;

  // Filtered classes
  const filteredClasses = classesSummary.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || c.grade.toString() === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  // Filtered teachers
  const filteredTeachers = teacherEvaluations.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle saving principal note for a teacher
  const handleSaveTeacherNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForNote) return;
    onUpdateTeacherNote(selectedTeacherForNote.id, teacherNoteInput);
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.7 },
    });
    setSelectedTeacherForNote(null);
    setTeacherNoteInput('');
  };

  // Handle adding new visitor
  const handleCreateVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitorName.trim() || !newVisitorPurpose.trim()) return;

    const currentTime = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    onAddVisitor({
      visitorName: newVisitorName.trim(),
      tcMasked: newVisitorTc.trim() || 'TR-GÜVENLİK',
      purpose: newVisitorPurpose.trim(),
      visitingWhom: newVisitorWhom,
      entryTime: currentTime,
      badgeNo: newVisitorBadge || `Z-${Math.floor(Math.random() * 80 + 10)}`,
      status: 'inside',
      securityOfficer: 'Hasan ÇELİK (Nöbetçi Şef)',
    });

    setNewVisitorName('');
    setNewVisitorTc('');
    setNewVisitorPurpose('');
    setShowAddVisitorModal(false);
  };

  // Handle adding calendar event
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    onAddCalendarEvent({
      title: newEventTitle.trim(),
      date: newEventDate.trim() || 'Bu Hafta',
      time: newEventTime.trim() || '14:00',
      location: newEventLocation.trim() || 'Okul Müdürlüğü',
      type: newEventType,
      status: 'upcoming',
      urgency: 'normal',
    });

    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setShowAddEventModal(false);
  };

  // Handle AI insights re-analysis simulation
  const handleReanalyzeAi = () => {
    setIsRefreshingAi(true);
    setTimeout(() => {
      setIsRefreshingAi(false);
      setAiReportGeneratedDate('Az önce güncellendi');
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.4 },
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. EXECUTIVE PRESTIGE HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-amber-500/30 relative overflow-hidden">
        {/* Subtle gold shine & emblem effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Left Title & Crest */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Building2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  T.C. Millî Eğitim Bakanlığı
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  MEB Kurum Kodu: 712048
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Atatürk İlkokulu • Okul Müdürü Yönetim Masası
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 flex items-center gap-2">
                <span>{authUser.name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-bold">{authUser.title}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-semibold">2026-2027 Güz Dönemi</span>
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            <button
              onClick={handleReanalyzeAi}
              disabled={isRefreshingAi}
              className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAi ? 'animate-spin' : ''}`} />
              <span>{isRefreshingAi ? 'AI Analiz Ediyor...' : 'AI Okul Raporu (Canlı)'}</span>
            </button>

            <button
              onClick={() => setShowAddVisitorModal(true)}
              className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>+ Kapı Ziyaretçisi</span>
            </button>

            {onSwitchToTeacherMode && (
              <button
                onClick={onSwitchToTeacherMode}
                className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                title="4-A Sınıfını İncele"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Öğretmen Masasına Bak</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE BENTO KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Toplam Öğrenci */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Öğrenci Mevcudu</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{totalStudents}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>8 Aktif Şube (1-4)</span>
          </div>
        </div>

        {/* Metric 2: Okul Devam Oranı */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Günlük Devam</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">%{averageAttendance}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">İlçe Ort. +%3.2</div>
        </div>

        {/* Metric 3: Veli Memnuniyeti */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Veli Endeksi</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{averageTeacherRating} <span className="text-xs text-slate-400 font-medium">/ 5.0</span></div>
          <div className="text-[11px] text-amber-600 font-bold mt-1">174 Değerlendirme</div>
        </div>

        {/* Metric 4: Okul Kasası & Bütçe */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>OAB Net Bakiye</span>
            <DollarSign className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">₺{financialData.netReserve.toLocaleString('tr-TR')}</div>
          <div className="text-[11px] text-indigo-600 font-bold mt-1">Pozitif Kasa Sağlığı</div>
        </div>

        {/* Metric 5: Görevli Personel */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Personel & Nöbet</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{onDutyStaffCount} <span className="text-xs text-slate-400 font-medium">/ {staffMembers.length}</span></div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Hademe & Güvenlik Tam</div>
        </div>

        {/* Metric 6: Binadaki Ziyaretçi */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Kapı Ziyaretçisi</span>
            <UserCheck className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{insideVisitorsCount} <span className="text-xs text-slate-400 font-medium">Kişi</span></div>
          <div className="text-[11px] text-rose-600 font-bold mt-1">Turnikede Kayıtlı</div>
        </div>
      </div>

      {/* 3. EXECUTIVE TABS NAVIGATION */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Sınıflar & Okul Ortalamaları ({classesSummary.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'teachers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span>Öğretmenler & Veli Notları ({teacherEvaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-insights')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'ai-insights'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>MakeTab AI Yönetici Raporu ({aiInsights.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Bütçe & Okul Aile Birliği</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Personel (Hademeler & Güvenlik)</span>
        </button>

        <button
          onClick={() => setActiveTab('visitors')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'visitors'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-rose-400" />
          <span>Ziyaretçi Defteri ({insideVisitorsCount} İçeride)</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>Müdürlük Ajandası ({calendarEvents.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENT: CLASSES SUMMARY & COMPARISONS */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Sınıf veya öğretmen ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/20"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 mr-1">Kademeler:</span>
              {(['all', '1', '2', '3', '4'] as const).map((grade) => (
                <button
                  key={grade}
                  onClick={() => setGradeFilter(grade)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    gradeFilter === grade
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {grade === 'all' ? 'Tümü' : `${grade}. Sınıflar`}
                </button>
              ))}
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-slate-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-black border border-slate-200">
                      {cls.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        cls.status === 'excellent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cls.status === 'normal'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {cls.status === 'excellent'
                        ? 'Örnek Sınıf'
                        : cls.status === 'normal'
                        ? 'Dengeli'
                        : 'Rehberlik Gerekli'}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900">{cls.teacherName}</h3>
                  <p className="text-[11px] font-bold text-blue-600 mt-0.5">{cls.academicBadge}</p>

                  {/* Class Metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Mevcut</span>
                      <strong className="text-slate-800 text-sm font-black">
                        {cls.presentCount} / {cls.studentCount}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Devam %</span>
                      <strong
                        className={`text-sm font-black ${
                          cls.attendanceRate >= 95 ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        %{cls.attendanceRate}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Akademik Verim</span>
                      <strong className="text-slate-800 text-sm font-black">%{cls.averageEfficiency}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Veli Portalı</span>
                      <strong className="text-indigo-600 text-sm font-black">%{cls.parentAppAdoptionRate}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Toplam Erdem:</span>
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +{cls.totalPoints.toLocaleString()} Puan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: TEACHER EVALUATIONS & PARENT RATINGS (360 DEĞERLENDİRME) */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>360° Öğretmen Değerlendirmeleri & Veli Anket Notları</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  MEB Teftiş Standartları
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Öğretmenlerin veliler ve öğrenciler nezdindeki performans endeksi, pedagojik yaklaşımı, sınıf içi etkinliği ve iletişim kalitesi. Okul Müdürü olarak her öğretmenin sicil dosyasına tebrik veya rehberlik notu bırakabilirsiniz.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 border border-white/20 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Genel Öğretmen Puanı</span>
              <span className="text-2xl font-black text-white">{averageTeacherRating} / 5.0</span>
            </div>
          </div>

          {/* Teacher Cards */}
          <div className="space-y-5">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Teacher Name, Badges, and Overall Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-md">
                      {teacher.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900">{teacher.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                          {teacher.className}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          ({teacher.experienceYears} Yıl Kıdem)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{teacher.branch}</p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Star className="w-5 h-5 fill-amber-400" />
                        <span className="text-xl font-black text-slate-900">{teacher.overallRating.toFixed(2)}</span>
                        <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        {teacher.totalParentReviews} Veli Değerlendirmesi
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTeacherForNote(teacher);
                        setTeacherNoteInput(teacher.principalNote || '');
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{teacher.principalNote ? 'Müdür Notunu Düzenle' : 'Müdür Notu Bırak'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-ratings: Pedagogy, Communication, Activity */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pedagojik Yaklaşım</span>
                    <strong className="text-sm font-black text-slate-800">{teacher.pedagogyRating} / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Veli İletişimi</span>
                    <strong className="text-sm font-black text-slate-800">{teacher.communicationRating} / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sınıf İçi STEM & Etkinlik</span>
                    <strong className="text-sm font-black text-slate-800">{teacher.activityRating} / 5.0</strong>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {teacher.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-[11px] font-bold"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Official Principal Note if exists */}
                {teacher.principalNote && (
                  <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5 shadow-2xs">
                    <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between font-black text-amber-900 mb-0.5">
                        <span>Okul Müdürü Resmi Sicil & Tebrik Notu</span>
                        <span className="text-[10px] text-amber-700 font-semibold">{teacher.principalNoteDate}</span>
                      </div>
                      <p className="font-medium leading-relaxed">{teacher.principalNote}</p>
                    </div>
                  </div>
                )}

                {/* Parent Comments & Reviews Section */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-black text-slate-700 block">Velilerin Bıraktığı Geribildirim Notları:</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {teacher.parentComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/70 text-xs text-slate-700 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-1">
                            <span>{comment.parentName}</span>
                            <div className="flex items-center gap-0.5 text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{comment.rating}</span>
                            </div>
                          </div>
                          <p className="italic text-slate-600 leading-relaxed text-[11px]">
                            "{comment.comment}"
                          </p>
                        </div>
                        <div className="mt-2 pt-1 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                            #{comment.tag}
                          </span>
                          <span>{comment.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: MAKETAB AI EXECUTIVE INSIGHTS */}
      {activeTab === 'ai-insights' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 sm:p-6 text-slate-950 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-amber-300 text-[10px] font-black uppercase">
                  Yapay Zeka Destekli
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Rapor Durumu: {aiReportGeneratedDate}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1 text-slate-950">
                MEB Uyumlu MakeTab AI Okul Yönetim & Risk Raporu
              </h2>
              <p className="text-xs text-slate-900 font-semibold mt-0.5 max-w-2xl leading-relaxed">
                Tüm okul verilerini (öğrenci devamları, öğretmen veli memnuniyetleri, bütçe ve güvenlik) analiz ederek okul müdürüne anlık stratejik kararlar ve MEB müfettişliği teftiş önerileri sunar.
              </p>
            </div>

            <button
              onClick={handleReanalyzeAi}
              disabled={isRefreshingAi}
              className="py-3 px-5 rounded-2xl bg-slate-950 hover:bg-slate-900 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-2 shadow-xl shrink-0 cursor-pointer disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isRefreshingAi ? 'animate-spin' : ''}`} />
              <span>{isRefreshingAi ? 'Veriler Taranıyor...' : 'Yeni AI Raporu Üret'}</span>
            </button>
          </div>

          {/* AI Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className={`bg-white rounded-3xl p-5 border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                  insight.status === 'urgent'
                    ? 'border-rose-300 ring-2 ring-rose-200/50'
                    : insight.status === 'positive'
                    ? 'border-emerald-300'
                    : 'border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        insight.status === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : insight.status === 'positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {insight.status === 'urgent'
                        ? '⚠️ Acil Eylem Uyarısı'
                        : insight.status === 'positive'
                        ? '🌟 Güçlü Performans'
                        : '💡 Stratejik Fırsat'}
                    </span>

                    {insight.metric && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-black">
                        {insight.metric}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 mb-1.5">{insight.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {insight.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-3xl">
                  <div className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-900 mr-1">Müdüre Tavsiye:</span>
                      <span className="text-slate-700 font-semibold">{insight.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT: SCHOOL FINANCES & OKUL AİLE BİRLİĞİ */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Finance Overview Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase">Yıllık Bütçe Hedefi</span>
              <div className="text-2xl font-black text-slate-900 mt-1">₺{financialData.totalBudget.toLocaleString()}</div>
              <span className="text-[11px] text-slate-500 font-semibold">MEB + OAB Tahmini</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-2xs bg-emerald-50/30">
              <span className="text-xs font-bold text-emerald-700 uppercase">Gerçekleşen Gelir</span>
              <div className="text-2xl font-black text-emerald-800 mt-1">₺{financialData.totalIncome.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-bold">Kasa Tahsilatları</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-2xs bg-rose-50/30">
              <span className="text-xs font-bold text-rose-700 uppercase">Yapılan Harcamalar</span>
              <div className="text-2xl font-black text-rose-800 mt-1">₺{financialData.totalExpense.toLocaleString()}</div>
              <span className="text-[11px] text-rose-600 font-bold">Isınma, Güvenlik, Temizlik</span>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-5 text-white shadow-md">
              <span className="text-xs font-bold text-indigo-300 uppercase">Kasa Net Rezervi</span>
              <div className="text-2xl font-black text-white mt-1">₺{financialData.netReserve.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400 font-bold">Pozitif Likidite</span>
            </div>
          </div>

          {/* Income & Expense Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Gelir Kalemleri */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
                <span>Okul Gelir Kaynakları</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  ₺{financialData.totalIncome.toLocaleString()}
                </span>
              </h3>
              <div className="space-y-2.5">
                {financialData.incomeBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{item.title}</span>
                      <span className="font-black text-emerald-700">₺{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Kaynak: {item.source}</span>
                      <span className="font-bold">%{item.percentage}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gider Kalemleri */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
                <span>Operasyonel Gider Dağılımı</span>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  ₺{financialData.totalExpense.toLocaleString()}
                </span>
              </h3>
              <div className="space-y-2.5">
                {financialData.expenseBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{item.title}</span>
                      <span className="font-black text-rose-700">₺{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Kategori: {item.category}</span>
                      <span className="font-bold">%{item.percentage}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Financial Transactions */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-slate-900">Son Kasa & Banka Hareketleri</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold">
                    <th className="pb-2">İşlem / Açıklama</th>
                    <th className="pb-2">Kategori</th>
                    <th className="pb-2">Tarih</th>
                    <th className="pb-2 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {financialData.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-bold text-slate-800">{tx.title}</td>
                      <td className="py-2.5 text-slate-500">{tx.category}</td>
                      <td className="py-2.5 text-slate-400">{tx.date}</td>
                      <td className={`py-2.5 text-right font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}₺{tx.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB CONTENT: OPERATIONAL STAFF (HADEMELER, GÜVENLİK, TEKNİK) */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 rounded-3xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                <span>Okul Destek Personeli (Hademelerden Güvenliğe)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-400 text-slate-950">
                  {staffMembers.length} Personel
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Öğrenci güvenliği, hijyen standartları, beyaz bayrak denetimleri, kalorifer tesisatı ve idari yazı işleri personelinin nöbet ve çalışma tablosu.
              </p>
            </div>
          </div>

          {/* Staff Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-black uppercase">
                      {staff.role === 'security'
                        ? '🛡️ Güvenlik'
                        : staff.role === 'janitor'
                        ? '🧹 Temizlik / Hademe'
                        : staff.role === 'technician'
                        ? '🔧 Teknik Bakım'
                        : '📄 İdari Memur'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      Nöbette / Görevde
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900">{staff.name}</h3>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{staff.roleLabel}</p>

                  <div className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Görev Alanı:</span>
                      <strong className="text-slate-900 truncate max-w-[170px]">{staff.dutyArea}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Mesai:</span>
                      <span className="font-bold">{staff.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">İletişim:</span>
                      <span className="font-mono font-bold text-blue-600">{staff.phone}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/70">
                      <span className="text-slate-500 font-bold">Denetim Skoru:</span>
                      <span className="font-black text-emerald-600">%{staff.hygieneOrSecurityScore} Başarı</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 text-[11px] text-slate-500 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                  <span className="font-bold text-amber-900 not-italic block mb-0.5">Son Denetim Notu:</span>
                  "{staff.lastInspectionNote}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. TAB CONTENT: VISITOR MANAGEMENT (ZİYARETÇİ DEFTERİ) */}
      {activeTab === 'visitors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>Ana Giriş Turnike & Güvenlik Ziyaretçi Defteri</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
                  {insideVisitorsCount} Kişi Şu An Binada
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Okul binasına giren veli, müfettiş ve servis yetkililerinin T.C. kimlik kaydı ve yaka kartı takibi.
              </p>
            </div>

            <button
              onClick={() => setShowAddVisitorModal(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Yeni Ziyaretçi Kaydet</span>
            </button>
          </div>

          {/* Visitor Table */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="pb-3">Ziyaretçi Adı / T.C.</th>
                  <th className="pb-3">Ziyaret Edilen Kişi / Makam</th>
                  <th className="pb-3">Ziyaret Sebebi</th>
                  <th className="pb-3">Giriş Saati</th>
                  <th className="pb-3">Yaka Kartı</th>
                  <th className="pb-3">Durum</th>
                  <th className="pb-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visitorLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-black text-slate-900">
                      <div>{log.visitorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">T.C: {log.tcMasked}</div>
                    </td>
                    <td className="py-3 font-semibold text-slate-800">{log.visitingWhom}</td>
                    <td className="py-3 text-slate-600 max-w-xs">{log.purpose}</td>
                    <td className="py-3 font-mono font-bold text-slate-700">{log.entryTime}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-[10px] border border-slate-200">
                        {log.badgeNo}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          log.status === 'inside'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {log.status === 'inside' ? 'Binada' : `Ayrıldı (${log.exitTime})`}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {log.status === 'inside' ? (
                        <button
                          onClick={() => onCheckOutVisitor(log.id)}
                          className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Çıkış Yap
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold">Kayıt Kapalı</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. TAB CONTENT: CALENDAR & APPOINTMENTS (MÜDÜRLÜK TAKVİMİ) */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Müdürlük Resmi Ajandası & Randevuları</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                İlçe Millî Eğitim Müdürlüğü toplantıları, kurul toplantıları, yangın tatbikatları ve randevu planı.
              </p>
            </div>

            <button
              onClick={() => setShowAddEventModal(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Yeni Ajanda Notu Ekle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        evt.type === 'mem'
                          ? 'bg-rose-100 text-rose-800'
                          : evt.type === 'drill'
                          ? 'bg-amber-100 text-amber-800'
                          : evt.type === 'inspection'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {evt.type === 'mem'
                        ? 'İlçe MEM'
                        : evt.type === 'drill'
                        ? 'Tatbikat'
                        : evt.type === 'inspection'
                        ? 'Denetim'
                        : 'Kurul / Toplantı'}
                    </span>
                    {evt.urgency === 'high' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                        Yüksek Öncelik
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900">{evt.title}</h3>

                  <div className="text-xs text-slate-500 font-semibold space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Calendar className="w-5 h-5 text-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. MODAL: TEACHER PRINCIPAL NOTE */}
      {selectedTeacherForNote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">
                  Öğretmen Sicil & Teşekkür Notu
                </h3>
              </div>
              <button
                onClick={() => setSelectedTeacherForNote(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-800">{selectedTeacherForNote.name}</span>
              <span className="text-slate-500"> ({selectedTeacherForNote.className} - {selectedTeacherForNote.branch})</span>
            </div>

            <form onSubmit={handleSaveTeacherNote} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Okul Müdürü Resmi Değerlendirme & Teşekkür Notu
                </label>
                <textarea
                  rows={4}
                  required
                  value={teacherNoteInput}
                  onChange={(e) => setTeacherNoteInput(e.target.value)}
                  placeholder="Öğretmenin sınıf başarısı, projeleri veya veli iletişimine dair takdir/rehberlik notunuzu buraya yazınız..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeacherForNote(null)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-slate-900/20"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Notu Kaydet & Sicil Dosyasına Ekle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. MODAL: ADD VISITOR */}
      {showAddVisitorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Yeni Ziyaretçi Girişi</h3>
              </div>
              <button
                onClick={() => setShowAddVisitorModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisitorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ziyaretçi Adı Soyadı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ayşe Yılmaz"
                  value={newVisitorName}
                  onChange={(e) => setNewVisitorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">T.C. Kimlik No</label>
                <input
                  type="text"
                  placeholder="11 haneli T.C. kimlik numarası"
                  value={newVisitorTc}
                  onChange={(e) => setNewVisitorTc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kimi Ziyaret Ediyor?</label>
                <select
                  value={newVisitorWhom}
                  onChange={(e) => setNewVisitorWhom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                >
                  <option value="Hakan KAVUZKOZ (4-A Sınıf Öğretmeni)">Hakan KAVUZKOZ (4-A Sınıf Öğretmeni)</option>
                  <option value="Zeynep KAYA (4-B Sınıf Öğretmeni)">Zeynep KAYA (4-B Sınıf Öğretmeni)</option>
                  <option value="Dr. Mehmet YILMAZ (Okul Müdürü)">Dr. Mehmet YILMAZ (Okul Müdürü)</option>
                  <option value="Sevgi DEMİRTAŞ (İdari Memur)">Sevgi DEMİRTAŞ (İdari Memur)</option>
                  <option value="Rehberlik & Psikolojik Danışmanlık">Rehberlik & Psikolojik Danışmanlık</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ziyaret Sebebi</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Öğrenci gelişim görüşmesi, evrak teslimi vb."
                  value={newVisitorPurpose}
                  onChange={(e) => setNewVisitorPurpose(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verilen Yaka Kartı No</label>
                <input
                  type="text"
                  value={newVisitorBadge}
                  onChange={(e) => setNewVisitorBadge(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVisitorModal(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black"
                >
                  Turnike Girişini Onayla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 13. MODAL: ADD CALENDAR EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Yeni Ajanda Notu Ekle</h3>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Toplantı / Etkinlik Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 4. Sınıflar Zümre Değerlendirmesi"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tarih</label>
                  <input
                    type="text"
                    placeholder="Örn: 22 Eylül Salı"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Saat</label>
                  <input
                    type="text"
                    placeholder="Örn: 15:30"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konum</label>
                <input
                  type="text"
                  placeholder="Örn: Müdürlük Makamı veya Konferans Salonu"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tür</label>
                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:bg-white"
                >
                  <option value="meeting">Kurul / Toplantı</option>
                  <option value="mem">İlçe MEM</option>
                  <option value="inspection">Denetim</option>
                  <option value="drill">Tatbikat</option>
                  <option value="parent">Veli Randevusu</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black"
                >
                  Ajandaya Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
