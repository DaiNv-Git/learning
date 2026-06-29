import { api } from './auth.service';
import type { AdminSummary, Announcement, Course, CourseResource, DashboardStats, Deck, Flashcard, Quiz, QuizAttempt, Question, UserRow } from '../types';

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

  getCourseResources(courseId: number) {
    return api.get<CourseResource[]>('/courses/' + courseId + '/resources');
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

  updateFlashcard(id: number, card: { deckId: number; frontText: string; backText: string; difficultyLevel: string }) {
    return api.put<Flashcard>('/flashcards/' + id, card);
  }

  deleteFlashcard(id: number) {
    return api.delete('/flashcards/' + id);
  }

  createQuiz(quiz: any) {
    return api.post<Quiz>('/quizzes', quiz);
  }

  getAnnouncements() {
    return api.get<Announcement[]>('/announcements');
  }

  getAdminAnnouncements() {
    return api.get<Announcement[]>('/admin/announcements');
  }

  createAnnouncement(announcement: { title: string; content: string; audience: string; active: boolean }) {
    return api.post<Announcement>('/announcements', announcement);
  }

  updateAnnouncement(id: number, announcement: { title: string; content: string; audience: string; active: boolean }) {
    return api.put<Announcement>('/announcements/' + id, announcement);
  }

  deleteAnnouncement(id: number) {
    return api.delete('/announcements/' + id);
  }

  createResource(resource: { courseId: number; title: string; url: string; type: string; description: string }) {
    return api.post<CourseResource>('/resources', resource);
  }

  updateResource(id: number, resource: { courseId: number; title: string; url: string; type: string; description: string }) {
    return api.put<CourseResource>('/resources/' + id, resource);
  }

  deleteResource(id: number) {
    return api.delete('/resources/' + id);
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

  updateUserRole(id: number, role: string) {
    return api.put('/admin/users/' + id + '/role', { role });
  }

  pushNotificationToAll(message: string) {
    return api.post('/notifications/admin/push/all', { message });
  }
}

export default new LearningService();
