import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Chip, IconButton, Card, CardContent, CardActions, Tab, Tabs,
    FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
    List, ListItem, ListItemText, ListItemSecondaryAction, Avatar, Divider,
    Alert, Badge, Tooltip, Stack, Fab
} from '@mui/material';
import toast from 'react-hot-toast';

// Icons
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import PublishIcon from '@mui/icons-material/Publish';
import DraftIcon from '@mui/icons-material/Drafts';
import ArchiveIcon from '@mui/icons-material/Archive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Mock data for announcements
const mockAnnouncements = [
    {
        id: 1,
        title: 'Midterm Examination Schedule Released',
        content: 'The midterm examination schedule for all classes has been finalized. Students are advised to check their individual timetables and prepare accordingly. The examination will begin on November 15th and conclude on November 22nd.',
        priority: 'high',
        category: 'academic',
        status: 'published',
        audience: 'all_students',
        author: 'Dr. Sarah Johnson',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        scheduledFor: null,
        tags: ['examination', 'schedule', 'important'],
        attachments: ['exam_schedule.pdf'],
        views: 156,
        isUrgent: true
    },
    {
        id: 2,
        title: 'Science Fair Registration Open',
        content: 'Registration for the annual science fair is now open! Students from all grades are encouraged to participate. Showcase your innovative projects and compete for exciting prizes. Registration deadline: November 10th.',
        priority: 'medium',
        category: 'events',
        status: 'published',
        audience: 'all_students',
        author: 'Prof. Michael Chen',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        scheduledFor: null,
        tags: ['science', 'competition', 'registration'],
        attachments: [],
        views: 89,
        isUrgent: false
    },
    {
        id: 3,
        title: 'Library Hours Extended',
        content: 'Due to the upcoming examinations, the school library will extend its operating hours. New timings: Monday-Friday: 7:00 AM - 8:00 PM, Saturday: 8:00 AM - 6:00 PM, Sunday: 9:00 AM - 5:00 PM.',
        priority: 'low',
        category: 'facilities',
        status: 'draft',
        audience: 'all_students',
        author: 'Ms. Emily Davis',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        publishedAt: null,
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000),
        tags: ['library', 'hours', 'facilities'],
        attachments: [],
        views: 0,
        isUrgent: false
    }
];

