export type Role = 'teacher' | 'parent';

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
