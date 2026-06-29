import re

with open('frontend/src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# 1. Add quizzes and courses to state
hooks = """  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allQuizzes, setAllQuizzes] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  useEffect(() => {
    LearningService.getAnnouncements()
      .then((response) => setAnnouncements(response.data.slice(0, 3)))
      .catch((error) => console.error(error));

    LearningService.getDashboardStats()
      .then((response) => setStats(response.data))
      .catch((error) => console.error(error));
      
    LearningService.getQuizzes()
      .then((response) => setAllQuizzes(response.data))
      .catch((error) => console.error(error));
      
    LearningService.getCourses()
      .then((response) => setAllCourses(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleRandomQuiz = () => {
    if (allQuizzes.length > 0) {
      const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
      navigate(`/quiz/${randomQuiz.id}`);
    } else {
      navigate('/courses');
    }
  };

  const handleRandomStudy = () => {
    if (allCourses.length > 0) {
      const randomCourse = allCourses[Math.floor(Math.random() * allCourses.length)];
      navigate(`/study/${randomCourse.id}`);
    } else {
      navigate('/courses');
    }
  };"""

content = re.sub(r"  const \[announcements.*?  \}, \[\]\);", hooks, content, flags=re.DOTALL)

# 2. Update buttons to use new handlers
buttons = """              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" color="primary" size="large" onClick={handleRandomStudy} startIcon={<AutoStoriesIcon />} sx={{ justifyContent: 'flex-start', py: 2 }}>
                  Học Flashcard (Ngẫu nhiên)
                </Button>
                <Button variant="contained" color="secondary" size="large" onClick={handleRandomQuiz} startIcon={<PlayArrowIcon />} sx={{ justifyContent: 'flex-start', py: 2 }}>
                  Làm bài Quiz (Ngẫu nhiên)
                </Button>
              </Box>"""

content = re.sub(r"              <Box sx=\{\{ display: 'flex', flexDirection: 'column', gap: 2 \}\}>.*?              </Box>", buttons, content, flags=re.DOTALL)

with open('frontend/src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

