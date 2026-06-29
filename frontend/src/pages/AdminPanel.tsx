import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QuizIcon from '@mui/icons-material/Quiz';
import RefreshIcon from '@mui/icons-material/Refresh';
import StyleIcon from '@mui/icons-material/Style';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import authService from '../services/auth.service';
import LearningService from '../services/learning.service';
import type { AdminSummary, Course, Deck, DifficultyLevel, Flashcard, UserRow } from '../types';

const MotionBox = motion.create(Box);

const emptyCourse = { title: '', description: '' };
const emptyDeck = { title: '', description: '' };
const emptyCard: { frontText: string; backText: string; difficultyLevel: DifficultyLevel } = {
  frontText: '',
  backText: '',
  difficultyLevel: 'MEDIUM',
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const [tab, setTab] = useState(0);
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState(emptyCourse);

  const [deckForm, setDeckForm] = useState(emptyDeck);
  const [cardForm, setCardForm] = useState(emptyCard);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    loadAdminData();
  }, [navigate]);

  const notify = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 2600);
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [summaryResponse, usersResponse, coursesResponse] = await Promise.all([
        LearningService.getAdminSummary(),
        LearningService.getUsers(),
        LearningService.getCourses(),
      ]);
      setSummary(summaryResponse.data);
      setUsers(usersResponse.data);
      setCourses(coursesResponse.data);

      const nextCourseId = coursesResponse.data[0]?.id ?? null;
      setSelectedCourseId(nextCourseId);
      if (nextCourseId) {
        await loadDecksForCourse(nextCourseId);
      } else {
        setDecks([]);
        setCards([]);
        setSelectedDeckId(null);
      }
    } catch (error) {
      console.error(error);
      notify('error', 'Không tải được dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  const loadDecksForCourse = async (courseId: number, preferredDeckId?: number | null) => {
    const deckResponse = await LearningService.getDecks(courseId);
    setDecks(deckResponse.data);
    const nextDeckId = deckResponse.data.some((deck) => deck.id === preferredDeckId)
      ? preferredDeckId ?? null
      : deckResponse.data[0]?.id ?? null;
    setSelectedDeckId(nextDeckId);
    if (nextDeckId) {
      const cardResponse = await LearningService.getFlashcards(nextDeckId);
      setCards(cardResponse.data);
    } else {
      setCards([]);
    }
  };

  const refreshSummary = async () => {
    const [summaryResponse, usersResponse, coursesResponse] = await Promise.all([
      LearningService.getAdminSummary(),
      LearningService.getUsers(),
      LearningService.getCourses(),
    ]);
    setSummary(summaryResponse.data);
    setUsers(usersResponse.data);
    setCourses(coursesResponse.data);
  };

  const openCreateCourse = () => {
    setEditingCourse(null);
    setCourseForm(emptyCourse);
    setCourseDialogOpen(true);
  };

  const openEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({ title: course.title, description: course.description });
    setCourseDialogOpen(true);
  };

  const saveCourse = async () => {
    if (!courseForm.title.trim()) {
      notify('error', 'Tên khóa học không được để trống.');
      return;
    }
    try {
      if (editingCourse) {
        await LearningService.updateCourse(editingCourse.id, courseForm);
        notify('success', 'Đã cập nhật khóa học.');
      } else {
        await LearningService.createCourse(courseForm);
        notify('success', 'Đã tạo khóa học mới.');
      }
      setCourseDialogOpen(false);
      await loadAdminData();
    } catch (error) {
      console.error(error);
      notify('error', 'Không lưu được khóa học.');
    }
  };

  const deleteCourse = async (course: Course) => {
    if (!window.confirm(`Xóa khóa học "${course.title}"?`)) return;
    try {
      await LearningService.deleteCourse(course.id);
      notify('success', 'Đã xóa khóa học.');
      await loadAdminData();
    } catch (error) {
      console.error(error);
      notify('error', 'Không xóa được khóa học này.');
    }
  };

  const selectCourse = async (courseId: number) => {
    setSelectedCourseId(courseId);
    try {
      await loadDecksForCourse(courseId);
    } catch (error) {
      console.error(error);
      notify('error', 'Không tải được bộ thẻ của khóa học.');
    }
  };

  const selectDeck = async (deckId: number) => {
    setSelectedDeckId(deckId);
    try {
      const cardResponse = await LearningService.getFlashcards(deckId);
      setCards(cardResponse.data);
    } catch (error) {
      console.error(error);
      notify('error', 'Không tải được flashcard.');
    }
  };

  const createDeck = async () => {
    if (!selectedCourseId || !deckForm.title.trim()) {
      notify('error', 'Chọn khóa học và nhập tên bộ thẻ.');
      return;
    }
    try {
      const response = await LearningService.createDeck({ courseId: selectedCourseId, ...deckForm });
      setDeckForm(emptyDeck);
      await loadDecksForCourse(selectedCourseId, response.data.id);
      await refreshSummary();
      notify('success', 'Đã tạo bộ flashcard.');
    } catch (error) {
      console.error(error);
      notify('error', 'Không tạo được bộ flashcard.');
    }
  };

  const saveCard = async () => {
    if (!selectedDeckId || !cardForm.frontText.trim() || !cardForm.backText.trim()) {
      notify('error', 'Chọn bộ thẻ và nhập đầy đủ hai mặt flashcard.');
      return;
    }
    const payload = { deckId: selectedDeckId, ...cardForm };
    try {
      if (editingCard) {
        await LearningService.updateFlashcard(editingCard.id, payload);
        notify('success', 'Đã cập nhật flashcard.');
      } else {
        await LearningService.createFlashcard(payload);
        notify('success', 'Đã thêm flashcard mới.');
      }
      setCardForm(emptyCard);
      setEditingCard(null);
      await selectDeck(selectedDeckId);
      await refreshSummary();
    } catch (error) {
      console.error(error);
      notify('error', 'Không lưu được flashcard.');
    }
  };

  const editCard = (card: Flashcard) => {
    setEditingCard(card);
    setCardForm({
      frontText: card.frontText,
      backText: card.backText,
      difficultyLevel: card.difficultyLevel,
    });
  };

  const cancelEditCard = () => {
    setEditingCard(null);
    setCardForm(emptyCard);
  };

  const deleteCard = async (card: Flashcard) => {
    if (!window.confirm('Xóa flashcard này?')) return;
    try {
      await LearningService.deleteFlashcard(card.id);
      if (selectedDeckId) await selectDeck(selectedDeckId);
      await refreshSummary();
      notify('success', 'Đã xóa flashcard.');
    } catch (error) {
      console.error(error);
      notify('error', 'Không xóa được flashcard.');
    }
  };

  const deleteUser = async (user: UserRow) => {
    if (user.id === currentUser?.id) {
      notify('error', 'Không thể xóa tài khoản đang đăng nhập.');
      return;
    }
    if (!window.confirm(`Xóa người dùng "${user.username}"?`)) return;
    try {
      await LearningService.deleteUser(user.id);
      await refreshSummary();
      notify('success', 'Đã xóa người dùng.');
    } catch (error) {
      console.error(error);
      notify('error', 'Không xóa được người dùng.');
    }
  };

  const selectedCourse = courses.find((course) => course.id === selectedCourseId);
  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ minHeight: 420, display: 'grid', placeItems: 'center' }}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <CircularProgress color="secondary" />
            <Typography color="text.secondary">Đang tải trang quản trị...</Typography>
          </Stack>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MotionBox initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary' }}>
                Admin quản trị
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                Theo dõi dữ liệu, quản lý khóa học, flashcard và tài khoản người dùng.
              </Typography>
            </Box>
            <Button startIcon={<RefreshIcon />} variant="outlined" onClick={loadAdminData} sx={{ borderRadius: 1 }}>
              Làm mới
            </Button>
          </Box>

          {message && <Alert severity={message.type}>{message.text}</Alert>}

          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
            <Tab label="Tổng quan" />
            <Tab label="Khóa học" />
            <Tab label="Flashcard" />
            <Tab label="Người dùng" />
          </Tabs>

          {tab === 0 && (
            <Grid container spacing={2}>
              <SummaryCard icon={<PeopleAltIcon />} label="Người dùng" value={summary?.users ?? 0} hint={`${summary?.admins ?? 0} admin`} />
              <SummaryCard icon={<LibraryBooksIcon />} label="Khóa học" value={summary?.courses ?? 0} hint={`${summary?.decks ?? 0} bộ thẻ`} />
              <SummaryCard icon={<StyleIcon />} label="Flashcard" value={summary?.flashcards ?? 0} hint="Có thể học trực tuyến" />
              <SummaryCard icon={<QuizIcon />} label="Bài kiểm tra" value={summary?.quizzes ?? 0} hint={`${summary?.attempts ?? 0} lượt làm bài`} />
            </Grid>
          )}

          {tab === 1 && (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Quản lý khóa học
                </Typography>
                <Button startIcon={<AddIcon />} variant="contained" color="secondary" onClick={openCreateCourse} sx={{ borderRadius: 1 }}>
                  Thêm khóa học
                </Button>
              </Box>

              <TableContainer component={Card} sx={{ borderRadius: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên khóa học</TableCell>
                      <TableCell>Mô tả</TableCell>
                      <TableCell>Học liệu</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id} hover>
                        <TableCell sx={{ fontWeight: 800 }}>{course.title}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', maxWidth: 420 }}>{course.description}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            <Chip size="small" label={`${course.decks} bộ`} />
                            <Chip size="small" label={`${course.flashcards} thẻ`} />
                            <Chip size="small" label={`${course.quizzes} quiz`} />
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => openEditCourse(course)} color="info">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteCourse(course)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}

          {tab === 2 && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ p: 3, borderRadius: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Chọn học liệu
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      select
                      label="Khóa học"
                      value={selectedCourseId ?? ''}
                      onChange={(event) => selectCourse(Number(event.target.value))}
                      fullWidth
                    >
                      {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.title}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Bộ flashcard"
                      value={selectedDeckId ?? ''}
                      onChange={(event) => selectDeck(Number(event.target.value))}
                      fullWidth
                      disabled={!decks.length}
                    >
                      {decks.map((deck) => (
                        <MenuItem key={deck.id} value={deck.id}>
                          {deck.title}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Divider />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Tạo bộ thẻ mới
                    </Typography>
                    <TextField label="Tên bộ thẻ" value={deckForm.title} onChange={(event) => setDeckForm({ ...deckForm, title: event.target.value })} />
                    <TextField
                      label="Mô tả"
                      value={deckForm.description}
                      onChange={(event) => setDeckForm({ ...deckForm, description: event.target.value })}
                      multiline
                      minRows={2}
                    />
                    <Button startIcon={<AddIcon />} variant="outlined" onClick={createDeck} disabled={!selectedCourseId} sx={{ borderRadius: 1 }}>
                      Tạo bộ thẻ
                    </Button>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                  <Card sx={{ p: 3, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {editingCard ? 'Sửa flashcard' : 'Thêm flashcard'}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {selectedDeck ? `Đang chọn: ${selectedCourse?.title} / ${selectedDeck.title}` : 'Chọn hoặc tạo bộ thẻ trước khi thêm flashcard.'}
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Mặt trước"
                        value={cardForm.frontText}
                        onChange={(event) => setCardForm({ ...cardForm, frontText: event.target.value })}
                        multiline
                        minRows={2}
                      />
                      <TextField
                        label="Mặt sau"
                        value={cardForm.backText}
                        onChange={(event) => setCardForm({ ...cardForm, backText: event.target.value })}
                        multiline
                        minRows={3}
                      />
                      <TextField
                        select
                        label="Độ khó"
                        value={cardForm.difficultyLevel}
                        onChange={(event) => setCardForm({ ...cardForm, difficultyLevel: event.target.value as DifficultyLevel })}
                      >
                        <MenuItem value="EASY">Dễ</MenuItem>
                        <MenuItem value="MEDIUM">Trung bình</MenuItem>
                        <MenuItem value="HARD">Khó</MenuItem>
                      </TextField>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        <Button startIcon={editingCard ? <EditIcon /> : <AddIcon />} variant="contained" color="secondary" onClick={saveCard} disabled={!selectedDeckId} sx={{ borderRadius: 1 }}>
                          {editingCard ? 'Cập nhật thẻ' : 'Thêm thẻ'}
                        </Button>
                        {editingCard && (
                          <Button variant="outlined" onClick={cancelEditCard} sx={{ borderRadius: 1 }}>
                            Hủy sửa
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Card>

                  <Card sx={{ p: 3, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                      Danh sách flashcard ({cards.length})
                    </Typography>
                    <Stack spacing={1.5}>
                      {cards.map((card) => (
                        <Box key={card.id} sx={{ p: 2, borderRadius: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'flex-start' } }}>
                            <Box>
                              <Chip size="small" label={card.difficultyLevel} sx={{ mb: 1 }} />
                              <Typography sx={{ fontWeight: 800 }}>{card.frontText}</Typography>
                              <Typography color="text.secondary" sx={{ mt: 0.75 }}>{card.backText}</Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <IconButton color="info" onClick={() => editCard(card)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton color="error" onClick={() => deleteCard(card)}>
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                      {!cards.length && (
                        <Typography color="text.secondary">
                          Bộ thẻ này chưa có flashcard. Hãy thêm thẻ đầu tiên ở biểu mẫu phía trên.
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          )}

          {tab === 3 && (
            <TableContainer component={Card} sx={{ borderRadius: 1, border: '1px solid rgba(255,255,255,0.08)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tài khoản</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 800 }}>{user.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip size="small" label={user.role} color={user.role === 'ADMIN' ? 'secondary' : 'default'} />
                      </TableCell>
                      <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}</TableCell>
                      <TableCell align="right">
                        <IconButton color="error" disabled={user.id === currentUser?.id} onClick={() => deleteUser(user)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </MotionBox>

      <Dialog
        open={courseDialogOpen}
        onClose={() => setCourseDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              minWidth: { xs: '92vw', sm: 520 },
              bgcolor: 'background.paper',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingCourse ? 'Cập nhật khóa học' : 'Tạo khóa học mới'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Tên khóa học" value={courseForm.title} onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })} />
            <TextField
              label="Mô tả"
              value={courseForm.description}
              onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCourseDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" color="secondary" onClick={saveCourse} sx={{ borderRadius: 1 }}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

function SummaryCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: number; hint: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card sx={{ p: 3, borderRadius: 1, height: '100%' }}>
        <Stack spacing={2}>
          <Box sx={{ color: 'secondary.main', display: 'flex' }}>{icon}</Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              {value}
            </Typography>
            <Typography sx={{ fontWeight: 800 }}>{label}</Typography>
            <Typography variant="body2" color="text.secondary">{hint}</Typography>
          </Box>
        </Stack>
      </Card>
    </Grid>
  );
}
