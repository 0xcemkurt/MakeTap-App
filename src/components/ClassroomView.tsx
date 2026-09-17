import React, { useState } from 'react';
import { Classroom, Student, ClassFinanceItem, StemProduct } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Users,
  Trophy,
  Sparkles,
  Shuffle,
  Plus,
  UserPlus,
  Award,
  Calendar,
  Search,
  Wallet,
  Bot,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassroomViewProps {
  classroom: Classroom;
  onSelectStudent: (student: Student) => void;
  onAwardWholeClass: () => void;
  onOpenTools: () => void;
  onAddStudent: (newStudent: Omit<Student, 'id' | 'behaviorLogs'>) => void;
  onOpenFinance?: () => void;
  onOpenStemStore?: () => void;
  financeItems?: ClassFinanceItem[];
  stemProduct?: StemProduct;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({
  classroom,
  onSelectStudent,
  onAwardWholeClass,
  onOpenTools,
  onAddStudent,
  onOpenFinance,
  onOpenStemStore,
  financeItems = [],
  stemProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentSurname, setNewStudentSurname] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [bouncingStudentId, setBouncingStudentId] = useState<string | null>(null);

  const students = classroom.students;
  const totalPoints = students.reduce((sum, s) => sum + s.totalPoints, 0);

  // Financial calculations
  const grandTotalCollected = financeItems.reduce((sum, item) => {
    const itemPaid = students.filter((s) => item.payments?.[s.id]?.paid).length;
    return sum + itemPaid * item.amountPerStudent;
  }, 0);
  const grandTargetTotal = financeItems.reduce((sum, item) => sum + item.targetTotal, 0);
  const financePct = grandTargetTotal > 0 ? Math.round((grandTotalCollected / grandTargetTotal) * 100) : 0;

  // Attendance summary
  const presentCount = students.filter((s) => s.attendance === 'present').length;
  const attendancePct = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNumber.includes(searchQuery)
  );

  const handleStudentClick = (student: Student) => {
    setBouncingStudentId(student.id);
    setTimeout(() => setBouncingStudentId(null), 800);
    onSelectStudent(student);
  };

  const getArchetypeCardStyle = (student: Student) => {
    if (student.archetype === 'leader') {
      return {
        cardBorder: 'border-2 border-amber-400 bg-gradient-to-b from-amber-50/60 via-white to-white shadow-md shadow-amber-200/40 hover:border-amber-500 hover:shadow-xl ring-2 ring-amber-300/40',
        badgeBg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs',
        badgeIcon: <Trophy className="w-3 h-3 shrink-0 text-amber-100" />,
        defaultLabel: '🏆 Sınıf Lideri',
      };
    }
    if (student.archetype === 'energetic') {
      return {
        cardBorder: 'border-2 border-orange-400 bg-gradient-to-b from-orange-50/60 via-white to-white shadow-md shadow-orange-200/40 hover:border-orange-500 hover:shadow-xl ring-2 ring-orange-300/40',
        badgeBg: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs',
        badgeIcon: <Zap className="w-3 h-3 shrink-0 text-orange-100 fill-current" />,
        defaultLabel: '⚡ Yüksek Enerji',
      };
    }
    if (student.archetype === 'curious') {
      return {
        cardBorder: 'border-2 border-blue-400 bg-gradient-to-b from-blue-50/50 via-white to-white shadow-sm hover:border-blue-500 hover:shadow-xl ring-2 ring-blue-200/40',
        badgeBg: 'bg-blue-600 text-white shadow-xs',
        badgeIcon: <Sparkles className="w-3 h-3 shrink-0 text-blue-100" />,
        defaultLabel: '🔬 STEM Kaşifi',
      };
    }
    if (student.archetype === 'creative') {
      return {
        cardBorder: 'border-2 border-purple-400 bg-gradient-to-b from-purple-50/50 via-white to-white shadow-sm hover:border-purple-500 hover:shadow-xl ring-2 ring-purple-200/40',
        badgeBg: 'bg-purple-600 text-white shadow-xs',
        badgeIcon: <Sparkles className="w-3 h-3 shrink-0 text-purple-100" />,
        defaultLabel: '🎨 Yaratıcı Zihin',
      };
    }
    if (student.archetype === 'social') {
      return {
        cardBorder: 'border-2 border-emerald-400 bg-gradient-to-b from-emerald-50/50 via-white to-white shadow-sm hover:border-emerald-500 hover:shadow-xl ring-2 ring-emerald-200/40',
        badgeBg: 'bg-emerald-600 text-white shadow-xs',
        badgeIcon: <Award className="w-3 h-3 shrink-0 text-emerald-100" />,
        defaultLabel: '🤝 Nezaket Elçisi',
      };
    }
    return {
      cardBorder: 'border border-slate-200/90 bg-white hover:border-blue-400 hover:shadow-xl shadow-2xs',
      badgeBg: 'bg-slate-100 text-slate-700',
      badgeIcon: <Sparkles className="w-3 h-3 shrink-0 text-slate-500" />,
      defaultLabel: '🌱 Öğrenci',
    };
  };

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentSurname.trim()) return;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#6366f1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddStudent({
      name: newStudentName.trim(),
      surname: newStudentSurname.trim(),
      studentNumber: newStudentNumber.trim() || `${140 + students.length}`,
      avatarColor: randomColor,
      avatarShape: 'round',
      avatarMood: '🌟 Yeni Kaşif',
      totalPoints: 0,
      positivePoints: 0,
      needsWorkPoints: 0,
      attendance: 'present',
      parentName: newParentName.trim() || `${newStudentName}'in Velisi`,
      parentPhone: newParentPhone.trim() || '0555 000 0000',
      parentEmail: `${newStudentName.toLowerCase()}@maketab.com`,
      parentConnected: false,
      notes: 'Yeni kayıt olan öğrenci.',
    });

    setNewStudentName('');
    setNewStudentSurname('');
    setNewStudentNumber('');
    setNewParentName('');
    setNewParentPhone('');
    setShowAddModal(false);
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. EXECUTIVE CLASSROOM DASHBOARD SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Attendance & Class Size */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Sınıf & Devam
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {presentCount} / {students.length}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>%{attendancePct} Günlük Katılım</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            {classroom.name} • {classroom.schoolName}
          </div>
        </div>

        {/* Card 2: Erdem Puanları */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Toplam Erdem Puanı
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 tracking-tight">
              +{totalPoints} Puan
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mt-0.5">
              <span>Hedef: {classroom.pointsGoal}</span>
              <span className="text-emerald-600 font-extrabold">
                (%{Math.min(100, Math.round((totalPoints / (classroom.pointsGoal || 1)) * 100))})
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            20 Öğrenci Aktif Takip Ediliyor
          </div>
        </div>

        {/* Card 3: Sınıf Kasası & Aidat (Clickable) */}
        <div
          onClick={onOpenFinance}
          className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-700 transition-colors">
              Sınıf Kasası & Aidat
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5">
              <span>₺{grandTotalCollected.toLocaleString('tr-TR')}</span>
              <span className="text-xs font-bold text-slate-400">
                / ₺{grandTargetTotal.toLocaleString('tr-TR')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>%{financePct} Tahsil Edildi ({financeItems.length} Fon)</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-blue-600 font-black flex items-center justify-between">
            <span>Bütçe ve Makbuzları Yönet</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: STEM-X Robotik & Canlı Atölye (Clickable) */}
        <div
          onClick={onOpenStemStore}
          className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              STEM-X Kulübü
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>16 / {students.length} Sipariş</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded-md">
                ₺450
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-200 mt-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Cumartesi 10:00 Canlı Atölye</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-cyan-300 font-black flex items-center justify-between">
            <span>Atölye Takvimi & Kit Detayı</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 2. PROMOTIONAL STEM-X BANNER WITH WORKSHOP SCHEDULE */}
      {stemProduct && (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                <Zap className="w-3 h-3 fill-current" />
                ÖZEL ETKİNLİK • STEM-X ROBOTİK KİTİ
              </div>
              <h3 className="text-sm sm:text-base font-black tracking-tight">
                {stemProduct.name} & Canlı Kodlama Atölyesi
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                İlk Atölye: <span className="font-bold text-white">21 Mart Cumartesi 10:00</span> — Robot Kol Montajı & Algoritmalar. Sınıf indirimli fiyatı ₺450.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-stretch md:self-auto">
            <button
              type="button"
              onClick={onOpenStemStore}
              className="flex-1 md:flex-initial min-h-[42px] px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Bot className="w-4 h-4" />
              <span>STEM-X İncele & Sipariş Ver</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. SOLID QUICK ACTION BAR (UNIFIED BUTTON STRUCTURE) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {classroom.schoolName} • {classroom.name}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              Sınıf Yönetimi & Hızlı Eylemler
            </h2>
          </div>
          <div className="text-xs font-bold text-slate-500">
            Öğretmen: <span className="text-slate-800 font-black">{classroom.teacherName}</span>
          </div>
        </div>

        {/* Standardized, Tactile Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Award Whole Class */}
          <button
            type="button"
            onClick={onAwardWholeClass}
            className="min-h-[42px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Bütün Sınıfa Puan Ver</span>
          </button>

          {/* Sınıf Kasası & Aidat */}
          <button
            type="button"
            onClick={onOpenFinance}
            className="min-h-[42px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20 transition-all"
          >
            <Wallet className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>Sınıf Kasası & Aidat (₺)</span>
          </button>

          {/* STEM-X Store */}
          <button
            type="button"
            onClick={onOpenStemStore}
            className="min-h-[42px] px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-500/20 transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-200 shrink-0" />
            <span>STEM-X Robotik & Atölye</span>
          </button>

          {/* Sınıf Araçları */}
          <button
            type="button"
            onClick={onOpenTools}
            className="min-h-[42px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all shadow-2xs"
          >
            <Shuffle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Sınıf Araçları</span>
          </button>

          {/* + Öğrenci Ekle */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="min-h-[42px] px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all shadow-2xs ml-auto"
          >
            <UserPlus className="w-4 h-4 text-slate-600 shrink-0" />
            <span>+ Öğrenci Ekle</span>
          </button>
        </div>
      </div>

      {/* 4. SEARCH & ROSTER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs self-start">
          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Sınıf Mevcudu: {students.length} Öğrenci</span>
          <span className="text-emerald-400 font-normal">|</span>
          <span className="text-[11px] text-emerald-800">Tıklayarak öğrenciye erdem puanı verin</span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Öğrenci adı veya numarası ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-hidden focus:border-blue-500 font-medium shadow-2xs"
          />
        </div>
      </div>

      {/* 5. STUDENT MONSTERS GRID (CLASSROOM ROSTER) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredStudents.map((student) => {
          const style = getArchetypeCardStyle(student);
          return (
            <div
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className={`group cursor-pointer rounded-3xl p-4 sm:p-4.5 transition-all duration-200 flex flex-col items-center text-center relative select-none hover:-translate-y-1 active:translate-y-0 justify-between min-h-[220px] ${style.cardBorder}`}
            >
              {/* Card Header: Archetype badge & Points / Attendance */}
              <div className="w-full flex items-center justify-between gap-1.5 mb-2">
                {/* Archetype Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight ${style.badgeBg}`}
                >
                  {style.badgeIcon}
                  <span>{student.archetypeLabel || style.defaultLabel}</span>
                </span>

                {/* Points & Attendance */}
                <div className="flex items-center gap-1 shrink-0">
                  {student.attendance !== 'present' && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                        student.attendance === 'late'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {student.attendance === 'late' ? 'Geç' : 'Yok'}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black">
                    +{student.totalPoints}
                  </span>
                </div>
              </div>

              {/* Monster Avatar */}
              <div className="my-1.5">
                <StudentAvatar
                  name={student.name}
                  color={student.avatarColor}
                  shape={student.avatarShape}
                  points={student.totalPoints}
                  size="md"
                  isBouncing={bouncingStudentId === student.id}
                />
              </div>

              {/* Student Name */}
              <div className="text-center w-full">
                <h4 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                  {student.name} {student.surname}
                </h4>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold mt-0.5">
                  <span>#{student.studentNumber}</span>
                  <span>•</span>
                  <span
                    className={
                      student.parentConnected ? 'text-emerald-600 font-bold' : 'text-slate-400 font-medium'
                    }
                  >
                    {student.parentConnected ? 'Veli Bağlı' : 'Veli Bekliyor'}
                  </span>
                </div>
              </div>

              {/* Motivational Badge Pill */}
              {student.motivationalBadge && (
                <div className="mt-2 px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200/70 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 text-center w-full">
                  <span>{student.motivationalBadge}</span>
                </div>
              )}

              {/* Pedagogical Metrics: Best Friend & Efficiency Rate */}
              <div className="mt-2.5 grid grid-cols-2 gap-2 w-full bg-slate-50/90 rounded-2xl p-2.5 border border-slate-200/70 text-left">
                {/* En Yakın Arkadaş */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                    En Yakın Arkadaş
                  </span>
                  <span className="text-[11px] font-bold text-slate-800 truncate mt-0.5">
                    👥 {student.bestFriendName || 'Sınıf Grubu'}
                  </span>
                </div>

                {/* Verim & Odak Oranı */}
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                    Akademik Verim
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[11px] font-black ${
                        (student.efficiencyRate || 90) >= 90 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      %{student.efficiencyRate || 90}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (student.efficiencyRate || 90) >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${student.efficiencyRate || 90}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attention Topic Notice (İlgilenilmesi Gereken Konu) */}
              {student.attentionTopic && (
                <div className="mt-2.5 w-full bg-amber-50/90 border border-amber-300/80 rounded-xl p-2 text-left flex items-start gap-1.5 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-snug text-amber-950 font-medium">
                    <span className="font-extrabold text-amber-800 mr-1">Dikkat:</span>
                    {student.attentionTopic}
                  </div>
                </div>
              )}

              {/* Card Footer: + Puan Ver Action */}
              <div className="mt-3 pt-2 border-t border-slate-100/90 w-full flex items-center justify-center text-[11px] font-black text-blue-600 group-hover:text-blue-700 transition-colors">
                <span>+ Erdem Puanı Ver</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                4-A Sınıfına Yeni Öğrenci Ekle
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Öğrenci Adı
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Kerem"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Soyadı
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Aksoy"
                    value={newStudentSurname}
                    onChange={(e) => setNewStudentSurname(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Okul No
                </label>
                <input
                  type="text"
                  placeholder="Örn: 156"
                  value={newStudentNumber}
                  onChange={(e) => setNewStudentNumber(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Veli Adı Soyadı
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Leyla Aksoy"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Veli Telefon No
                  </label>
                  <input
                    type="tel"
                    placeholder="0532 000 0000"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs"
                >
                  Öğrenciyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
