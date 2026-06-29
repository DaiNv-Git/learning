import re

with open('frontend/src/pages/CourseDetail.tsx', 'r') as f:
    content = f.read()

# Fix icon
content = content.replace("import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';", "import PlayArrowIcon from '@mui/icons-material/PlayArrow';")
content = content.replace("<PlayCircleOutlineIcon", "<PlayArrowIcon")

# Fix Stack
content = content.replace("<Stack direction=\"row\" justifyContent=\"space-between\" alignItems=\"center\" mb={2}>", "<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>")
content = content.replace("</Stack>", "</Box>")

with open('frontend/src/pages/CourseDetail.tsx', 'w') as f:
    f.write(content)

