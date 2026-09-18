import React, { useState } from 'react';
import {
  INITIAL_CLASSROOM,
  INITIAL_STORY_POSTS,
  INITIAL_MESSAGES,
  INITIAL_SKILLS,
  INITIAL_FINANCE_ITEMS,
  STEM_X_PRODUCT_DATA,
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
  ClassFinanceItem,
  StemProduct,
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
import { ClassFinanceModal } from './components/ClassFinanceModal';
import { StemXStoreModal } from './components/StemXStoreModal';
import { PrincipalDashboard } from './components/PrincipalDashboard';
import { SuitTieIcon } from './components/LoginView';
import {
  SchoolClassSummary,
  TeacherEvaluation,
  StaffMember,
  VisitorLog,
  PrincipalCalendarEvent,
  SchoolFinanceSummary,
  PrincipalAiInsight,
} from './types';
import {
  INITIAL_CLASSES_SUMMARY,
  INITIAL_TEACHER_EVALUATIONS,
  INITIAL_STAFF_MEMBERS,
  INITIAL_VISITOR_LOGS,
  INITIAL_PRINCIPAL_EVENTS,
  INITIAL_SCHOOL_FINANCE,
  INITIAL_PRINCIPAL_AI_INSIGHTS,
} from './data/principalData';
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
  Wallet,
  Bot,
  Eye,
  X,
} from 'lucide-react';
import { usePersistentState, clearDemoStorage } from './hooks/usePersistentState';
import { Button } from './components/ui/Button';

