export type Role = 'teacher' | 'parent' | 'principal';

export type BehaviorType = 'positive' | 'needsWork';

export interface BehaviorSkill {
  id: string;
  title: string;
  pointValue: number;
  type: BehaviorType;
  iconName: string;
  color: string;
  description: string;
}

export interface BehaviorLog {
  id: string;
  studentId: string;
  skillId: string;
  skillTitle: string;
  pointValue: number;
  type: BehaviorType;
  timestamp: string;
  note?: string;
  awardedBy: string;
}

export type StudentArchetype =
  | 'leader'        // En Başarılı / Sınıf Lideri
  | 'energetic'     // En Hareketli & Yüksek Enerji
  | 'curious'       // STEM & Araştırmacı
  | 'creative'      // Sanatçı & Yaratıcı
  | 'social'        // Paylaşımcı & Yardımsever
  | 'focus';        // Birebir İlgi & Gelişim

export interface Student {
  id: string;
  name: string;
  surname: string;
  studentNumber: string;
  avatarColor: string;
  avatarShape: string;
  avatarMood: string;
  totalPoints: number;
  positivePoints: number;
  needsWorkPoints: number;
  attendance: 'present' | 'absent' | 'late';
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentConnected: boolean;
  notes: string;
  behaviorLogs: BehaviorLog[];
  // Extended Student Profile & Pedagogical Insights
  archetype?: StudentArchetype;
  archetypeLabel?: string;
  bestFriendName?: string;
  efficiencyRate?: number;
  attentionTopic?: string;
  motivationalBadge?: string;
}

export interface Classroom {
  id: string;
  name: string;
  gradeLevel: string;
  section: string;
  schoolName: string;
  teacherName: string;
  students: Student[];
  pointsGoal: number;
  academicYear: string;
}

export interface ClassStoryPost {
  id: string;
  classId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  title: string;
  content: string;
  tag: 'Duyuru' | 'Etkinlik' | 'Ödev' | 'Başarı';
  imageUrl?: string;
  timestamp: string;
  likesCount: number;
  likedByUser: boolean;
  comments: {
    id: string;
    authorName: string;
    authorRole: string;
    text: string;
    timestamp: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: Role;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  pedagogicalTip: string;
}

export interface GeneratedExam {
  title: string;
  targetOutcome: string;
  durationMinutes: number;
  gradeLevel: string;
  subject: string;
  topic: string;
  difficulty: string;
  questions: ExamQuestion[];
  createdAt: string;
}

export interface CharacterStrength {
  trait: string;
  description: string;
  level: number;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: Role;
  title: string;
  schoolName: string;
  className: string;
  email: string;
}

export interface CharacterAnalysisResult {
  studentId: string;
  studentName: string;
  archetype: string;
  avatarMood: string;
  summary: string;
  characterStrengths: CharacterStrength[];
  growthOpportunities: string[];
  teacherRecommendations: string[];
  parentFeedbackLetter: string;
  analyzedAt: string;
}

export interface ClassFinanceItem {
  id: string;
  title: string;
  description: string;
  category: 'gezi' | 'etkinlik' | 'materyal' | 'aidat' | 'stem';
  amountPerStudent: number;
  targetTotal: number;
  dueDate: string;
  status: 'active' | 'completed';
  payments: Record<string, { paid: boolean; paidAt?: string; receiptNo?: string }>;
}

export interface StemWorkshopEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  instructor: string;
  description: string;
  spotsLeft: number;
  enrolledStudentsCount: number;
  gradeLevel?: string;
}

export interface StemProduct {
  id: string;
  name: string;
  tagline: string;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  features: string[];
  badge: string;
  imageUrl?: string;
  events: StemWorkshopEvent[];
}

// ==========================================
// OKUL MÜDÜRÜ (PRINCIPAL) VERİ TİPLERİ
// ==========================================

export interface ParentReview {
  id: string;
  parentName: string;
  studentName: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  tag: string;
  aspect: 'iletisim' | 'pedagoji' | 'etkinlik' | 'disiplin' | 'stem';
}

export interface TeacherEvaluation {
  id: string;
  name: string;
  title: string;
  className: string;
  branch: string;
  experienceYears: number;
  avatarUrl?: string;
  overallRating: number; // e.g. 4.9
  pedagogyRating: number;
  communicationRating: number;
  activityRating: number;
  totalParentReviews: number;
  badges: string[];
  parentComments: ParentReview[];
  principalNote?: string;
  principalNoteDate?: string;
}

export interface SchoolClassSummary {
  id: string;
  name: string;
  grade: number;
  teacherName: string;
  studentCount: number;
  presentCount: number;
  attendanceRate: number; // e.g. 96
  totalPoints: number;
  averageEfficiency: number; // e.g. 92
  parentAppAdoptionRate: number; // e.g. 95
  academicBadge: string;
  status: 'excellent' | 'normal' | 'attention';
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'janitor' | 'security' | 'officer' | 'technician' | 'nurse';
  roleLabel: string;
  dutyArea: string;
  phone: string;
  shift: string;
  status: 'on_duty' | 'break' | 'off_duty';
  hygieneOrSecurityScore: number; // %98
  lastInspectionNote: string;
  assignedFloor?: string;
}

export interface VisitorLog {
  id: string;
  visitorName: string;
  tcMasked: string;
  purpose: string;
  visitingWhom: string;
  entryTime: string;
  exitTime?: string;
  badgeNo: string;
  status: 'inside' | 'checked_out';
  securityOfficer: string;
}

export interface PrincipalCalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'mem' | 'meeting' | 'inspection' | 'drill' | 'parent';
  status: 'upcoming' | 'completed';
  urgency: 'high' | 'normal';
}

export interface SchoolFinanceSummary {
  totalBudget: number;
  totalIncome: number;
  totalExpense: number;
  netReserve: number;
  incomeBreakdown: { title: string; amount: number; source: string; percentage: number }[];
  expenseBreakdown: { title: string; amount: number; category: string; percentage: number }[];
  recentTransactions: { id: string; title: string; type: 'income' | 'expense'; amount: number; date: string; category: string }[];
}

export interface PrincipalAiInsight {
  id: string;
  type: 'academic' | 'climate' | 'finance' | 'safety' | 'attendance';
  title: string;
  description: string;
  metric?: string;
  recommendation: string;
  status: 'urgent' | 'positive' | 'strategic';
  date: string;
}

