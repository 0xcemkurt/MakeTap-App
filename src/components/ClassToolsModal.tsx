import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Shuffle,
  Timer,
  CheckCheck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  Volume2,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onOpenAwardModal: (student: Student) => void;
  onUpdateAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => void;
}

export const ClassToolsModal: React.FC<ClassToolsModalProps> = ({
  isOpen,
  onClose,
  students,
  onOpenAwardModal,
  onUpdateAttendance,
}) => {
  const [activeTool, setActiveTool] = useState<'random' | 'timer' | 'attendance'>('random');

  // Random picker state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isRunning) {
      setIsRunning(false);
      confetti({ particleCount: 70, spread: 80 });
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  if (!isOpen) return null;

  const handlePickRandom = () => {
    if (students.length === 0) return;
    setIsSpinning(true);
    setSelectedStudent(null);

    let count = 0;
    const maxFlips = 18;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      setSelectedStudent(students[randomIndex]);
      count++;

      if (count >= maxFlips) {
        clearInterval(interval);
        setIsSpinning(false);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 100);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">MakeTab Sınıf Araçları</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tool selector tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 border-b border-slate-200/60 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveTool('random')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTool === 'random' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            Rastgele Seçici
          </button>
          <button
            onClick={() => setActiveTool('timer')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTool === 'timer' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            Zamanlayıcı
          </button>
          <button
            onClick={() => setActiveTool('attendance')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTool === 'attendance' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Yoklama
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTool === 'random' && (
            <div className="flex flex-col items-center text-center py-4 space-y-5">
              <div className="min-h-[160px] flex flex-col items-center justify-center">
                {selectedStudent ? (
                  <div className={`flex flex-col items-center transition-transform ${isSpinning ? 'scale-90 opacity-80' : 'scale-110'}`}>
                    <StudentAvatar
                      name={selectedStudent.name}
                      color={selectedStudent.avatarColor}
                      points={selectedStudent.totalPoints}
                      size="lg"
                    />
                    <h4 className="mt-3 text-lg font-black text-slate-800">
                      {selectedStudent.name} {selectedStudent.surname}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      Öğrenci No: #{selectedStudent.studentNumber}
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-3xl w-full">
                    <Shuffle className="w-10 h-10 text-blue-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-semibold text-slate-500">
                      Derste soru sormak veya tahtaya kaldırmak için butona bas!
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <button
                  onClick={handlePickRandom}
                  disabled={isSpinning}
                  className="flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-blue-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  {isSpinning ? 'Öğrenci Seçiliyor...' : 'Rastgele Öğrenci Seç'}
                </button>

                {selectedStudent && !isSpinning && (
                  <button
                    onClick={() => {
                      onOpenAwardModal(selectedStudent);
                      onClose();
                    }}
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Trophy className="w-4 h-4" />
                    Puan Ver
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTool === 'timer' && (
            <div className="flex flex-col items-center text-center py-4 space-y-6">
              {/* Timer Display */}
              <div className="w-44 h-44 rounded-full border-8 border-blue-500/20 bg-blue-50/50 flex flex-col items-center justify-center shadow-inner">
                <span className="text-4xl font-black text-slate-900 tracking-wider font-mono">
                  {formatTime(timerSeconds)}
                </span>
                <span className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">
                  {isRunning ? 'Çalışıyor' : 'Durduruldu'}
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                {[60, 180, 300, 600, 900].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setIsRunning(false);
                      setTimerSeconds(sec);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      timerSeconds === sec
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sec / 60} dk
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? 'Duraklat' : 'Başlat'}
                </button>

                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimerSeconds(300);
                  }}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTool === 'attendance' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Öğrenci</span>
                <span>Durum (Geldi / Geç / Yok)</span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <StudentAvatar
                        name={student.name}
                        color={student.avatarColor}
                        size="sm"
                        showBadge={false}
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {student.name} {student.surname}
                        </p>
                        <p className="text-[10px] text-slate-400">#{student.studentNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateAttendance(student.id, 'present')}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          student.attendance === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Geldi
                      </button>
                      <button
                        onClick={() => onUpdateAttendance(student.id, 'late')}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          student.attendance === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Geç
                      </button>
                      <button
                        onClick={() => onUpdateAttendance(student.id, 'absent')}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                          student.attendance === 'absent'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Yok
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
