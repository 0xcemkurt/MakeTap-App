import React, { useState } from 'react';
import { Classroom, Student, BehaviorLog } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  Search,
  Filter,
} from 'lucide-react';
import { Button } from './ui/Button';
import { TextInput } from './ui/TextInput';

interface AnalyticsReportsProps {
  classroom: Classroom;
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({ classroom }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'term'>('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  const students = classroom.students;

  // Aggregate metrics
  const totalClassPoints = students.reduce((sum, s) => sum + s.totalPoints, 0);
  const totalPositive = students.reduce((sum, s) => sum + s.positivePoints, 0);
  const totalNeedsWork = students.reduce((sum, s) => sum + s.needsWorkPoints, 0);
  const positiveRatio =
    totalPositive + totalNeedsWork > 0
      ? Math.round((totalPositive / (totalPositive + totalNeedsWork)) * 100)
      : 100;

  const attendancePresent = students.filter((s) => s.attendance === 'present').length;
  const attendanceLate = students.filter((s) => s.attendance === 'late').length;
  const attendanceAbsent = students.filter((s) => s.attendance === 'absent').length;

  // Top behaviors
  const skillCountMap: Record<string, { count: number; type: string; title: string }> = {};
  students.forEach((s) => {
    s.behaviorLogs.forEach((log) => {
      if (!skillCountMap[log.skillTitle]) {
        skillCountMap[log.skillTitle] = { count: 0, type: log.type, title: log.skillTitle };
      }
      skillCountMap[log.skillTitle].count += 1;
    });
  });

  const sortedSkills = Object.values(skillCountMap).sort((a, b) => b.count - a.count);

  // Filtered student list
  const filteredStudents = students
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentNumber.includes(searchQuery)
    )
    .sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            Öğrenci & Sınıf Gelişim Raporlama Paneli
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {classroom.name} İlerleme Karnesi
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {classroom.academicYear} • Toplam {students.length} Öğrenci Takibi
          </p>
        </div>

        {/* Time filters & Print */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setTimeRange('week')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl transition-all ${
                timeRange === 'week' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bu Hafta
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl transition-all ${
                timeRange === 'month' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bu Ay
            </button>
            <button
              onClick={() => setTimeRange('term')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl transition-all ${
                timeRange === 'term' ? 'bg-white text-brand-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Dönemlik
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            title="Raporu Yazdır"
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Toplam Puan */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sınıf Puanı</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            +{totalClassPoints}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Hedef: {classroom.pointsGoal} Puan (%{Math.min(100, Math.round((totalClassPoints / classroom.pointsGoal) * 100))})
          </div>
        </div>

        {/* Card 2: Pozitif Oran */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Olumlu Tutum</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            %{positiveRatio}
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            🟢 +{totalPositive} / 🟠 -{totalNeedsWork}
          </div>
        </div>

        {/* Card 3: Günlük Devamlılık */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Yoklama Durumu</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {attendancePresent} <span className="text-sm font-semibold text-slate-400">/ {students.length}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {attendanceLate > 0 && <span className="text-amber-600 font-bold mr-2">⏰ {attendanceLate} Geç</span>}
            {attendanceAbsent > 0 && <span className="text-rose-600 font-bold">❌ {attendanceAbsent} Yok</span>}
            {attendanceLate === 0 && attendanceAbsent === 0 && <span className="text-emerald-600 font-bold">Tam Katılım</span>}
          </div>
        </div>

        {/* Card 4: Öğrenci Ortalaması */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Öğrenci Başı</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {(totalClassPoints / (students.length || 1)).toFixed(1)}
          </div>
          <div className="text-[11px] text-purple-600 font-bold">
            Haftalık Ortalama Puan
          </div>
        </div>
      </div>

      {/* 2 Sütun: Davranış Dağılımı ve Sınıf Hedef Çubuğu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Davranış Dağılım Kartı */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            En Çok Kazanılan Beceriler ve Erdemler
          </h3>

          <div className="space-y-2.5">
            {sortedSkills.length > 0 ? (
              sortedSkills.map((sk, i) => {
                const isPos = sk.type === 'positive';
                const maxCount = sortedSkills[0].count || 1;
                const percentage = Math.round((sk.count / maxCount) * 100);

                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isPos ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {sk.title}
                      </span>
                      <span className={isPos ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                        {sk.count} Kez Verildi
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPos ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Henüz kayıtlı davranış yok.</p>
            )}
          </div>
        </div>

        {/* Sınıf Hedefi ve Veli İletişim İstatistiği */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              Dönemlik Sınıf Ödülü Hedefi: {classroom.pointsGoal} Puan
            </h3>

            <p className="text-xs text-slate-600 mb-3">
              Sınıfınız 200 puana ulaştığında hep birlikte "Bilim ve Eğlence Günü" kutlaması yapılacak!
            </p>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-brand-600">İlerleme: {totalClassPoints} / {classroom.pointsGoal}</span>
                <span className="text-slate-400">%{Math.round((totalClassPoints / classroom.pointsGoal) * 100)}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((totalClassPoints / classroom.pointsGoal) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 space-y-2">
            <div className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              Veli Bağlantı Oranı: %{Math.round((students.filter((s) => s.parentConnected).length / students.length) * 100)}
            </div>
            <p className="text-[11px] text-brand-700 leading-snug">
              {students.filter((s) => s.parentConnected).length} / {students.length} veli MakeTab mobil platformuna bağlı ve gelişim bildirimlerini anlık alıyor.
            </p>
          </div>
        </div>
      </div>

      {/* Öğrenci Gelişim Tablosu & Karneleri */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Bireysel Öğrenci Gelişim Karneleri
            </h3>
            <p className="text-xs text-slate-500">
              Öğrencilerin puan sıralaması, olumlu tutum oranları ve detaylı karneleri
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-64">
            <TextInput
              type="text"
              radius="xl"
              placeholder="Öğrenci ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search />}
            />
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Sıra</th>
                <th className="py-3 px-4">Öğrenci</th>
                <th className="py-3 px-4">Toplam Puan</th>
                <th className="py-3 px-4">Olumlu / Geliştirilmeli</th>
                <th className="py-3 px-4">Veli Bağlantısı</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std, idx) => (
                <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-black text-slate-400">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <StudentAvatar
                        name={std.name}
                        color={std.avatarColor}
                        size="sm"
                        showBadge={false}
                      />
                      <div>
                        <p className="font-bold text-slate-900">{std.name} {std.surname}</p>
                        <p className="text-[10px] text-slate-400">#{std.studentNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                      +{std.totalPoints} Puan
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 font-bold mr-2">+{std.positivePoints}</span>
                    <span className="text-amber-600 font-bold">-{std.needsWorkPoints}</span>
                  </td>
                  <td className="py-3 px-4">
                    {std.parentConnected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Bağlı ({std.parentName.split(' ')[0]})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        Davet Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="softBrand"
                      size="sm"
                      onClick={() => setSelectedStudentForReport(std)}
                    >
                      Karnesini Gör
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detailed Report Modal */}
      {selectedStudentForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-pop overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <StudentAvatar
                  name={selectedStudentForReport.name}
                  color={selectedStudentForReport.avatarColor}
                  points={selectedStudentForReport.totalPoints}
                  size="md"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedStudentForReport.name} {selectedStudentForReport.surname}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Öğrenci Gelişim Karnesi • #{selectedStudentForReport.studentNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForReport(null)}
                className="w-8 h-8 rounded-full bg-slate-200/60 text-slate-600 flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Toplam Puan</span>
                  <div className="text-lg font-black text-slate-900">+{selectedStudentForReport.totalPoints}</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase">Olumlu</span>
                  <div className="text-lg font-black text-emerald-700">+{selectedStudentForReport.positivePoints}</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <span className="text-[10px] text-amber-600 font-bold uppercase">Geliştirilmeli</span>
                  <div className="text-lg font-black text-amber-700">-{selectedStudentForReport.needsWorkPoints}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  Son Davranış Günlüğü & Notlar
                </h4>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedStudentForReport.behaviorLogs.length > 0 ? (
                    selectedStudentForReport.behaviorLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{log.skillTitle}</p>
                          {log.note && <p className="text-slate-500 italic mt-0.5">"{log.note}"</p>}
                          <p className="text-[10px] text-slate-400 mt-0.5">{log.timestamp} • {log.awardedBy}</p>
                        </div>
                        <span
                          className={`font-black px-1.5 py-0.5 rounded-md text-[10px] ${
                            log.type === 'positive'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {log.type === 'positive' ? `+${log.pointValue}` : `${log.pointValue}`}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 py-3 text-center">Henüz özel kayıt girilmedi.</p>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-1">Veli İletişim Bilgileri:</h5>
                <p className="text-slate-600">{selectedStudentForReport.parentName} ({selectedStudentForReport.parentPhone})</p>
                <p className="text-slate-400 text-[11px]">{selectedStudentForReport.parentEmail}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <Button variant="secondary" size="sm" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" />
                Karnesini Yazdır
              </Button>
              <Button variant="primary" size="sm" onClick={() => setSelectedStudentForReport(null)}>
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
