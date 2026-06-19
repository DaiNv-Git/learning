import { api } from './auth.service';
import type { AdminSummary, Course, DashboardStats, Deck, Flashcard, Quiz, QuizAttempt, Question, UserRow } from '../types';

class LearningService {
  getFlashcards(deckId: number) {
    return api.get<Flashcard[]>('/flashcards/deck/' + deckId);
  }

  submitFlashcardProgress(flashcardId: number, evaluation: string) {
    return api.post<Flashcard>(`/flashcards/progress?flashcardId=${flashcardId}&evaluation=${evaluation}`);
  }

  getQuizQuestions(quizId: number) {
    return api.get<Question[]>('/quizzes/' + quizId + '/questions');
  }

  submitQuiz(quizId: number, answers: Record<number, string>) {
    return api.post<QuizAttempt>('/quizzes/submit', {
      quizId,
      answers
    });
  }

  getCourses() {
    return api.get<Course[]>('/courses');
  }

  getDecks(courseId: number) {
    return api.get<Deck[]>('/courses/' + courseId + '/decks');
  }

  getQuizzes(courseId?: number) {
    const suffix = courseId ? `?courseId=${courseId}` : '';
    return api.get<Quiz[]>('/quizzes' + suffix);
  }

  getQuizAttempts() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return api.get<QuizAttempt[]>('/quizzes/attempts/' + (user?.id || 0));
  }

  getDashboardStats() {
    return api.get<DashboardStats>('/statistics');
  }

  createCourse(course: { title: string; description: string }) {
    return api.post<Course>('/courses', course);
  }

  deleteCourse(id: number) {
    return api.delete('/courses/' + id);
  }

  updateCourse(id: number, course: { title: string; description: string }) {
    return api.put<Course>('/courses/' + id, course);
  }

  createDeck(deck: { courseId: number; title: string; description: string }) {
    return api.post<Deck>('/decks', deck);
  }

  createFlashcard(card: { deckId: number; frontText: string; backText: string; difficultyLevel: string }) {
    return api.post<Flashcard>('/flashcards', card);
  }

  deleteFlashcard(id: number) {
    return api.delete('/flashcards/' + id);
  }

  createQuiz(quiz: any) {
    return api.post<Quiz>('/quizzes', quiz);
  }

  getAdminSummary() {
    return api.get<AdminSummary>('/admin/summary');
  }

  getUsers() {
    return api.get<UserRow[]>('/admin/users');
  }

  deleteUser(id: number) {
    return api.delete('/admin/users/' + id);
  }
}

export default new LearningService();
