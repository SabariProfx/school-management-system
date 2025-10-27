import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, CssBaseline, ThemeProvider,
    AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Grid, Paper, IconButton, useMediaQuery, useTheme as useMuiTheme
} from '@mui/material';
import { theme } from '../theme';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

// Import Icons
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ForumIcon from '@mui/icons-material/Forum';
import CampaignIcon from '@mui/icons-material/Campaign';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MessageIcon from '@mui/icons-material/Message';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const drawerWidth = 280;

// StatCard Component
const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Paper
        sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.4)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                '& .stat-icon': {
                    transform: 'scale(1.2) rotate(5deg)',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                }
            }
        }}
    >
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 2,
            color: color,
            transition: 'all 0.3s ease'
        }} className="stat-icon">
            {icon}
        </Box>
        <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            background: `linear-gradient(135deg, ${color}, #fff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            {value}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
        </Typography>
        {subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {subtitle}
            </Typography>
        )}
    </Paper>
);

function StudentDashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== 'student') {
                    toast.error("Access denied.");
                    navigate('/login');
                    return;
                }
                setUserRole(decodedToken.role);
                setUserName(decodedToken.sub);
            } catch (error) {
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    if (userRole === null) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ backgroundColor: '#1E1E1E', minHeight: '100vh' }} />
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
                <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'background.paper', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton color="inherit" sx={{ ml: 1 }}>
                            <AccountCircleIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant={isMobile ? "temporary" : "permanent"} open={isMobile ? mobileOpen : true} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'background.paper', borderRight: '1px solid rgba(255, 255, 255, 0.12)', color: theme.palette.text.secondary } }}>
                    <Toolbar sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                        <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                            Classmate<Box component="span" sx={{ fontWeight: 300, color: 'primary.main' }}>+</Box>
                        </Typography>
                    </Toolbar>
                    <Box sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)', m: 2, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{userName || 'Student'}</Typography>
                        <Typography variant="body2">Class 10-A</Typography>
                    </Box>
                    <List sx={{ px: 1 }}>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, my: 0.5, bgcolor: 'action.selected' }}>
                                <ListItemIcon sx={{ minWidth: 40 }}><CalendarTodayIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, my: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}><AssessmentIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Attendance" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, my: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}><ForumIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Class Forum" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, my: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}><CampaignIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Announcements" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, my: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}><FolderIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Materials" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ borderRadius: 1, my: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon fontSize="small" /></ListItemIcon>
                                <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Box sx={{ mt: 'auto', p: 2 }}>
                        <Button fullWidth variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
                    </Box>
                </Drawer>
                <Box component="main" sx={{ 
                    position: 'fixed',
                    top: ['56px', '64px'],
                    left: { xs: 0, sm: `${drawerWidth}px` },
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    overflow: 'auto',
                    pt: 2
                }}>
                    <Box sx={{ 
                        width: '100%',
                        maxWidth: { xs: '95%', sm: '700px', md: '800px', lg: '900px' },
                        textAlign: 'center',
                        px: 3,
                        py: 3,
                        minHeight: 'fit-content'
                    }}>
                        <Box sx={{ 
                            mb: 4, 
                            background: 'linear-gradient(135deg, rgba(45, 45, 45, 0.95), rgba(45, 45, 45, 0.85))', 
                            borderRadius: '20px', 
                            p: 4,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}>
                            <Typography variant="h3" sx={{ 
                                mb: 2, 
                                fontWeight: 'bold', 
                                background: 'linear-gradient(135deg, #fff, #ccc)', 
                                WebkitBackgroundClip: 'text', 
                                WebkitTextFillColor: 'transparent' 
                            }}>
                                Welcome back, {userName}!
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 0 }}>
                                Ready to continue your learning journey?
                            </Typography>
                        </Box>
                        
                        {/* Quick Stats */}
                        <Box sx={{ mb: 4, width: '100%', overflow: 'visible' }}>
                            <Typography variant="h5" sx={{ 
                                mb: 3, 
                                fontWeight: 'bold',
                                textAlign: 'left'
                            }}>
                                Quick Stats
                            </Typography>
                            <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
                                <Grid item xs={12} sm={6} lg={3} sx={{ paddingLeft: 0 }}>
                                    <StatCard
                                        title="Attendance"
                                        value="94.5%"
                                        subtitle="This month"
                                        icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
                                        color="#10b981"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Assignments Due"
                                        value="3"
                                        subtitle="This week"
                                        icon={<WarningIcon sx={{ fontSize: 40 }} />}
                                        color="#f59e0b"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Classes Today"
                                        value="6"
                                        subtitle="Next: Math at 10:30 AM"
                                        icon={<ScheduleIcon sx={{ fontSize: 40 }} />}
                                        color="#3b82f6"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
                                    <StatCard
                                        title="Messages"
                                        value="12"
                                        subtitle="5 unread"
                                        icon={<MessageIcon sx={{ fontSize: 40 }} />}
                                        color="#8b5cf6"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Today's Timetable */}
                        <Box sx={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: '16px', 
                            p: { xs: 2, sm: 4 },
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between', 
                                alignItems: { xs: 'flex-start', sm: 'center' }, 
                                mb: 3,
                                gap: { xs: 2, sm: 0 }
                            }}>
                                <Typography variant="h5" sx={{ 
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <CalendarTodayIcon />
                                    Today's Schedule
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    startIcon={<ClassIcon />} 
                                    sx={{ 
                                        py: 1, 
                                        px: 2.5, 
                                        borderRadius: '10px', 
                                        background: 'linear-gradient(135deg, #10b981, #059669)', 
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Join Current Class
                                </Button>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[
                                    { time: '08:30 - 09:30', subject: 'Mathematics', teacher: 'Mr. Smith', room: 'Room 101', status: 'completed' },
                                    { time: '09:45 - 10:45', subject: 'Physics', teacher: 'Dr. Johnson', room: 'Lab 2', status: 'completed' },
                                    { time: '11:00 - 12:00', subject: 'Chemistry', teacher: 'Ms. Davis', room: 'Lab 1', status: 'current' },
                                    { time: '13:30 - 14:30', subject: 'English', teacher: 'Mrs. Wilson', room: 'Room 205', status: 'upcoming' },
                                    { time: '14:45 - 15:45', subject: 'History', teacher: 'Mr. Brown', room: 'Room 103', status: 'upcoming' },
                                    { time: '16:00 - 17:00', subject: 'Computer Science', teacher: 'Dr. Taylor', room: 'Computer Lab', status: 'upcoming' }
                                ].map((classItem, index) => (
                                    <Paper key={index} sx={{
                                        p: { xs: 2, sm: 3 },
                                        background: classItem.status === 'current' 
                                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))'
                                            : classItem.status === 'completed'
                                            ? 'linear-gradient(135deg, rgba(107, 114, 128, 0.15), rgba(107, 114, 128, 0.08))'
                                            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))',
                                        border: classItem.status === 'current' 
                                            ? '2px solid rgba(16, 185, 129, 0.5)'
                                            : classItem.status === 'completed'
                                            ? '1px solid rgba(107, 114, 128, 0.3)'
                                            : '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: { xs: 'none', sm: 'translateX(8px)' },
                                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
                                        },
                                        '&::before': classItem.status === 'current' ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: '4px',
                                            background: 'linear-gradient(180deg, #10b981, #059669)',
                                            borderRadius: '0 2px 2px 0'
                                        } : {}
                                    }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            alignItems: { xs: 'flex-start', sm: 'center' }, 
                                            gap: { xs: 2, sm: 3 }
                                        }}>
                                            {/* Time Column */}
                                            <Box sx={{ 
                                                minWidth: { xs: '100%', sm: '140px' },
                                                textAlign: { xs: 'left', sm: 'center' },
                                                p: 1.5,
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255, 255, 255, 0.1)'
                                            }}>
                                                <Typography variant="body1" sx={{ 
                                                    fontWeight: 'bold',
                                                    fontSize: '0.95rem'
                                                }}>
                                                    {classItem.time}
                                                </Typography>
                                            </Box>

                                            {/* Subject & Teacher Info */}
                                            <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {classItem.subject}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    👨‍🏫 {classItem.teacher} • 📍 {classItem.room}
                                                </Typography>
                                            </Box>

                                            {/* Status Indicator */}
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                minWidth: { xs: '100%', sm: '120px' },
                                                justifyContent: { xs: 'flex-start', sm: 'center' },
                                                mt: { xs: 1, sm: 0 }
                                            }}>
                                                {classItem.status === 'completed' && (
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 0.5,
                                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(16, 185, 129, 0.3)'
                                                    }}>
                                                        <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                                        <Typography variant="caption" sx={{ 
                                                            color: '#10b981',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            Completed
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {classItem.status === 'current' && (
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 0.5,
                                                        bgcolor: 'rgba(16, 185, 129, 0.2)',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(16, 185, 129, 0.3)'
                                                    }}>
                                                        <Box sx={{ 
                                                            width: 6, 
                                                            height: 6, 
                                                            borderRadius: '50%', 
                                                            bgcolor: '#10b981',
                                                            animation: 'pulse 2s infinite'
                                                        }} />
                                                        <Typography variant="caption" sx={{ 
                                                            color: '#10b981',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            Live Now
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {classItem.status === 'upcoming' && (
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 0.5,
                                                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                                    }}>
                                                        <Typography variant="caption" sx={{ 
                                                            color: '#3b82f6',
                                                            fontWeight: 600,
                                                            textTransform: 'uppercase',
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            Upcoming
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default StudentDashboard;
