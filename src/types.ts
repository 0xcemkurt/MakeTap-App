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
