import React, { useState } from 'react';
import { Classroom, Student, BehaviorSkill } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Users,
  Trophy,
  Sparkles,
  Shuffle,
  Timer,
  CheckCheck,
  Plus,
  UserPlus,
  Award,
  Calendar,
  Flame,
  Search,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassroomViewProps {
  classroom: Classroom;
  onSelectStudent: (student: Student) => void;
  onAwardWholeClass: () => void;
  onOpenTools: () => void;
  onAddStudent: (newStudent: Omit<Student, 'id' | 'behaviorLogs'>) => void;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({
  classroom,
  onSelectStudent,
  onAwardWholeClass,
  onOpenTools,
  onAddStudent,
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
    <div className="space-y-5 pb-16">
      {/* Sınıf Bilgi ve Hızlı Eylem Çubuğu */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Canlı Sınıf Yönetimi • {classroom.schoolName}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {classroom.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Öğretmen: {classroom.teacherName} • {students.length} Kayıtlı Öğrenci
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAwardWholeClass}
            className="py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Bütün Sınıfa Puan Ver</span>
          </button>

          <button
            onClick={onOpenTools}
            className="py-2.5 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-600" />
            <span>Sınıf Araçları</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white active:scale-95 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>+ Öğrenci Ekle</span>
          </button>
        </div>
      </div>

      {/* Sınıf Puanı ve Arama Çubuğu */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Toplam Puan Rozeti */}
        <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/70 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black shadow-2xs self-start">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Sınıf Toplam Puanı: +{totalPoints} Puan</span>
          <span className="text-emerald-500 font-normal">|</span>
          <span className="text-[11px] font-bold text-emerald-700">Hedef: {classroom.pointsGoal}</span>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Öğrenci adı veya numarası ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-2xl bg-white border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium shadow-2xs"
          />
        </div>
      </div>

      {/* Student Monsters Grid (ClassDojo Classic Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            onClick={() => handleStudentClick(student)}
            className="group cursor-pointer bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex flex-col items-center text-center relative overflow-hidden select-none"
          >
            {/* Corner badge for attendance if not present */}
            {student.attendance !== 'present' && (
              <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                student.attendance === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {student.attendance === 'late' ? 'Geç' : 'Yok'}
              </span>
            )}

            {/* Monster Avatar */}
            <div className="my-1">
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
            <h4 className="font-black text-slate-800 text-xs sm:text-sm mt-1 truncate max-w-full group-hover:text-blue-600 transition-colors">
              {student.name} {student.surname}
            </h4>

            {/* Student Number & Veli status */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-slate-400 font-semibold">
                #{student.studentNumber}
              </span>
              {student.parentConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Veli Bağlı" />
              )}
            </div>

            {/* Quick point pill on hover */}
            <span className="mt-2 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              + Puan Ver
            </span>
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">4-A Sınıfına Yeni Öğrenci Ekle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Adı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Deniz"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Soyadı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Güneş"
                    value={newStudentSurname}
                    onChange={(e) => setNewStudentSurname(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Okul Numarası</label>
                <input
                  type="text"
                  placeholder="Örn: 145"
                  value={newStudentNumber}
                  onChange={(e) => setNewStudentNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Veli Adı Soyadı</label>
                  <input
                    type="text"
                    placeholder="Örn: Emre Güneş"
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Veli Telefonu</label>
                  <input
                    type="text"
                    placeholder="Örn: 0555 111 2233"
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl text-[11px] text-blue-800 font-medium">
                ✨ Öğrenci kaydedildiğinde MakeTab tarafından otomatik olarak sevimli bir canavar avatarı oluşturulacaktır.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
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
