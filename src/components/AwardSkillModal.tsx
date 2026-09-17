import React, { useState } from 'react';
import { BehaviorSkill, Student } from '../types';
import { StudentAvatar } from './StudentAvatar';
import confetti from 'canvas-confetti';
import {
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Users,
  Flame,
  Smile,
  Lightbulb,
  ShieldCheck,
  VolumeX,
  Compass,
  Backpack,
  Clock,
  X,
  Plus,
  MessageSquare,
  Award,
} from 'lucide-react';

interface AwardSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetStudent: Student | null; // null means whole class
  skills: BehaviorSkill[];
  onAward: (skill: BehaviorSkill, note: string) => void;
  classNameTitle: string;
}

export const AwardSkillModal: React.FC<AwardSkillModalProps> = ({
  isOpen,
  onClose,
  targetStudent,
  skills,
  onAward,
  classNameTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'positive' | 'needsWork'>('positive');
  const [customNote, setCustomNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isOpen) return null;

  const filteredSkills = skills.filter((s) => s.type === activeTab);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Users':
        return <Users className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Smile':
        return <Smile className="w-6 h-6" />;
      case 'Lightbulb':
        return <Lightbulb className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'VolumeX':
        return <VolumeX className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'Backpack':
        return <Backpack className="w-6 h-6" />;
      case 'Clock':
        return <Clock className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const handleSelectSkill = (skill: BehaviorSkill) => {
    if (skill.type === 'positive') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });
    }
    onAward(skill, customNote);
    setCustomNote('');
    setShowNoteInput(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-lg sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="relative px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-b from-slate-50 to-white">
          <div className="flex items-center gap-3">
            {targetStudent ? (
              <StudentAvatar
                name={targetStudent.name}
                color={targetStudent.avatarColor}
                points={targetStudent.totalPoints}
                size="sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Users className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="font-extrabold text-slate-800 text-base leading-tight">
                {targetStudent ? `${targetStudent.name} ${targetStudent.surname}` : 'Tüm Sınıfa Puan Ver'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {targetStudent ? `${classNameTitle} • #${targetStudent.studentNumber}` : `${classNameTitle} (Toplu Ödül)`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex gap-2">
          <button
            onClick={() => setActiveTab('positive')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'positive'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Olumlu Beceriler (+)
          </button>

          <button
            onClick={() => setActiveTab('needsWork')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'needsWork'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25 scale-[1.02]'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <VolumeX className="w-4 h-4" />
            Geliştirilmeli (-)
          </button>
        </div>

        {/* Optional Teacher Note Bar */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white">
          {!showNoteInput ? (
            <button
              onClick={() => setShowNoteInput(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 py-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              + Öğretmen Gözlem Notu Ekle (İsteğe Bağlı)
            </button>
          ) : (
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Örn: Bugün fen deneyinde arkadaşlarına çok yardımcı oldu..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 transition-colors"
                autoFocus
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Bu not veli bildiriminde ve karakter analizinde görünür.</span>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setCustomNote('');
                  }}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skill grid with ample vertical room and no cut-off text */}
        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
          {filteredSkills.map((skill) => {
            const isPos = skill.type === 'positive';
            return (
              <button
                key={skill.id}
                onClick={() => handleSelectSkill(skill)}
                className="group p-3.5 pb-4 sm:p-4 sm:pb-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex flex-col items-center justify-between text-center relative min-h-[160px] sm:min-h-[170px]"
              >
                {/* Point badge pill */}
                <div
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black shadow-2xs ${
                    isPos ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-amber-100 text-amber-800 border border-amber-200/60'
                  }`}
                >
                  {isPos ? `+${skill.pointValue}` : `${skill.pointValue}`}
                </div>

                {/* Skill Icon Circle */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${skill.color}15`,
                    color: skill.color,
                  }}
                >
                  {getIcon(skill.iconName)}
                </div>

                {/* Text Content Block */}
                <div className="w-full flex-1 flex flex-col justify-center items-center">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 mb-1 leading-snug text-center px-1">
                    {skill.title}
                  </span>

                  <span className="text-[11px] text-slate-500 font-medium leading-normal text-center px-1 block break-words">
                    {skill.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            MakeTab Güvenli Gelişim Puanlaması • Veliler anında bilgilendirilir
          </p>
        </div>
      </div>
    </div>
  );
};
