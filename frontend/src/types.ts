export type Role = 'USER' | 'ADMIN';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type ProgressStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  token: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  decks: number;
  flashcards: number;
  quizzes: number;
  createdBy?: string;
  createdAt?: string;
}

export interface Deck {
  id: number;
  courseId: number;
  title: string;
  description: string;
  flashcardCount: number;
}

export interface CourseResource {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  url: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface Flashcard {
  id: number;
  deckId: number;
  frontText: string;
  backText: string;
  difficultyLevel: DifficultyLevel;
  status: ProgressStatus;
  lastEvaluation?: string | null;
}

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  timeLimitMinutes: number;
  questionCount: number;
}

export interface Question {
  id: number;
  questionText: string;
  optiona: string;
  optionb: string;
  optionc: string;
  optiond: string;
  explanation?: string;
}

export interface QuizAttempt {
  id: number;
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalDecks: number;
  totalFlashcards: number;
  studiedCards: number;
  masteredCards: number;
  quizAttempts: number;
  averageScore: number;
  recentAttempts: QuizAttempt[];
}

export interface AdminSummary {
  users: number;
  admins: number;
  courses: number;
  decks: number;
  flashcards: number;
  quizzes: number;
  attempts: number;
  resources: number;
  announcements: number;
}

export interface UserRow {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  audience: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
}
