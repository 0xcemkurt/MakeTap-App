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
  ChevronLeft,
  User,
  Phone,
  Info,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { TextInput } from './ui/TextInput';

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
  // Controls mobile layout view: parents go directly to chat, teachers start in list
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(
    currentRole === 'parent' ? 'chat' : 'list'
  );

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Quick pedagogical templates for teachers (no emojis)
  const teacherTemplates = [
    `Sayın Velimiz, ${currentStudent?.name}'in bu haftaki sorumluluk ve derse katılım performansı çok takdir topladı. Tebrik ederiz.`,
    `Merhaba, yarınki fen laboratuvarı etkinliğimiz için gerekli malzemeleri çantasında kontrol edebilirseniz çok seviniriz.`,
    `Değerli Velimiz, ${currentStudent?.name}'in son sınavındaki kavram sorularındaki başarısı gelişim karnesine yansıdı.`,
    `İyi günler, veli toplantımız için Perşembe günü saat 15:30 uygun mudur?`,
  ];

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setMobileView('chat');
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentStudent) return;

    const receiver = currentRole === 'teacher' ? `parent-${currentStudent.id}` : 'teacher-hakan';
    onSendMessage(receiver, inputText.trim());
    setInputText('');
  };

  const filteredStudents = students.filter(
    (s) =>
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter messages belonging to the selected student / parent conversation
  const rawStudentMessages = messages.filter((m) => {
    if (!currentStudent) return true;
    const parentTarget = `parent-${currentStudent.id}`;
    // Support legacy fatma id for std-1 seed
    if (currentStudent.id === 'std-1') {
      return (
        m.receiverId === parentTarget ||
        m.senderId === parentTarget ||
        m.receiverId === 'parent-fatma' ||
        m.senderId === 'parent-fatma'
      );
    }
    return m.receiverId === parentTarget || m.senderId === parentTarget;
  });

  // Provide realistic seed messages if thread is empty so user never sees a broken blank pane
  const studentMessages: ChatMessage[] =
    rawStudentMessages.length > 0
      ? rawStudentMessages
      : [
          {
            id: `seed-p-${currentStudent?.id || 'std'}`,
            senderId: `parent-${currentStudent?.id || 'std'}`,
            senderRole: 'parent',
            receiverId: 'teacher-hakan',
            text: `Hayırlı günler Hakan Öğretmenim, ${currentStudent?.name}'in bu haftaki sınıf uyumu ve ödev takibi nasıl gidiyor?`,
            timestamp: '09:10',
            isRead: true,
          },
          {
            id: `seed-t-${currentStudent?.id || 'std'}`,
            senderId: 'teacher-hakan',
            senderRole: 'teacher',
            receiverId: `parent-${currentStudent?.id || 'std'}`,
            text: `İyi günler sayın velimiz, ${currentStudent?.name} bu hafta derslerde çok aktifti ve pozitif davranış puanı kazandı. İlginiz için teşekkürler.`,
            timestamp: '09:25',
            isRead: true,
          },
        ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden overflow-x-clip flex flex-col md:flex-row h-[calc(100vh-190px)] min-h-[520px] max-h-[760px] max-w-full min-w-0">
      {/* Left Sidebar: Parent/Student Chat List */}
      <div
        className={`w-full md:w-80 md:border-r border-slate-200 flex-col bg-slate-50/60 shrink-0 ${
          mobileView === 'list' ? 'flex flex-1 md:flex-none' : 'hidden md:flex'
        }`}
      >
        <div className="p-3.5 sm:p-4 border-b border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-brand-600" />
              Güvenli Veli Sohbetleri
            </h3>
            <Badge tone="brand">
              {students.length} Veli
            </Badge>
          </div>

          <TextInput
            type="text"
            radius="xl"
            placeholder="Veli veya öğrenci ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
          />
        </div>

        {/* List of chats */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-w-0">
          {filteredStudents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Aramanızla eşleşen veli bulunamadı.
            </div>
          ) : (
            filteredStudents.map((std) => {
              const isSelected = std.id === selectedStudentId;
              const hasRecent = messages.some(
                (m) =>
                  m.receiverId === `parent-${std.id}` ||
                  m.senderId === `parent-${std.id}` ||
                  (std.id === 'std-1' && (m.receiverId === 'parent-fatma' || m.senderId === 'parent-fatma'))
              );

              return (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => handleSelectStudent(std.id)}
                  className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer select-none active:bg-brand-100 ${
                    isSelected ? 'bg-brand-50/90 border-l-4 border-brand-600' : 'hover:bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
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
                    <div className="flex justify-between items-center gap-1">
                      <p className="text-xs font-black text-slate-900 truncate">
                        {std.parentName}
                      </p>
                      {hasRecent && (
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {std.name} {std.surname}'in Velisi
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Quiet Hours Banner */}
        <div className="p-3 bg-slate-100/90 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-2 shrink-0">
          <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="leading-tight">
            Sessiz Saatler Aktif: 18:00 sonrası bildirimler otomatik sessize alınır.
          </span>
        </div>
      </div>

      {/* Right Chat Pane */}
      <div
        className={`flex-1 flex-col h-full bg-white min-w-0 max-w-full overflow-hidden ${
          mobileView === 'chat' ? 'flex' : 'hidden md:flex'
        }`}
      >
        {/* Chat Header */}
        {currentStudent && (
          <div className="p-3 sm:p-4 border-b border-slate-200/80 flex items-center justify-between gap-2 bg-slate-50/80 min-w-0 max-w-full shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {/* Mobile Back Button to list */}
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors shrink-0 font-extrabold text-xs shadow-2xs cursor-pointer"
                title="Tüm Sohbetlere Dön"
              >
                <ChevronLeft className="w-4 h-4 text-brand-600" />
                <span className="text-[11px]">Sohbetler</span>
              </button>

              <StudentAvatar
                name={currentStudent.name}
                color={currentStudent.avatarColor}
                points={currentStudent.totalPoints}
                size="sm"
              />

              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  {currentStudent.parentName}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 truncate">
                  <span className="text-slate-700 font-semibold truncate">
                    {currentStudent.name} {currentStudent.surname}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Çevrim İçi
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs whitespace-nowrap">
              <Lock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="hidden sm:inline">MEB Şifreli İletişim</span>
              <span className="sm:hidden">Güvenli</span>
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto overflow-x-hidden space-y-3 bg-slate-50/40 min-w-0 max-w-full">
          {/* Security Banner inside chat */}
          <div className="text-center my-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] text-slate-500 font-semibold border border-slate-200/60 max-w-[90%] truncate">
              <Shield className="w-3 h-3 text-brand-600 shrink-0" />
              MakeTab Uçtan Uca Şifreli Veli-Öğretmen İletişim Hattı
            </span>
          </div>

          {studentMessages.length === 0 ? (
            <div className="text-center py-12 px-4 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-black text-slate-800">Henüz Mesajlaşma Başlamadı</h5>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {currentStudent.parentName} ile ilk görüşmeyi başlatmak için aşağıdaki hızlı şablonlardan seçebilir veya mesaj yazabilirsiniz.
              </p>
            </div>
          ) : (
            studentMessages.map((msg) => {
              const isMe =
                currentRole === 'teacher'
                  ? msg.senderRole === 'teacher'
                  : msg.senderRole === 'parent';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col min-w-0 max-w-full ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed min-w-0 break-words [overflow-wrap:anywhere] [word-break:break-word] overflow-hidden ${
                      isMe
                        ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <p className="whitespace-pre-line break-words [overflow-wrap:anywhere] [word-break:break-word] select-text">
                      {msg.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium px-1">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-brand-500" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips (Öğretmen için hazır şablonlar) */}
        {currentRole === 'teacher' && (
          <div className="px-3 sm:px-4 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2 overflow-x-auto scrollbar-none min-w-0 max-w-full shrink-0">
            <span className="text-[10px] font-black text-slate-400 self-center shrink-0 uppercase tracking-wider">
              Şablon:
            </span>
            {teacherTemplates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputText(tpl)}
                className="text-[11px] font-semibold text-slate-700 hover:text-brand-700 bg-white hover:bg-brand-50 border border-slate-200/90 px-3 py-1.5 rounded-xl shrink-0 truncate max-w-xs transition-colors cursor-pointer shadow-2xs"
              >
                {tpl}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          className="p-2.5 sm:p-3 border-t border-slate-200 flex items-center gap-2 bg-white min-w-0 max-w-full shrink-0"
        >
          <div className="flex-1 min-w-0">
            <TextInput
              type="text"
              placeholder={
                currentRole === 'teacher'
                  ? `${currentStudent?.parentName || 'Velimize'} mesaj yazın...`
                  : 'Öğretmenimize mesaj iletin...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!inputText.trim()}
            className="shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gönder</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
