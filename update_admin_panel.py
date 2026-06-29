import re

with open('frontend/src/pages/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add Notifications icon
content = re.sub(r"import StyleIcon from '@mui/icons-material/Style';", 
                 "import StyleIcon from '@mui/icons-material/Style';\nimport NotificationsIcon from '@mui/icons-material/Notifications';\nimport SwapHorizIcon from '@mui/icons-material/SwapHoriz';", 
                 content)

# Add broadcast state
state_block = """  const [deckForm, setDeckForm] = useState(emptyDeck);
  const [cardForm, setCardForm] = useState(emptyCard);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');"""
content = re.sub(r"  const \[deckForm, setDeckForm\] = useState\(emptyDeck\);\n  const \[cardForm, setCardForm\] = useState\(emptyCard\);\n  const \[editingCard, setEditingCard\] = useState<Flashcard \| null>\(null\);", state_block, content)

# Add pushBroadcast and changeRole functions
funcs_block = """  const deleteUser = async (user: UserRow) => {
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

  const changeRole = async (user: UserRow) => {
    if (user.id === currentUser?.id) {
      notify('error', 'Không thể đổi quyền của chính mình.');
      return;
    }
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Đổi quyền của "${user.username}" thành ${newRole}?`)) return;
    try {
      await LearningService.updateUserRole(user.id, newRole);
      await refreshSummary();
      notify('success', `Đã cấp quyền ${newRole} cho người dùng.`);
    } catch (error) {
      console.error(error);
      notify('error', 'Không đổi được quyền người dùng.');
    }
  };

  const pushBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      notify('error', 'Nội dung thông báo không được trống.');
      return;
    }
    try {
      await LearningService.pushNotificationToAll(broadcastMessage);
      notify('success', 'Đã gửi thông báo tới tất cả người dùng.');
      setBroadcastMessage('');
    } catch (error) {
      console.error(error);
      notify('error', 'Gửi thông báo thất bại.');
    }
  };"""
content = re.sub(r"  const deleteUser = async \(user: UserRow\) => \{.*?\n  \};\n" , funcs_block + "\n", content, flags=re.DOTALL)

# Add Tab label
tabs_block = """          <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
            <Tab label="Tổng quan" />
            <Tab label="Khóa học" />
            <Tab label="Flashcard" />
            <Tab label="Người dùng" />
            <Tab label="Thông báo" />
          </Tabs>"""
content = re.sub(r'          <Tabs value=\{tab\}.*?</Tabs>', tabs_block, content, flags=re.DOTALL)


# Update User table rows with SwapHorizIcon
user_actions = """                      <TableCell align="right">
                        <IconButton color="warning" disabled={user.id === currentUser?.id} onClick={() => changeRole(user)} title="Đổi vai trò">
                          <SwapHorizIcon />
                        </IconButton>
                        <IconButton color="error" disabled={user.id === currentUser?.id} onClick={() => deleteUser(user)} title="Xóa người dùng">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>"""
content = re.sub(r"                      <TableCell align=\"right\">\n                        <IconButton color=\"error\".*?</TableCell>", user_actions, content, flags=re.DOTALL)


# Add Tab 4 for Notifications
tab_4_block = """          {tab === 4 && (
            <Card sx={{ p: 3, borderRadius: 1, maxWidth: 600 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Gửi thông báo (Broadcast)
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Gửi thông báo tới toàn bộ người dùng trong hệ thống ngay lập tức.
              </Typography>
              <Stack spacing={3}>
                <TextField 
                  label="Nội dung thông báo" 
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  multiline
                  minRows={4}
                  fullWidth
                />
                
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 800, mr: 1 }}>Mẫu nhanh:</Typography>
                  <Chip 
                    label="Nhắc nhở học tập" 
                    onClick={() => setBroadcastMessage('Đã đến giờ học tập! Hãy vào ôn tập lại các Flashcard của bạn ngay nhé.')} 
                    color="secondary"
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip 
                    label="Chào mừng" 
                    onClick={() => setBroadcastMessage('Chào mừng bạn đến với Smart Learning. Chúc bạn một ngày học tập hiệu quả!')} 
                    color="secondary"
                    variant="outlined"
                    sx={{ cursor: 'pointer' }}
                  />
                </Stack>

                <Button 
                  startIcon={<NotificationsIcon />} 
                  variant="contained" 
                  color="secondary" 
                  onClick={pushBroadcast}
                  sx={{ borderRadius: 1, py: 1.5, fontWeight: 800 }}
                >
                  Gửi tới tất cả
                </Button>
              </Stack>
            </Card>
          )}

        </Stack>"""
content = re.sub(r"          \}\)\}\n        </Stack>", "          })}\n\n" + tab_4_block, content, flags=re.DOTALL)


with open('frontend/src/pages/AdminPanel.tsx', 'w') as f:
    f.write(content)