const AnnouncementsHub = () => {
    const [announcements, setAnnouncements] = useState(mockAnnouncements);
    const [currentTab, setCurrentTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        content: '',
        priority: 'medium',
        category: 'general',
        audience: 'all_students',
        tags: '',
        isUrgent: false,
        schedulePublish: false,
        scheduledFor: ''
    });

    const tabLabels = ['All Announcements', 'Published', 'Drafts', 'Scheduled'];

    const priorityColors = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981'
    };

    const categoryIcons = {
        academic: <SchoolIcon />,
        events: <CalendarTodayIcon />,
        facilities: <InfoIcon />,
        general: <CampaignIcon />
    };

    const statusIcons = {
        published: <PublishIcon />,
        draft: <DraftIcon />,
        scheduled: <ScheduleIcon />
    };

    const handleOpenDialog = (announcement = null) => {
        if (announcement) {
            setSelectedAnnouncement(announcement);
            setAnnouncementForm({
                title: announcement.title,
                content: announcement.content,
                priority: announcement.priority,
                category: announcement.category,
                audience: announcement.audience,
                tags: announcement.tags.join(', '),
                isUrgent: announcement.isUrgent,
                schedulePublish: !!announcement.scheduledFor,
                scheduledFor: announcement.scheduledFor ? announcement.scheduledFor.toISOString().slice(0, 16) : ''
            });
            setIsEditing(true);
        } else {
            setSelectedAnnouncement(null);
            setAnnouncementForm({
                title: '',
                content: '',
                priority: 'medium',
                category: 'general',
                audience: 'all_students',
                tags: '',
                isUrgent: false,
                schedulePublish: false,
                scheduledFor: ''
            });
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAnnouncement(null);
        setIsEditing(false);
    };

    const handleSaveAnnouncement = (publish = false) => {
        const newAnnouncement = {
            id: isEditing ? selectedAnnouncement.id : Date.now(),
            title: announcementForm.title,
            content: announcementForm.content,
            priority: announcementForm.priority,
            category: announcementForm.category,
            audience: announcementForm.audience,
            tags: announcementForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            isUrgent: announcementForm.isUrgent,
            author: 'Dr. Sarah Johnson', // Would come from auth context
            createdAt: isEditing ? selectedAnnouncement.createdAt : new Date(),
            publishedAt: publish ? new Date() : null,
            scheduledFor: announcementForm.schedulePublish ? new Date(announcementForm.scheduledFor) : null,
            status: publish ? 'published' : (announcementForm.schedulePublish ? 'scheduled' : 'draft'),
            attachments: [],
            views: isEditing ? selectedAnnouncement.views : 0
        };

        if (isEditing) {
            setAnnouncements(announcements.map(ann => 
                ann.id === selectedAnnouncement.id ? newAnnouncement : ann
            ));
            toast.success('Announcement updated successfully!');
        } else {
            setAnnouncements([newAnnouncement, ...announcements]);
            toast.success(`Announcement ${publish ? 'published' : 'saved as draft'} successfully!`);
        }

        handleCloseDialog();
    };

    const handleDeleteAnnouncement = (id) => {
        setAnnouncements(announcements.filter(ann => ann.id !== id));
        toast.success('Announcement deleted successfully!');
    };

    const handlePublishAnnouncement = (id) => {
        setAnnouncements(announcements.map(ann => 
            ann.id === id 
                ? { ...ann, status: 'published', publishedAt: new Date() }
                : ann
        ));
        toast.success('Announcement published successfully!');
    };

    const getFilteredAnnouncements = () => {
        switch (currentTab) {
            case 1:
                return announcements.filter(ann => ann.status === 'published');
            case 2:
                return announcements.filter(ann => ann.status === 'draft');
            case 3:
                return announcements.filter(ann => ann.status === 'scheduled');
            default:
                return announcements;
        }
    };

    const getAnnouncementStats = () => {
        return {
            total: announcements.length,
            published: announcements.filter(ann => ann.status === 'published').length,
            drafts: announcements.filter(ann => ann.status === 'draft').length,
            scheduled: announcements.filter(ann => ann.status === 'scheduled').length,
            urgent: announcements.filter(ann => ann.isUrgent && ann.status === 'published').length
        };
    };

    const stats = getAnnouncementStats();

    const AnnouncementCard = ({ announcement }) => (
        <Card sx={{ 
            mb: 2,
            background: announcement.isUrgent && announcement.status === 'published'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
                : 'rgba(255, 255, 255, 0.05)',
            border: announcement.isUrgent && announcement.status === 'published'
                ? '1px solid rgba(239, 68, 68, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
        }}>
            {announcement.isUrgent && announcement.status === 'published' && (
                <Chip
                    icon={<PriorityHighIcon />}
                    label="URGENT"
                    color="error"
                    size="small"
                    sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontWeight: 'bold'
                    }}
                />
            )}
            
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar sx={{ 
                        bgcolor: priorityColors[announcement.priority],
                        width: 40,
                        height: 40
                    }}>
                        {categoryIcons[announcement.category]}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            pr: announcement.isUrgent ? 8 : 0
                        }}>
                            {announcement.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip 
                                icon={statusIcons[announcement.status]}
                                label={announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                                size="small"
                                color={announcement.status === 'published' ? 'success' : 'default'}
                                variant={announcement.status === 'published' ? 'filled' : 'outlined'}
                            />
                            <Chip 
                                label={announcement.category}
                                size="small"
                                variant="outlined"
                            />
                            <Chip 
                                label={announcement.priority}
                                size="small"
                                sx={{ 
                                    color: priorityColors[announcement.priority],
                                    borderColor: priorityColors[announcement.priority]
                                }}
                                variant="outlined"
                            />
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            By {announcement.author} • {announcement.createdAt.toLocaleDateString()}
                            {announcement.status === 'published' && ` • ${announcement.views} views`}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {announcement.content.length > 150 
                                ? `${announcement.content.substring(0, 150)}...` 
                                : announcement.content
                            }
                        </Typography>
                        
                        {announcement.tags.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                {announcement.tags.map((tag, index) => (
                                    <Chip 
                                        key={index}
                                        label={tag}
                                        size="small"
                                        variant="outlined"
                                        sx={{ mr: 0.5, fontSize: '0.7rem' }}
                                    />
                                ))}
                            </Box>
                        )}
                        
                        {announcement.scheduledFor && announcement.status === 'scheduled' && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ScheduleIcon sx={{ fontSize: 16 }} />
                                    Scheduled for: {announcement.scheduledFor.toLocaleString()}
                                </Box>
                            </Alert>
                        )}
                    </Box>
                </Box>
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenDialog(announcement)}
                    >
                        View
                    </Button>
                    <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenDialog(announcement)}
                    >
                        Edit
                    </Button>
                    <Button 
                        size="small" 
                        startIcon={<DeleteIcon />}
                        color="error"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                        Delete
                    </Button>
                </Box>
                
                {announcement.status === 'draft' && (
                    <Button 
                        variant="contained"
                        size="small"
                        startIcon={<PublishIcon />}
                        onClick={() => handlePublishAnnouncement(announcement.id)}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669, #047857)'
                            }
                        }}
                    >
                        Publish
                    </Button>
                )}
            </CardActions>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4 
            }}>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                    }}>
                        <CampaignIcon />
                        Announcements Hub
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Create, manage, and distribute announcements to students and staff
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #059669, #047857)'
                        }
                    }}
                >
                    New Announcement
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <Paper
                        onClick={() => setCurrentTab(0)}
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: '120px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)',
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08))',
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
                            mb: 1,
                            color: '#3b82f6',
                            transition: 'all 0.3s ease'
                        }} className="stat-icon">
                            <CampaignIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {stats.total}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.9rem'
                        }}>
                            Total
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <Paper
                        onClick={() => setCurrentTab(1)}
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: '120px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)',
                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))',
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
                            mb: 1,
                            color: '#10b981',
                            transition: 'all 0.3s ease'
                        }} className="stat-icon">
                            <PublishIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {stats.published}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.9rem'
                        }}>
                            Published
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <Paper
                        onClick={() => setCurrentTab(2)}
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(156, 163, 175, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(156, 163, 175, 0.2)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: '120px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 12px 40px rgba(156, 163, 175, 0.4)',
                                background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15), rgba(156, 163, 175, 0.08))',
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
                            mb: 1,
                            color: '#9ca3af',
                            transition: 'all 0.3s ease'
                        }} className="stat-icon">
                            <DraftIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {stats.drafts}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.9rem'
                        }}>
                            Drafts
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <Paper
                        onClick={() => setCurrentTab(3)}
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: '120px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
                                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.08))',
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
                            mb: 1,
                            color: '#8b5cf6',
                            transition: 'all 0.3s ease'
                        }} className="stat-icon">
                            <ScheduleIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {stats.scheduled}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.9rem'
                        }}>
                            Scheduled
                        </Typography>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <Paper
                        onClick={() => {
                            // Filter to urgent announcements
                            setCurrentTab(0);
                        }}
                        sx={{
                            p: 2.5,
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            height: '120px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                transform: 'translateY(-6px)',
                                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))',
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
                            mb: 1,
                            color: '#ef4444',
                            transition: 'all 0.3s ease'
                        }} className="stat-icon">
                            <PriorityHighIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 'bold', 
                            mb: 0.5,
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {stats.urgent}
                        </Typography>
                        <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.9rem'
                        }}>
                            Urgent
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Tabs */}
            <Paper sx={{ 
                mb: 3,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Tabs 
                    value={currentTab} 
                    onChange={(e, newValue) => setCurrentTab(newValue)}
                    variant="fullWidth"
                >
                    {tabLabels.map((label, index) => (
                        <Tab 
                            key={index} 
                            label={label}
                            sx={{ 
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Announcements List */}
            <Box>
                {getFilteredAnnouncements().length === 0 ? (
                    <Paper sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <CampaignIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                            No announcements found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Create your first announcement to get started!
                        </Typography>
                    </Paper>
                ) : (
                    getFilteredAnnouncements().map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                    ))
                )}
            </Box>

            {/* Create/Edit Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.90))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        minHeight: '600px'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CampaignIcon color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        {isEditing 
                            ? 'Update your announcement details and settings' 
                            : 'Create and broadcast important information to your audience'
                        }
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ 
                    p: 3, 
                    maxHeight: '70vh', 
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.5)',
                        },
                    },
                }}>
                    <Grid container spacing={4} sx={{ mt: 1 }}>
                        {/* Main Content Section */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                📝 Content Details
                            </Typography>
                            
                            <TextField
                                fullWidth
                                label="Announcement Title"
                                value={announcementForm.title}
                                onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                                required
                                sx={{ 
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        fontSize: '1.1rem',
                                        '&:hover': {
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                        },
                                        '&.Mui-focused': {
                                            border: '2px solid rgba(245, 158, 11, 0.5)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    }
                                }}
                                placeholder="Enter a clear and descriptive title for your announcement"
                            />
                            
                            <TextField
                                fullWidth
                                label="Content"
                                multiline
                                rows={8}
                                value={announcementForm.content}
                                onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                        },
                                        '&.Mui-focused': {
                                            border: '2px solid rgba(245, 158, 11, 0.5)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        lineHeight: 1.8
                                    }
                                }}
                                placeholder="Write your announcement content here. Be clear, concise, and include all necessary details..."
                            />
                            
                            <TextField
                                fullWidth
                                label="Tags (comma separated)"
                                value={announcementForm.tags}
                                onChange={(e) => setAnnouncementForm({...announcementForm, tags: e.target.value})}
                                placeholder="exam, important, deadline, event"
                                sx={{ 
                                    mt: 3,
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                    }
                                }}
                            />
                        </Grid>
                        
                        {/* Settings Section */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                ⚙️ Settings & Options
                            </Typography>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Priority Level</InputLabel>
                                <Select
                                    value={announcementForm.priority}
                                    label="Priority Level"
                                    onChange={(e) => setAnnouncementForm({...announcementForm, priority: e.target.value})}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            py: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }
                                    }}
                                >
                                    <MenuItem value="low">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <InfoIcon sx={{ color: '#6b7280' }} />
                                            <Box>
                                                <Typography variant="body1">Low Priority</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    General information
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="medium">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <WarningIcon sx={{ color: '#f59e0b' }} />
                                            <Box>
                                                <Typography variant="body1">Medium Priority</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    Important notice
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="high">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ErrorIcon sx={{ color: '#ef4444' }} />
                                            <Box>
                                                <Typography variant="body1">High Priority</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    Urgent announcement
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={announcementForm.category}
                                    label="Category"
                                    onChange={(e) => setAnnouncementForm({...announcementForm, category: e.target.value})}
                                >
                                    <MenuItem value="general">📢 General</MenuItem>
                                    <MenuItem value="academic">📚 Academic</MenuItem>
                                    <MenuItem value="events">🎉 Events</MenuItem>
                                    <MenuItem value="facilities">🏢 Facilities</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Target Audience</InputLabel>
                                <Select
                                    value={announcementForm.audience}
                                    label="Target Audience"
                                    onChange={(e) => setAnnouncementForm({...announcementForm, audience: e.target.value})}
                                >
                                    <MenuItem value="all_students">👥 All Students</MenuItem>
                                    <MenuItem value="class_10a">🎓 Class 10-A</MenuItem>
                                    <MenuItem value="class_10b">🎓 Class 10-B</MenuItem>
                                    <MenuItem value="teachers">👨‍🏫 Teachers</MenuItem>
                                    <MenuItem value="parents">👨‍👩‍👧‍👦 Parents</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <Box sx={{ p: 3, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', mb: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={announcementForm.isUrgent}
                                            onChange={(e) => setAnnouncementForm({...announcementForm, isUrgent: e.target.checked})}
                                            color="warning"
                                        />
                                    }
                                    label="⚠️ Mark as Urgent"
                                    sx={{ mb: 2 }}
                                />
                                
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={announcementForm.schedulePublish}
                                            onChange={(e) => setAnnouncementForm({...announcementForm, schedulePublish: e.target.checked})}
                                            color="primary"
                                        />
                                    }
                                    label="📅 Schedule for later"
                                />
                            </Box>
                            
                            {announcementForm.schedulePublish && (
                                <TextField
                                    fullWidth
                                    label="Schedule Date & Time"
                                    type="datetime-local"
                                    value={announcementForm.scheduledFor}
                                    onChange={(e) => setAnnouncementForm({...announcementForm, scheduledFor: e.target.value})}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                        }
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                    
                    {/* Tips Section */}
                    <Box sx={{ mt: 4, p: 3, background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#3b82f6', fontWeight: 600 }}>
                            💡 Best Practices for Announcements
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                            • Use clear, descriptive titles that summarize the main message<br/>
                            • Include all necessary details: dates, times, locations, requirements<br/>
                            • Choose appropriate priority levels to avoid notification fatigue<br/>
                            • Use tags to help students find related announcements later<br/>
                            • Preview your announcement before publishing to check for errors
                        </Typography>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap'
                }}>
                    <Button 
                        onClick={handleCloseDialog}
                        variant="outlined"
                        size="large"
                        sx={{ 
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'text.secondary',
                            '&:hover': {
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                background: 'rgba(255, 255, 255, 0.05)'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="outlined"
                        size="large"
                        onClick={() => handleSaveAnnouncement(false)}
                        disabled={!announcementForm.title || !announcementForm.content}
                        startIcon={<DraftIcon />}
                        sx={{ 
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            borderColor: 'rgba(156, 163, 175, 0.3)',
                            color: '#9ca3af',
                            '&:hover': {
                                borderColor: 'rgba(156, 163, 175, 0.5)',
                                background: 'rgba(156, 163, 175, 0.1)'
                            }
                        }}
                    >
                        Save Draft
                    </Button>
                    <Button 
                        variant="contained"
                        size="large"
                        onClick={() => handleSaveAnnouncement(true)}
                        disabled={!announcementForm.title || !announcementForm.content}
                        startIcon={announcementForm.schedulePublish ? <ScheduleIcon /> : <PublishIcon />}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #d97706, #b45309)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(245, 158, 11, 0.4)'
                            },
                            '&:disabled': {
                                opacity: 0.5,
                                transform: 'none',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {announcementForm.schedulePublish ? 'Schedule Announcement' : 'Publish Now'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AnnouncementsHub;
