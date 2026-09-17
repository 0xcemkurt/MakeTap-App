import React, { useState } from 'react';
import {
  INITIAL_CLASSROOM,
  INITIAL_STORY_POSTS,
  INITIAL_MESSAGES,
  INITIAL_SKILLS,
} from './data/initialData';
import {
  Classroom,
  Student,
  Role,
  ClassStoryPost,
  ChatMessage,
  BehaviorSkill,
  GeneratedExam,
  AuthUser,
} from './types';
import { MakeTabLogo } from './components/MakeTabLogo';
import { LoginView, DEMO_TEACHER } from './components/LoginView';
import { ClassroomView } from './components/ClassroomView';
import { AwardSkillModal } from './components/AwardSkillModal';
import { ClassToolsModal } from './components/ClassToolsModal';
import { ClassStory } from './components/ClassStory';
import { MessagesView } from './components/MessagesView';
import { AnalyticsReports } from './components/AnalyticsReports';
import { AiExamGenerator } from './components/AiExamGenerator';
import { AiCharacterAnalyst } from './components/AiCharacterAnalyst';
import { ParentPortalView } from './components/ParentPortalView';
import {
  Users,
  Megaphone,
  MessageCircle,
  BarChart3,
  BrainCircuit,
  Sparkles,
  GraduationCap,
  Heart,
  LogOut,
  UserCheck,
} from 'lucide-react';