export default function App() {
  // Authentication State (defaults to null to prompt Member Login Screen, remembers session via localStorage)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('maketab_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.id && parsed?.role) {
          if (parsed.name?.includes('Hakan') && !parsed.avatar) {
            parsed.avatar = '/hakan_kavuzkoz.jpg';
          }
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Application State (Hafif MVP: localStorage'da kalıcı — refresh'te kaybolmaz)
  const [classroom, setClassroom] = usePersistentState<Classroom>('classroom', INITIAL_CLASSROOM);
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem('maketab_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role === 'principal' || parsed?.role === 'parent' || parsed?.role === 'teacher') {
          return parsed.role;
        }
      }
    } catch {
      // fallback
    }
    return 'teacher';
  });
  const [activeTab, setActiveTab] = useState<
    'classroom' | 'story' | 'messages' | 'reports' | 'ai-exam' | 'ai-character'
  >('classroom');

  // Principal State (Okul Müdürü Yönetim Masası)
  const [classesSummary, setClassesSummary] = useState<SchoolClassSummary[]>(INITIAL_CLASSES_SUMMARY);
  const [teacherEvaluations, setTeacherEvaluations] = useState<TeacherEvaluation[]>(INITIAL_TEACHER_EVALUATIONS);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(INITIAL_VISITOR_LOGS);
  const [calendarEvents, setCalendarEvents] = useState<PrincipalCalendarEvent[]>(INITIAL_PRINCIPAL_EVENTS);
  const [financialData, setFinancialData] = useState<SchoolFinanceSummary>(INITIAL_SCHOOL_FINANCE);
  const [aiInsights, setAiInsights] = useState<PrincipalAiInsight[]>(INITIAL_PRINCIPAL_AI_INSIGHTS);

  // Modals state
  const [awardTarget, setAwardTarget] = useState<Student | 'all' | null>(null);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [financeItems, setFinanceItems] = usePersistentState<ClassFinanceItem[]>('finance', INITIAL_FINANCE_ITEMS);
  const [stemProduct, setStemProduct] = useState<StemProduct>(STEM_X_PRODUCT_DATA);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isStemStoreOpen, setIsStemStoreOpen] = useState(false);

  // Story & Messages state (Hafif MVP: kalıcı)
  const [posts, setPosts] = usePersistentState<ClassStoryPost[]>('story_posts', INITIAL_STORY_POSTS);
  const [messages, setMessages] = usePersistentState<ChatMessage[]>('messages', INITIAL_MESSAGES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Giriş ekranı önizleme (çıkış yapmadan login tasarımını görmek için)
  const [showLoginPreview, setShowLoginPreview] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mobil alt navigasyon: sekme değişince içeriğin başını göster
  // (kullanıcı değişimi fark etmiyordu)
  const scrollContentTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('maketab_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    if (user.role === 'principal') {
      showToast(`Hoş geldiniz Sayın ${user.name}! (Okul Müdürü Yönetim Masası Aktif)`);
    } else {
      showToast(`Hoş geldiniz, ${user.name}! (4-A Sınıfı)`);
    }
  };

  // Principal Handlers
  const handleUpdateTeacherNote = (teacherId: string, note: string) => {
    const currentDate = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    setTeacherEvaluations((prev) =>
      prev.map((t) => {
        if (t.id !== teacherId) return t;
        return {
          ...t,
          principalNote: note,
          principalNoteDate: currentDate,
        };
      })
    );
    showToast('Öğretmen resmi sicil ve takdir notu başarıyla mühürlendi.');
  };

  const handleAddVisitor = (newVisitor: Omit<VisitorLog, 'id'>) => {
    const visitor: VisitorLog = {
      ...newVisitor,
      id: `vis-${Date.now()}`,
    };
    setVisitorLogs((prev) => [visitor, ...prev]);
    showToast(`${visitor.visitorName} için turnike güvenlik kaydı oluşturuldu.`);
  };

  const handleCheckOutVisitor = (visitorId: string) => {
    const exitTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setVisitorLogs((prev) =>
      prev.map((v) => {
        if (v.id !== visitorId) return v;
        return {
          ...v,
          status: 'checked_out',
          exitTime,
        };
      })
    );
    showToast('Ziyaretçi çıkış işlemi mühürlendi.');
  };

  const handleAddCalendarEvent = (newEvent: Omit<PrincipalCalendarEvent, 'id'>) => {
    const event: PrincipalCalendarEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, event]);
    showToast('Müdürlük resmi ajandasına yeni kayıt eklendi.');
  };

  const handleLogout = () => {
    setAuthUser(null);
    setCurrentRole('teacher');
    setActiveTab('classroom');
    setShowLoginPreview(false);
    try {
      localStorage.removeItem('maketab_auth_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Oturum başarıyla sonlandırıldı.');
  };

  const handleResetDemo = () => {
    if (!window.confirm('Demo verileri sıfırlansın mı? Puan, mesaj, hikaye ve finans başa döner.')) return;
    clearDemoStorage();
    setClassroom(INITIAL_CLASSROOM);
    setPosts(INITIAL_STORY_POSTS);
    setMessages(INITIAL_MESSAGES);
    setFinanceItems(INITIAL_FINANCE_ITEMS);
    showToast('Demo verileri sıfırlandı.');
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
      authorAvatar: authUser?.avatar || '/hakan_kavuzkoz.jpg',
      title: `Yeni Ödev: ${exam.title}`,
      content: `Sevgili öğrencilerimiz ve değerli velilerimiz, ${exam.subject} dersinden '${exam.topic}' konulu ${exam.questions.length} soruluk MakeTab alıştırması ödev olarak tanımlanmıştır. Başarılar dileriz!`,
      tag: 'Ödev',
      timestamp: 'Az önce',
    });
    showToast(`"${exam.title}" sınavı 4-A sınıfına atandı ve velilere bildirim gönderildi!`);
  };

  // Financial Handlers
  const handleTogglePayment = (itemId: string, studentId: string) => {
    setFinanceItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const current = item.payments?.[studentId];
        const isPaid = !!current?.paid;
        return {
          ...item,
          payments: {
            ...item.payments,
            [studentId]: {
              paid: !isPaid,
              paidAt: !isPaid
                ? new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
                : undefined,
              receiptNo: !isPaid ? `MK-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
            },
          },
        };
      })
    );
    showToast('Ödeme durumu başarıyla güncellendi.');
  };

  const handleAddFinanceItem = (newItem: Omit<ClassFinanceItem, 'id' | 'payments'>) => {
    const item: ClassFinanceItem = {
      ...newItem,
      id: `fin-${Date.now()}`,
      payments: {},
    };
    setFinanceItems((prev) => [item, ...prev]);
    showToast(`"${item.title}" fon kalemi sınıf bütçesine eklendi.`);
  };

  const handleOrderStemForClass = (product: StemProduct) => {
    const stemFinanceItem: ClassFinanceItem = {
      id: `fin-stem-${Date.now()}`,
      title: 'STEM-X Robotik Kodlama Kiti',
      description: 'Tüm sınıf için 12 projeli MEB uyumlu robotik kiti (Atölye katılımlı).',
      category: 'stem',
      amountPerStudent: product.discountedPrice,
      targetTotal: product.discountedPrice * classroom.students.length,
      dueDate: '30 Mart 2026',
      status: 'active',
      payments: {},
    };

    classroom.students.slice(0, 16).forEach((s) => {
      stemFinanceItem.payments[s.id] = {
        paid: true,
        paidAt: '16 Mart 2026',
        receiptNo: `MK-STEM-${s.studentNumber}`,
      };
    });

    setFinanceItems((prev) => {
      const existing = prev.find((p) => p.title.includes('STEM-X'));
      if (existing) return prev;
      return [stemFinanceItem, ...prev];
    });

    handleAddStoryPost({
      classId: 'class-4a',
      authorName: authUser?.name || 'Hakan KAVUZKOZ',
      authorRole: 'Sınıf Öğretmeni',
      authorAvatar: authUser?.avatar || '/hakan_kavuzkoz.jpg',
      title: 'STEM-X Robotik Kiti Sınıf Siparişi Açıldı!',
      content: `Değerli velilerimiz, öğrencilerimizin bilişim ve mühendislik becerilerini geliştirecek 'STEM-X Yeni Nesil Robotik Kodlama ve Deney Kiti' sınıfımıza özel ₺450 indirimli fiyatıyla kasaya eklenmiştir. İlk canlı atölyemiz 21 Mart Cumartesi günü saat 10:00'da!`,
      tag: 'Duyuru',
      timestamp: 'Az önce',
    });

    showToast('STEM-X sınıf bütçesine eklendi ve velilere duyuruldu!');
  };

  // If user is not authenticated, render the dedicated Login View
  if (!authUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Parent profile target for Parent Mode
  const parentStudent = classroom.students.find((s) => s.id === 'std-1') || classroom.students[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-x-clip">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-pop flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="break-words">{toastMessage}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 xl:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div
              className="cursor-pointer shrink-0"
              onClick={() => setActiveTab('classroom')}
              title="Ana Sayfaya Dön"
            >
              {/* Mobil: sadece ikon (yer kazan) */}
              <span className="sm:hidden">
                <MakeTabLogo size="sm" showText={false} />
              </span>
              <span className="hidden sm:block">
                <MakeTabLogo size="md" showText={true} />
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs (xl+: üstte, altı: altta sabit nav) */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 shrink-0">
            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-2.5 2xl:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 2xl:gap-1.5 ${
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
              className={`px-2.5 2xl:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 2xl:gap-1.5 ${
                activeTab === 'story'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Duyurular</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-2.5 2xl:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 2xl:gap-1.5 relative ${
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
              className={`px-2.5 2xl:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 2xl:gap-1.5 ${
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
              className={`px-2.5 2xl:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 2xl:gap-1.5 ${
                activeTab === 'ai-exam'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Sınav Atölyesi</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-character')}
              className={`px-2.5 2xl:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 2xl:gap-1.5 ${
                activeTab === 'ai-character'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-amber-300" />
              <span>Öğrenci Analiz</span>
            </button>
          </nav>

          {/* Right Header Actions: Role Switcher & User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Role Switcher Pill (Öğretmen vs Veli vs Okul Müdürü) */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200/80 text-[11px] font-bold shrink-0">
              <button
                onClick={() => setCurrentRole('teacher')}
                className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentRole === 'teacher'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Öğretmen Hesabı"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden 2xl:inline">Öğretmen</span>
              </button>

              <button
                onClick={() => setCurrentRole('parent')}
                className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentRole === 'parent'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Veli Hesabı"
              >
                <Heart className="w-3.5 h-3.5" />
                <span className="hidden 2xl:inline">Veli Modu</span>
              </button>

              <button
                onClick={() => setCurrentRole('principal')}
                className={`px-2 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  currentRole === 'principal'
                    ? 'bg-slate-950 text-amber-300 border border-amber-400/50 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Okul Müdürü Yönetim Masası (Üst Mod)"
              >
                <SuitTieIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden 2xl:inline">Okul Müdürü</span>
              </button>
            </div>

            {/* Authenticated User Badge & Logout Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                {authUser.avatar || (authUser.name.includes('Hakan') ? '/hakan_kavuzkoz.jpg' : null) ? (
                  <img
                    src={authUser.avatar || '/hakan_kavuzkoz.jpg'}
                    alt={authUser.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-xl object-cover border-2 border-blue-500 shadow-xs"
                    title={`${authUser.name} (${authUser.title})`}
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-xs select-none ${
                      currentRole === 'principal'
                        ? 'bg-gradient-to-tr from-amber-500 to-amber-700 text-slate-950 border border-amber-300'
                        : 'bg-linear-to-tr from-blue-700 to-indigo-600 text-white'
                    }`}
                    title={`${authUser.name} (${authUser.title})`}
                  >
                    {authUser.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                )}
                <div className="text-left leading-tight hidden 2xl:block max-w-36">
                  <div className="text-xs font-black text-slate-800 tracking-tight truncate">
                    {authUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold truncate">
                    {currentRole === 'principal'
                      ? 'Okul Müdürü Makamı'
                      : currentRole === 'teacher'
                      ? authUser.title
                      : 'Veli Görünümü'}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLoginPreview(true)}
                title="Çıkış yapmadan giriş ekranını önizle"
              >
                <Eye className="w-3.5 h-3.5 shrink-0" />
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                title="Oturumu Kapat (Çıkış Yap)"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden md:inline">Çıkış</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-20 sm:pb-8">
        {/* If Principal Mode is active, render the School Principal Dashboard */}
        {currentRole === 'principal' ? (
          <PrincipalDashboard
            authUser={authUser}
            classesSummary={classesSummary}
            teacherEvaluations={teacherEvaluations}
            staffMembers={staffMembers}
            visitorLogs={visitorLogs}
            calendarEvents={calendarEvents}
            financialData={financialData}
            aiInsights={aiInsights}
            onUpdateTeacherNote={handleUpdateTeacherNote}
            onAddVisitor={handleAddVisitor}
            onCheckOutVisitor={handleCheckOutVisitor}
            onAddCalendarEvent={handleAddCalendarEvent}
            onSwitchToTeacherMode={() => {
              setCurrentRole('teacher');
              setActiveTab('classroom');
              showToast('4-A Sınıfı Öğretmen Masasına Geçildi.');
            }}
          />
        ) : currentRole === 'parent' && activeTab === 'classroom' ? (
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
                financeItems={financeItems}
                stemProduct={stemProduct}
                onOpenFinance={() => setIsFinanceOpen(true)}
                onOpenStemStore={() => setIsStemStoreOpen(true)}
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

      {/* Footer: göze batmayan demo sıfırlama */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 pb-20 sm:pb-8 text-center">
        <button
          onClick={handleResetDemo}
          className="text-[11px] font-semibold text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
          title="Puan, mesaj, hikaye ve finans verilerini başa döndür (çıkış yapmaz)"
        >
          Demo verilerini sıfırla
        </button>
      </footer>

      {/* Mobile Bottom Floating Navigation Bar (xl altına kadar) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-2 shadow-2xl flex items-center justify-around safe-bottom">
        <button
          onClick={() => {
            setCurrentRole(currentRole === 'principal' ? 'teacher' : 'principal');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentRole === 'principal' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <SuitTieIcon className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] mt-0.5">{currentRole === 'principal' ? 'Müdürlük' : 'Müdür'}</span>
        </button>

        <button
          onClick={() => {
            if (currentRole === 'principal') setCurrentRole('teacher');
            setActiveTab('classroom');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'classroom' && currentRole !== 'principal'
              ? 'text-blue-600 font-extrabold'
              : 'text-slate-500 font-medium'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sınıfım</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('story');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'story' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Megaphone className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Duyurular</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ai-exam');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'ai-exam' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] mt-0.5">Sınav Atölyesi</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ai-character');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'ai-character' ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <BrainCircuit className="w-5 h-5 text-indigo-500" />
          <span className="text-[10px] mt-0.5">Öğrenci Analiz</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reports');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'reports' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Raporlar</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('messages');
            scrollContentTop();
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'messages' ? 'text-blue-600 font-extrabold' : 'text-slate-500 font-medium'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Mesaj</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2" />
        </button>
      </nav>

      {/* Login Preview Overlay (çıkış yapmadan giriş ekranını gör) */}
      {showLoginPreview && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-white">
          <Button
            variant="dark"
            size="sm"
            onClick={() => setShowLoginPreview(false)}
            title="Önizlemeyi kapat (oturum açık kalır)"
            className="fixed top-4 right-4 z-[70] shadow-pop"
          >
            <X className="w-4 h-4" />
            <span>Önizlemeyi Kapat</span>
          </Button>
          <LoginView
            onLogin={(user) => {
              handleLogin(user);
              setShowLoginPreview(false);
            }}
          />
        </div>
      )}

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

      {/* Class Finance Modal (Kasa & Aidat) */}
      <ClassFinanceModal
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        students={classroom.students}
        financeItems={financeItems}
        onTogglePayment={handleTogglePayment}
        onAddFinanceItem={handleAddFinanceItem}
      />

      {/* STEM-X Store & Workshop Schedule Modal */}
      <StemXStoreModal
        isOpen={isStemStoreOpen}
        onClose={() => setIsStemStoreOpen(false)}
        stemProduct={stemProduct}
        onOrderForClass={handleOrderStemForClass}
        onAnnounceInStory={(title, content) => {
          handleAddStoryPost({
            classId: 'class-4a',
            authorName: authUser?.name || 'Hakan KAVUZKOZ',
            authorRole: 'Sınıf Öğretmeni',
            title,
            content,
            tag: 'Duyuru',
            timestamp: 'Az önce',
          });
        }}
      />
    </div>
  );
}
