import axios from 'axios';
import authService from './auth.service';

const API_URL = 'http://localhost:8080/api/';

const getAuthHeader = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

class LearningService {
  // --- Flashcards ---
  getFlashcards(deckId: number) {
    return axios.get(API_URL + 'flashcards/deck/' + deckId, { headers: getAuthHeader() });
  }

  submitFlashcardProgress(flashcardId: number, evaluation: string) {
    const user = authService.getCurrentUser();
    // In our simplified API we pass userId and flashcardId
    return axios.post(API_URL + `flashcards/progress?userId=${user.id || 1}&flashcardId=${flashcardId}&evaluation=${evaluation}`, {}, { headers: getAuthHeader() });
  }

  // --- Quizzes ---
  getQuizQuestions(quizId: number) {
    return axios.get(API_URL + 'quizzes/' + quizId + '/questions', { headers: getAuthHeader() });
  }

  submitQuiz(quizId: number, answers: Record<number, string>) {
    const user = authService.getCurrentUser();
    return axios.post(API_URL + 'quizzes/submit', {
      quizId,
      userId: user?.id || 1,
      answers
    }, { headers: getAuthHeader() });
  }

  // --- Profile & Courses ---
  getCourses() {
    return axios.get(API_URL + 'courses', { headers: getAuthHeader() });
  }

  getQuizAttempts() {
    const user = authService.getCurrentUser();
    return axios.get(API_URL + 'quizzes/attempts/' + (user?.id || 1), { headers: getAuthHeader() });
  }

  // --- Admin ---
  createCourse(course: any) {
    return axios.post(API_URL + 'courses', course, { headers: getAuthHeader() });
  }

  deleteCourse(id: number) {
    return axios.delete(API_URL + 'courses/' + id, { headers: getAuthHeader() });
  }
}

export default new LearningService();