export default function App() {
  // Authentication State (defaults to null to prompt Member Login Screen, remembers session via localStorage)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('maketab_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name?.includes('Hakan') || parsed?.username?.includes('Hakan')) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Application State
  const [classroom, setClassroom] = useState<Classroom>(INITIAL_CLASSROOM);
  const [currentRole, setCurrentRole] = useState<Role>('teacher');
  const [activeTab, setActiveTab] = useState<
    'classroom' | 'story' | 'messages' | 'reports' | 'ai-exam' | 'ai-character'
  >('classroom');

  // Modals state
  const [awardTarget, setAwardTarget] = useState<Student | 'all' | null>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Story & Messages state
  const [posts, setPosts] = useState<ClassStoryPost[]>(INITIAL_STORY_POSTS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    setCurrentRole('teacher');
    try {
      localStorage.setItem('maketab_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(`Hoş geldiniz, ${user.name}! (4-A Sınıfı)`);
  };

  const handleLogout = () => {
    setAuthUser(null);
    try {
      localStorage.removeItem('maketab_auth_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Oturum başarıyla sonlandırıldı.');
  };

  // Awarding points to single student or entire class
  const handleAwardSkill = (skill: BehaviorSkill, note: string) => {
    const timestamp = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (awardTarget === 'all') {
      setClassroom((prev) => ({
        ...prev,
        students: prev.students.map((s) => ({
          ...s,
          totalPoints: s.totalPoints + skill.pointValue,
          positivePoints: skill.type === 'positive' ? s.positivePoints + skill.pointValue : s.positivePoints,
          needsWorkPoints: skill.type === 'needsWork' ? s.needsWorkPoints + Math.abs(skill.pointValue) : s.needsWorkPoints,
          behaviorLogs: [
            {
              id: `log-${Date.now()}-${s.id}`,
              studentId: s.id,
              skillId: skill.id,
              skillTitle: skill.title,
              skillIcon: skill.iconName || 'Sparkles',
              pointValue: skill.pointValue,
              type: skill.type,
              note: note || undefined,
              timestamp,
              awardedBy: authUser ? `${authUser.name} (${authUser.title})` : 'Hakan KAVUZKOZ (Öğretmen)',
            },
            ...s.behaviorLogs,
          ],
        })),
      }));
      showToast(`Tüm sınıfa "${skill.title}" erdemi için ${skill.pointValue > 0 ? '+' : ''}${skill.pointValue} puan verildi!`);
    } else if (awardTarget) {
      setClassroom((prev) => ({
        ...prev,
        students: prev.students.map((s) => {
          if (s.id !== awardTarget.id) return s;
          return {
            ...s,
            totalPoints: s.totalPoints + skill.pointValue,
            positivePoints: skill.type === 'positive' ? s.positivePoints + skill.pointValue : s.positivePoints,
            needsWorkPoints: skill.type === 'needsWork' ? s.needsWorkPoints + Math.abs(skill.pointValue) : s.needsWorkPoints,
            behaviorLogs: [
              {
                id: `log-${Date.now()}-${s.id}`,
                studentId: s.id,
                skillId: skill.id,
                skillTitle: skill.title,
                skillIcon: skill.iconName || 'Sparkles',
                pointValue: skill.pointValue,
                type: skill.type,
                note: note || undefined,
                timestamp,
                awardedBy: authUser ? `${authUser.name} (${authUser.title})` : 'Hakan KAVUZKOZ (Öğretmen)',
              },
              ...s.behaviorLogs,
            ],
          };
        }),
      }));
      showToast(`${awardTarget.name} için "${skill.title}" puanı (${skill.pointValue > 0 ? '+' : ''}${skill.pointValue}) kaydedildi!`);
    }

    setAwardTarget(null);
  };

  // Add new student
  const handleAddStudent = (newStudentData: Omit<Student, 'id' | 'behaviorLogs'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `std-${Date.now()}`,
      behaviorLogs: [],
    };
    setClassroom((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));
    showToast(`${newStudent.name} ${newStudent.surname} başarıyla sınıfa eklendi!`);
  };

  // Update attendance from tools
  const handleUpdateAttendance = (studentId: string, status: 'present' | 'late' | 'absent') => {
    setClassroom((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, attendance: status } : s)),
    }));
  };

  // Story Interactions
  const handleAddStoryPost = (
    post: Omit<ClassStoryPost, 'id' | 'likesCount' | 'likedByUser' | 'comments'>
  ) => {
    const newPost: ClassStoryPost = {
      ...post,
      id: `story-${Date.now()}`,
      likesCount: 1,
      likedByUser: true,
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    showToast('Yeni sınıf hikayesi tüm velilerle paylaşıldı!');
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          likesCount: p.likedByUser ? p.likesCount - 1 : p.likesCount + 1,
          likedByUser: !p.likedByUser,
        };
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const author = currentRole === 'teacher' ? (authUser?.name || 'Hakan KAVUZKOZ') : 'Fatma Kaya';
    const roleText = currentRole === 'teacher' ? 'Sınıf Öğretmeni' : 'Veli';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: `c-${Date.now()}`,
              authorName: author,
              authorRole: roleText,
              text,
              timestamp: 'Şimdi',
            },
          ],
        };
      })
    );
    showToast('Yorumunuz sınıf akışına eklendi!');
  };

  // Send Chat Message
  const handleSendMessage = (receiverId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentRole === 'teacher' ? (authUser?.id || 'teacher-hakan') : 'parent-std-1',
      senderRole: currentRole,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast('Mesajınız güvenli kanal üzerinden iletildi.');
  };

  // Exam Assigned Handler
  const handleAssignExamToClass = (exam: GeneratedExam) => {
    handleAddStoryPost({
      classId: 'class-4a',
      authorName: authUser?.name || 'Hakan KAVUZKOZ',
      authorRole: 'Sınıf Öğretmeni',
      title: `📝 Yeni Ödev: ${exam.title}`,
      content: `Sevgili öğrencilerimiz ve değerli velilerimiz, ${exam.subject} dersinden '${exam.topic}' konulu ${exam.questions.length} soruluk MakeTab alıştırması ödev olarak tanımlanmıştır. Başarılar dileriz!`,
      tag: 'Ödev',
      timestamp: 'Az önce',
    });
    showToast(`"${exam.title}" sınavı 4-A sınıfına atandı ve velilere bildirim gönderildi!`);
  };

  // If user is not authenticated, render the dedicated Login View
  if (!authUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Parent profile target for Parent Mode
  const parentStudent = classroom.students.find((s) => s.id === 'std-1') || classroom.students[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div
              className="cursor-pointer"
              onClick={() => setActiveTab('classroom')}
              title="Ana Sayfaya Dön"
            >
              <MakeTabLogo size="md" showText={true} />
            </div>

            {/* Class Pill indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>4-A Sınıfı ({classroom.students.length} Öğrenci)</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'classroom'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Sınıfım</span>
            </button>

            <button
              onClick={() => setActiveTab('story')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'story'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Sınıf Hikayesi</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 relative ${
                activeTab === 'messages'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Mesajlar</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Gelişim Raporları</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-exam')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'ai-exam'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Sınav & Eğitim</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-character')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'ai-character'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Karakter Analisti</span>
            </button>
          </nav>

          {/* Right Header Actions: Role Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill (Öğretmen vs Veli Modu) */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200/80 text-[11px] font-bold">
              <button
                onClick={() => setCurrentRole('teacher')}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentRole === 'teacher'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Öğretmen Hesabı"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Öğretmen</span>
              </button>

              <button
                onClick={() => setCurrentRole('parent')}
                className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentRole === 'parent'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Veli Hesabı"
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Veli Modu</span>
              </button>
            </div>

            {/* Authenticated User Badge & Logout Button */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-700 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs select-none"
                  title={`${authUser.name} (${authUser.title})`}
                >
                  {authUser.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="text-left leading-tight hidden xl:block">
                  <div className="text-xs font-black text-slate-800 tracking-tight">
                    {authUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold">
                    {currentRole === 'teacher' ? authUser.title : 'Veli Görünümü'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200/80 cursor-pointer active:scale-95"
                title="Oturumu Kapat (Çıkış Yap)"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 sm:pb-8">
        {/* If Parent Role is selected, show the Parent View or selected tab */}
        {currentRole === 'parent' && activeTab === 'classroom' ? (
          <ParentPortalView
            student={parentStudent}
            classroom={classroom}
            onOpenChat={() => setActiveTab('messages')}
            onOpenStory={() => setActiveTab('story')}
            onOpenCharacterAnalysis={() => setActiveTab('ai-character')}
          />
        ) : (
          <>
            {activeTab === 'classroom' && (
              <ClassroomView
                classroom={classroom}
                onSelectStudent={(student) => setAwardTarget(student)}
                onAwardWholeClass={() => setAwardTarget('all')}
                onOpenTools={() => setIsToolsOpen(true)}
                onAddStudent={handleAddStudent}
              />
            )}

            {activeTab === 'story' && (
              <ClassStory
                posts={posts}
                currentRole={currentRole}
                onAddPost={handleAddStoryPost}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
              />
            )}

            {activeTab === 'messages' && (
              <MessagesView
                students={classroom.students}
                messages={messages}
                currentRole={currentRole}
                onSendMessage={handleSendMessage}
              />
            )}

            {activeTab === 'reports' && <AnalyticsReports classroom={classroom} />}

            {activeTab === 'ai-exam' && (
              <AiExamGenerator onAssignToClass={handleAssignExamToClass} />
            )}

            {activeTab === 'ai-character' && (
              <AiCharacterAnalyst
                students={classroom.students}
                onSendMessageToParent={(student, letter) => {
                  handleSendMessage(`parent-${student.id}`, letter);
                  setActiveTab('messages');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Floating Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-2 shadow-2xl flex items-center justify-around safe-bottom">
        <button
          onClick={() => setActiveTab('classroom')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'classroom' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sınıfım</span>
        </button>

        <button
          onClick={() => setActiveTab('story')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'story' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Hikaye</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-exam')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'ai-exam' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] mt-0.5">AI Sınav</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-character')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'ai-character' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <BrainCircuit className="w-5 h-5 text-indigo-500" />
          <span className="text-[10px] mt-0.5">Analist</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'reports' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Raporlar</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'messages' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Mesaj</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2" />
        </button>
      </nav>

      {/* Award Skill Modal */}
      {awardTarget !== null && (
        <AwardSkillModal
          isOpen={true}
          onClose={() => setAwardTarget(null)}
          targetStudent={awardTarget === 'all' ? null : awardTarget}
          skills={INITIAL_SKILLS}
          onAward={handleAwardSkill}
          classNameTitle={classroom.name}
        />
      )}

      {/* Class Tools Modal (Picker, Timer, Attendance) */}
      <ClassToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        students={classroom.students}
        onOpenAwardModal={(student: Student) => {
          setIsToolsOpen(false);
          setAwardTarget(student);
        }}
        onUpdateAttendance={handleUpdateAttendance}
      />
    </div>
  );
}
