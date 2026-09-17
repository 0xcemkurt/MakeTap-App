import React from 'react';
import { Student, Classroom } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Trophy,
  BookOpen,
  Award,
  Bell,
  ArrowRight,
} from 'lucide-react';

interface ParentPortalViewProps {
  student: Student;
  classroom: Classroom;
  onOpenChat: () => void;
  onOpenStory: () => void;
  onOpenCharacterAnalysis: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  student,
  classroom,
  onOpenChat,
  onOpenStory,
  onOpenCharacterAnalysis,
}) => {
  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      {/* Veli Karşılama Kartı */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-md">
              👨‍👩‍👧 MakeTab Veli Bilgilendirme Portalı
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
              4-A Sınıfı • {student.name} {student.surname}
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">
              Günlük başarılar, ödevler ve karakter gelişim karnesi (Öğretmen: Hakan KAVUZKOZ)
            </p>
          </div>

          <StudentAvatar
            name={student.name}
            color={student.avatarColor}
            points={student.totalPoints}
            size="lg"
            className="shrink-0"
          />
        </div>
      </div>

      {/* Çocuğun Günlük Özeti (Büyük Puan ve Durum) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-800 text-sm">
              {student.name}'in Bu Haftaki Puanı
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/50">
            %{Math.round((student.positivePoints / ((student.positivePoints + student.needsWorkPoints) || 1)) * 100)} Olumlu Davranış
          </span>
        </div>

        <div className="flex items-center justify-around text-center py-2">
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Toplam Puan</span>
            <div className="text-3xl font-black text-slate-900">+{student.totalPoints}</div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <span className="text-[11px] text-emerald-600 font-bold uppercase">Kazanılan Erdem</span>
            <div className="text-3xl font-black text-emerald-600">+{student.positivePoints}</div>
          </div>
          <div className="w-px h-10 bg-slate-200" />
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Sınıf Katılımı</span>
            <div className="text-sm font-black text-slate-800 mt-2">🌟 Örnek Öğrenci</div>
          </div>
        </div>

        {/* Quick action buttons for parents */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={onOpenChat}
            className="py-2.5 px-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Öğretmene Mesaj Yaz
          </button>

          <button
            onClick={onOpenCharacterAnalysis}
            className="py-2.5 px-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Karakter Raporunu Gör
          </button>
        </div>
      </div>

      {/* Son Davranışlar & Öğretmen Notları */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-600" />
          Son Kazanılan Puanlar ve Öğretmen Yorumları
        </h3>

        <div className="space-y-2">
          {student.behaviorLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-xs">{log.skillTitle}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                {log.note && (
                  <p className="text-xs text-slate-600 font-medium italic">
                    "{log.note}"
                  </p>
                )}
                <p className="text-[10px] text-blue-600 font-semibold">
                  Tarafından verildi: {log.awardedBy}
                </p>
              </div>

              <span className="font-black text-xs px-2 py-1 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                +{log.pointValue}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sınıf Akışı Teaser */}
      <div
        onClick={onOpenStory}
        className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-300 shadow-xs cursor-pointer transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
            📸
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
              4-A Sınıf Hikayesi ve Fotoğrafları
            </h4>
            <p className="text-xs text-slate-400">
              Fen laboratuvarı etkinliği ve haftalık duyurulara göz atın
            </p>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
