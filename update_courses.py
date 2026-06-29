import re

with open('frontend/src/pages/Courses.tsx', 'r') as f:
    content = f.read()

# Imports
imports = """import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, Skeleton, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardLayout from '../layouts/DashboardLayout';"""
content = re.sub(r"import \{ useState.*?import DashboardLayout from '\.\./layouts/DashboardLayout';", imports, content, flags=re.DOTALL)


# Card styles
card_block = """                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: 'rgba(15, 15, 25, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      borderRadius: 4,
                      padding: '1px',
                      background: idx % 2 === 0 ? 'linear-gradient(135deg, rgba(185,102,254,0.5), rgba(255,255,255,0))' : 'linear-gradient(135deg, rgba(0,229,255,0.5), rgba(255,255,255,0))',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      pointerEvents: 'none'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: idx % 2 === 0 ? 'rgba(185,102,254,0.5)' : 'rgba(0,229,255,0.5)',
                      boxShadow: idx % 2 === 0 
                        ? '0 20px 40px -10px rgba(185,102,254,0.4), 0 0 20px rgba(185,102,254,0.2) inset' 
                        : '0 20px 40px -10px rgba(0,229,255,0.4), 0 0 20px rgba(0,229,255,0.2) inset'
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 160,
                          background: idx % 2 === 0 
                            ? 'linear-gradient(135deg, #4a148c 0%, #b966fe 100%)' 
                            : 'linear-gradient(135deg, #006064 0%, #00e5ff 100%)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%', left: '-50%', width: '200%', height: '200%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          },
                          '.MuiCard-root:hover &::before': { opacity: 1 },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(15,15,25,1) 100%)'
                          }
                        }}
                      >
                        <Box sx={{
                          position: 'absolute',
                          top: '40%', left: '50%',
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.2,
                          zIndex: 1
                        }}>
                          {idx % 3 === 0 ? <AutoAwesomeIcon sx={{ fontSize: 80 }}/> : <MenuBookIcon sx={{ fontSize: 80 }}/>}
                        </Box>
                      </CardMedia>
                      <Chip 
                        label={idx % 2 === 0 ? "Phổ biến" : "Mới nhất"}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16, right: 16,
                          fontWeight: 800,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          backdropFilter: 'blur(4px)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3, pt: 1, position: 'relative', zIndex: 2 }}>
                      <Typography gutterBottom variant="h5" component="h2" color="text.primary" sx={{ fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {course.title}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" sx={{ lineBreak: 'anywhere', mb: 2, minHeight: 40, lineHeight: 1.6 }}>
                        {course.description}
                      </Typography>
                      <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                        {(resourcesByCourse[course.id] || []).slice(0, 2).map((resource) => (
                          <Box
                            key={resource.id}
                            component="a"
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              color: 'text.secondary',
                              textDecoration: 'none',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              borderRadius: 2,
                              px: 1.5,
                              py: 1,
                              transition: 'all 0.2s',
                              '&:hover': { 
                                color: 'primary.light', 
                                borderColor: 'rgba(185,102,254,0.3)',
                                background: 'rgba(185,102,254,0.05)',
                                transform: 'translateX(4px)'
                              },
                            }}
                          >
                            <LinkIcon fontSize="small" sx={{ opacity: 0.7 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {resource.title}
                            </Typography>
                            <Chip size="small" label={resource.type} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: 'rgba(255,255,255,0.1)' }} />
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                    <Box sx={{ p: 3, pt: 0, zIndex: 2 }}>
                      <Stack direction="row" spacing={2}>
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          onClick={() => navigate(`/courses/${course.id}`)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            borderColor: 'rgba(255,255,255,0.2)',
                            color: 'text.primary',
                            '&:hover': {
                              borderColor: '#fff',
                              bgcolor: 'rgba(255,255,255,0.05)'
                            }
                          }}
                        >
                          Chi tiết
                        </Button>
                        <Button 
                          variant="contained" 
                          fullWidth 
                          onClick={() => navigate(`/study/${course.id}`)}
                          endIcon={<PlayArrowIcon />}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 800,
                            background: idx % 2 === 0 
                              ? 'linear-gradient(45deg, #852ed0, #b966fe)' 
                              : 'linear-gradient(45deg, #00b1cb, #00e5ff)',
                            color: idx % 2 === 0 ? '#fff' : '#000',
                            boxShadow: idx % 2 === 0 
                              ? '0 4px 14px 0 rgba(185,102,254,0.39)' 
                              : '0 4px 14px 0 rgba(0,229,255,0.39)',
                            '&:hover': {
                              background: idx % 2 === 0 
                                ? 'linear-gradient(45deg, #9a33f0, #c47cff)' 
                                : 'linear-gradient(45deg, #00c6e0, #33ebff)',
                              boxShadow: idx % 2 === 0 
                                ? '0 6px 20px rgba(185,102,254,0.5)' 
                                : '0 6px 20px rgba(0,229,255,0.5)',
                            }
                          }}
                        >
                          Học ngay
                        </Button>
                      </Stack>
                    </Box>
                  </Card>"""
content = re.sub(r"                  <Card sx=\{\{ \n                    height: '100%'.*?                  </Card>", card_block, content, flags=re.DOTALL)


with open('frontend/src/pages/Courses.tsx', 'w') as f:
    f.write(content)

