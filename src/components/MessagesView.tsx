import React, { useState } from 'react';
import { Student, ChatMessage, Role } from '../types';
import { StudentAvatar } from './StudentAvatar';
import {
  Send,
  Lock,
  Moon,
  Clock,
  CheckCheck,
  Search,
  Sparkles,
  Shield,
  MessageCircle,
} from 'lucide-react';

interface MessagesViewProps {
  students: Student[];
  messages: ChatMessage[];
  currentRole: Role;
  onSendMessage: (receiverId: string, text: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  students,
  messages,
  currentRole,
  onSendMessage,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Quick pedagogical templates for teachers
  const teacherTemplates = [
    `Sayın Velimiz, ${currentStudent?.name}'in bu haftaki sorumluluk ve derse katılım performansı çok takdir topladı. Tebrik ederiz! 🌟`,
    `Merhaba, yarınki fen laboratuvarı etkinliğimiz için gerekli malzemeleri çantasında kontrol edebilirseniz çok seviniriz. 🎒`,
    `Değerli Velimiz, ${currentStudent?.name}'in son sınavındaki kavram sorularındaki başarısı gelişim karnesine yansıdı. 👏`,
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentStudent) return;

    const receiver = currentRole === 'teacher' ? `parent-${currentStudent.id}` : 'teacher-ahmet';
    onSendMessage(receiver, inputText.trim());
    setInputText('');
  };

  const filteredStudents = students.filter(
    (s) =>
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[720px] max-h-[82vh]">
      {/* Left Sidebar: Parent/Student Chat List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              Güvenli Veli Sohbetleri
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
              {students.length} Veli
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Veli veya öğrenci ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium"
            />
          </div>
        </div>

        {/* List of chats */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredStudents.map((std) => {
            const isSelected = std.id === selectedStudentId;
            return (
              <button
                key={std.id}
                onClick={() => setSelectedStudentId(std.id)}
                className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                  isSelected ? 'bg-blue-50/90 border-l-4 border-blue-600' : 'hover:bg-white'
                }`}
              >
                <div className="relative">
                  <StudentAvatar
                    name={std.name}
                    color={std.avatarColor}
                    size="sm"
                    showBadge={false}
                  />
                  {std.parentConnected && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {std.parentName}
                    </p>
                    <span className="text-[10px] text-slate-400">Aktif</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {std.name} {std.surname}'in Velisi
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quiet Hours Banner */}
        <div className="p-3 bg-slate-100/80 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Sessiz Saatler Aktif: Akşam 18:00'den sonra öğretmen bildirimi otomatik sessize alınır.</span>
        </div>
      </div>

      {/* Right Chat Pane */}
      <div className="flex-1 flex flex-col h-full bg-white">
        {/* Chat Header */}
        {currentStudent && (
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-3">
              <StudentAvatar
                name={currentStudent.name}
                color={currentStudent.avatarColor}
                points={currentStudent.totalPoints}
                size="sm"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {currentStudent.parentName} ({currentStudent.name} {currentStudent.surname}'in Velisi)
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Çevrim İçi
                  </span>
                  <span>•</span>
                  <span>{currentStudent.parentPhone}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Güvenli & Gizli Sohbet</span>
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-slate-50/30">
          {/* Security Banner inside chat */}
          <div className="text-center my-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] text-slate-500 font-semibold border border-slate-200/60">
              <Shield className="w-3 h-3 text-blue-600" />
              MakeTab Şifreli Veli-Öğretmen İletişimi Protokolü
            </span>
          </div>

          {messages.map((msg) => {
            const isMe =
              currentRole === 'teacher'
                ? msg.senderRole === 'teacher'
                : msg.senderRole === 'parent';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs shadow-blue-500/10'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips (Öğretmen için hazır şablonlar) */}
        {currentRole === 'teacher' && (
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 self-center shrink-0">
              Hızlı Mesaj:
            </span>
            {teacherTemplates.map((tpl, i) => (
              <button
                key={i}
                onClick={() => setInputText(tpl)}
                className="text-[11px] font-semibold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 px-2.5 py-1 rounded-xl shrink-0 truncate max-w-xs transition-colors"
              >
                {tpl}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-200 flex items-center gap-2 bg-white"
        >
          <input
            type="text"
            placeholder={
              currentRole === 'teacher'
                ? 'Velimize nazik bir mesaj yazın...'
                : 'Öğretmenimize mesaj iletin...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl bg-slate-100/70 border border-transparent focus:border-blue-400 focus:bg-white focus:outline-hidden font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="py-2.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gönder</span>
          </button>
        </form>
      </div>
    </div>
  );
};
