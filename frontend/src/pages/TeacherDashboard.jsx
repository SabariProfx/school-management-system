import { useEffect, useState } from 'react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ClassManagement from '../components/ClassManagement';
import TimetableManagement from '../components/TimetableManagement';
import ClassForum from '../components/ClassForum';
import AnnouncementsHub from '../components/AnnouncementsHub';
import SmartSubstitution from '../components/SmartSubstitution';
import {
    Box, Typography, Button, CssBaseline, ThemeProvider,
    AppBar, Toolbar, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Grid, Paper, IconButton, useMediaQuery, useTheme as useMuiTheme, Select, MenuItem,
    FormControl, Chip, Divider
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const drawerWidth = 280;

// Role Switching Component
const RoleSwitcher = ({ currentRole, onRoleChange, teacherData }) => (
    <Box sx={{ 
        p: 2, 
        background: 'rgba(255, 255, 255, 0.05)', 
        m: 2, 
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SwitchAccountIcon sx={{ fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Teaching Role
            </Typography>
        </Box>
        <FormControl fullWidth size="small">
            <Select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value)}
                sx={{
                    '& .MuiSelect-select': {
                        py: 1,
                        fontSize: '0.9rem'
                    }
                }}
            >
                <MenuItem value="subject">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookIcon sx={{ fontSize: 18 }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Subject Teacher
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Mathematics
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <MenuItem value="class">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SupervisorAccountIcon sx={{ fontSize: 18 }} />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Class Teacher
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Class 10-A
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    </Box>
);

// StatCard Component
const StatCard = ({ title, value, icon, color, subtitle, onClick }) => (
    <Paper
        onClick={onClick}
        sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            height: '160px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                '& .stat-icon': {
                    transform: 'scale(1.15) rotate(3deg)',
                    filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3))'
                }
            }
        }}
    >
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 1.5,
            color: color,
            transition: 'all 0.3s ease'
        }} className="stat-icon">
            {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </Box>
        <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 0.5,
            background: `linear-gradient(135deg, ${color}, #fff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            {value}
        </Typography>
        <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 0.5,
            fontSize: '1rem'
        }}>
            {title}
        </Typography>
        {subtitle && (
            <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                fontSize: '0.8rem'
            }}>
                {subtitle}
            </Typography>
        )}
    </Paper>
);

function TeacherDashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [currentTeachingRole, setCurrentTeachingRole] = useState('subject'); // 'subject' or 'class'
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'class_management'
    const [mobileOpen, setMobileOpen] = useState(false);
    const muiTheme = useMuiTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleRoleChange = (newRole) => {
        setCurrentTeachingRole(newRole);
        setCurrentView('dashboard'); // Reset to dashboard when switching roles
        toast.success(`Switched to ${newRole === 'subject' ? 'Subject Teacher' : 'Class Teacher'} mode`);
    };

    const handleNavigationClick = (view) => {
        setCurrentView(view);
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'class_management':
                return <ClassManagement currentRole={currentTeachingRole} />;
            case 'timetable':
                return <TimetableManagement />;
            case 'forum':
                return <ClassForum />;
            case 'announcements':
                return <AnnouncementsHub />;
            case 'substitution':
                return <SmartSubstitution />;
            case 'dashboard':
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => (
        <>
            {/* Welcome Section */}
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
                    {currentTeachingRole === 'subject' 
                        ? 'Ready to inspire young minds in Mathematics?' 
                        : 'Ready to guide your Class 10-A students?'
                    }
                </Typography>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ 
                mb: 4,
                background: 'rgba(255, 255, 255, 0.02)', 
                borderRadius: '20px', 
                p: 4,
                border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
                <Typography variant="h5" sx={{ 
                    mb: 3, 
                    fontWeight: 'bold',
                    textAlign: 'left'
                }}>
                    {currentTeachingRole === 'subject' ? 'Subject Teaching Overview' : 'Class Management Overview'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {getStatsData().map((stat, index) => (
                        <Box key={index} sx={{ flex: 1 }}>
                            <StatCard {...stat} />
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Today's Schedule */}
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
                        <ScheduleIcon />
                        {currentTeachingRole === 'subject' ? 'My Teaching Schedule' : 'Class 10-A Schedule'}
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
                        {currentTeachingRole === 'subject' ? 'Start Teaching' : 'Manage Timetable'}
                    </Button>
                </Box>
                
                <Typography variant="h4" sx={{ 
                    color: 'text.secondary',
                    fontStyle: 'italic',
                    py: 4
                }}>
                    {currentTeachingRole === 'subject' 
                        ? 'Subject-specific schedule and class management coming soon...'
                        : 'Complete class timetable management coming soon...'
                    }
                </Typography>
            </Box>
        </>
    );

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.role !== 'teacher') {
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

    // Dynamic navigation based on current role
    const getNavigationItems = () => {
        const baseItems = [
            { icon: <DashboardIcon fontSize="small" />, text: 'Dashboard', view: 'dashboard', active: currentView === 'dashboard' },
            { icon: <AssessmentIcon fontSize="small" />, text: 'Attendance', view: 'attendance' },
            { icon: <ForumIcon fontSize="small" />, text: 'Class Forum', view: 'forum', active: currentView === 'forum' },
            { icon: <CampaignIcon fontSize="small" />, text: 'Announcements', view: 'announcements', active: currentView === 'announcements' },
        ];

        if (currentTeachingRole === 'subject') {
            return [
                ...baseItems,
                { icon: <SwapHorizIcon fontSize="small" />, text: 'Smart Substitution', view: 'substitution', active: currentView === 'substitution' },
                { icon: <AssignmentIcon fontSize="small" />, text: 'My Assignments', view: 'assignments' },
                { icon: <BookIcon fontSize="small" />, text: 'Subject Materials', view: 'materials' },
                { icon: <ScheduleIcon fontSize="small" />, text: 'My Schedule', view: 'timetable', active: currentView === 'timetable' },
                { icon: <SettingsIcon fontSize="small" />, text: 'Settings', view: 'settings' }
            ];
        } else {
            return [
                ...baseItems,
                { icon: <GroupIcon fontSize="small" />, text: 'Manage My Class', view: 'class_management', active: currentView === 'class_management' },
                { icon: <SwapHorizIcon fontSize="small" />, text: 'Smart Substitution', view: 'substitution', active: currentView === 'substitution' },
                { icon: <CalendarTodayIcon fontSize="small" />, text: 'Class Timetable', view: 'timetable', active: currentView === 'timetable' },
                { icon: <FolderIcon fontSize="small" />, text: 'Class Materials', view: 'materials' },
                { icon: <SettingsIcon fontSize="small" />, text: 'Settings', view: 'settings' }
            ];
        }
    };

    // Dynamic stats based on current role
    const getStatsData = () => {
        if (currentTeachingRole === 'subject') {
            return [
                {
                    title: 'Classes Teaching',
                    value: '4',
                    subtitle: '9A, 9B, 10A, 10B',
                    icon: <ClassIcon sx={{ fontSize: 40 }} />,
                    color: '#10b981'
                },
                {
                    title: 'Assignments Due',
                    value: '8',
                    subtitle: 'To be graded',
                    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
                    color: '#f59e0b'
                },
                {
                    title: 'Today\'s Classes',
                    value: '6',
                    subtitle: 'Next: 10A at 10:30 AM',
                    icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
                    color: '#3b82f6'
                },
                {
                    title: 'Questions',
                    value: '5',
                    subtitle: 'From students',
                    icon: <MessageIcon sx={{ fontSize: 40 }} />,
                    color: '#8b5cf6'
                }
            ];
        } else {
            return [
                {
                    title: 'Class Students',
                    value: '25',
                    subtitle: 'Class 10-A',
                    icon: <GroupIcon sx={{ fontSize: 40 }} />,
                    color: '#10b981'
                },
                {
                    title: 'Avg Attendance',
                    value: '92%',
                    subtitle: 'This month',
                    icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
                    color: '#3b82f6'
                },
                {
                    title: 'Pending Issues',
                    value: '3',
                    subtitle: 'Require attention',
                    icon: <WarningIcon sx={{ fontSize: 40 }} />,
                    color: '#f59e0b'
                },
                {
                    title: 'Announcements',
                    value: '12',
                    subtitle: 'This week',
                    icon: <CampaignIcon sx={{ fontSize: 40 }} />,
                    color: '#8b5cf6'
                }
            ];
        }
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
                        <Chip 
                            icon={currentTeachingRole === 'subject' ? <BookIcon /> : <SupervisorAccountIcon />}
                            label={currentTeachingRole === 'subject' ? 'Subject Teacher' : 'Class Teacher'}
                            size="small"
                            sx={{ 
                                mr: 2,
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}
                        />
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
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{userName || 'Teacher'}</Typography>
                        <Typography variant="body2">Mathematics Department</Typography>
                    </Box>

                    <RoleSwitcher 
                        currentRole={currentTeachingRole}
                        onRoleChange={handleRoleChange}
                        teacherData={{ subject: 'Mathematics', class: '10-A' }}
                    />

                    <Divider sx={{ mx: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                    
                    <List sx={{ px: 1, mt: 1 }}>
                        {getNavigationItems().map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton 
                                    sx={{ 
                                        borderRadius: 1, 
                                        my: 0.5, 
                                        bgcolor: item.active ? 'action.selected' : 'transparent'
                                    }}
                                    onClick={() => item.view && handleNavigationClick(item.view)}
                                >
                                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
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
                        maxWidth: { xs: '95%', sm: '700px', md: '800px', lg: '1000px' },
                        textAlign: 'center',
                        px: 3,
                        py: 3,
                        minHeight: 'fit-content'
                    }}>
                        {renderCurrentView()}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default TeacherDashboard;