import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Select, MenuItem, FormControl, InputLabel, Chip, IconButton, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Card, CardContent, Fab, Divider, Switch, FormControlLabel
} from '@mui/material';
import toast from 'react-hot-toast';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ClassIcon from '@mui/icons-material/Class';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/Subject';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

// Mock data for subjects and teachers
const mockSubjects = [
    { id: 1, name: 'Mathematics', code: 'MATH' },
    { id: 2, name: 'Physics', code: 'PHY' },
    { id: 3, name: 'Chemistry', code: 'CHEM' },
    { id: 4, name: 'Biology', code: 'BIO' },
    { id: 5, name: 'English', code: 'ENG' },
    { id: 6, name: 'History', code: 'HIST' },
    { id: 7, name: 'Physical Education', code: 'PE' },
    { id: 8, name: 'Computer Science', code: 'CS' }
];

const mockTeachers = [
    { id: 1, name: 'Dr. Sarah Johnson', subjects: [1, 2] },
    { id: 2, name: 'Prof. Michael Chen', subjects: [3, 4] },
    { id: 3, name: 'Ms. Emily Davis', subjects: [5] },
    { id: 4, name: 'Mr. Robert Wilson', subjects: [6] },
    { id: 5, name: 'Coach Amanda Brown', subjects: [7] },
    { id: 6, name: 'Dr. David Kim', subjects: [8] }
];

const timeSlots = [
    { id: 1, start: '08:00', end: '08:45', label: '1st Period' },
    { id: 2, start: '08:45', end: '09:30', label: '2nd Period' },
    { id: 3, start: '09:30', end: '09:45', label: 'Break', isBreak: true },
    { id: 4, start: '09:45', end: '10:30', label: '3rd Period' },
    { id: 5, start: '10:30', end: '11:15', label: '4th Period' },
    { id: 6, start: '11:15', end: '12:00', label: '5th Period' },
    { id: 7, start: '12:00', end: '12:45', label: 'Lunch Break', isBreak: true },
    { id: 8, start: '12:45', end: '13:30', label: '6th Period' },
    { id: 9, start: '13:30', end: '14:15', label: '7th Period' },
    { id: 10, start: '14:15', end: '15:00', label: '8th Period' }
];

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimetableManagement = () => {
    const [timetable, setTimetable] = useState({});
    const [selectedClass, setSelectedClass] = useState('10-A');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null);
    const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'period'
    const [conflicts, setConflicts] = useState([]);
    
    const [scheduleForm, setScheduleForm] = useState({
        day: '',
        timeSlot: '',
        subject: '',
        teacher: '',
        room: '',
        notes: ''
    });

    // Initialize empty timetable
    useEffect(() => {
        const initTimetable = {};
        weekDays.forEach(day => {
            initTimetable[day] = {};
            timeSlots.forEach(slot => {
                if (!slot.isBreak) {
                    initTimetable[day][slot.id] = null;
                }
            });
        });
        setTimetable(initTimetable);
    }, []);

    // Check for conflicts
    const checkConflicts = (newSchedule) => {
        const teacherConflicts = [];
        const { day, timeSlot, teacher } = newSchedule;
        
        // Check if teacher is already assigned at this time
        Object.keys(timetable).forEach(d => {
            if (timetable[d][timeSlot] && timetable[d][timeSlot].teacher === teacher && d !== day) {
                teacherConflicts.push({
                    type: 'teacher',
                    message: `Teacher ${mockTeachers.find(t => t.id === parseInt(teacher))?.name} is already assigned on ${d} at this time`,
                    severity: 'error'
                });
            }
        });
        
        return teacherConflicts;
    };

    const handleOpenDialog = (day = '', timeSlotId = '') => {
        setCurrentSlot({ day, timeSlotId });
        const existing = timetable[day]?.[timeSlotId];
        
        setScheduleForm({
            day,
            timeSlot: timeSlotId,
            subject: existing?.subject || '',
            teacher: existing?.teacher || '',
            room: existing?.room || '',
            notes: existing?.notes || ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentSlot(null);
        setScheduleForm({
            day: '',
            timeSlot: '',
            subject: '',
            teacher: '',
            room: '',
            notes: ''
        });
        setConflicts([]);
    };

    const handleSaveSchedule = () => {
        const newConflicts = checkConflicts(scheduleForm);
        
        if (newConflicts.length > 0) {
            setConflicts(newConflicts);
            return;
        }

        const updatedTimetable = { ...timetable };
        const { day, timeSlot, subject, teacher, room, notes } = scheduleForm;
        
        updatedTimetable[day][timeSlot] = {
            subject: parseInt(subject),
            teacher: parseInt(teacher),
            room,
            notes
        };
        
        setTimetable(updatedTimetable);
        toast.success('Schedule updated successfully!');
        handleCloseDialog();
    };

    const handleDeleteSchedule = (day, timeSlotId) => {
        const updatedTimetable = { ...timetable };
        updatedTimetable[day][timeSlotId] = null;
        setTimetable(updatedTimetable);
        toast.success('Schedule deleted successfully!');
    };

    const getSubjectName = (subjectId) => {
        return mockSubjects.find(s => s.id === subjectId)?.name || '';
    };

    const getTeacherName = (teacherId) => {
        return mockTeachers.find(t => t.id === teacherId)?.name || '';
    };

    const getTimetableStats = () => {
        let totalSlots = 0;
        let filledSlots = 0;
        
        weekDays.forEach(day => {
            timeSlots.forEach(slot => {
                if (!slot.isBreak) {
                    totalSlots++;
                    if (timetable[day]?.[slot.id]) {
                        filledSlots++;
                    }
                }
            });
        });
        
        return {
            totalSlots,
            filledSlots,
            percentage: totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0
        };
    };

    const stats = getTimetableStats();

    const renderTimetableGrid = () => (
        <TableContainer component={Paper} sx={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', background: 'rgba(255, 255, 255, 0.05)' }}>
                            Time
                        </TableCell>
                        {weekDays.map(day => (
                            <TableCell key={day} align="center" sx={{ 
                                fontWeight: 'bold', 
                                background: 'rgba(255, 255, 255, 0.05)',
                                minWidth: 150
                            }}>
                                {day}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {timeSlots.map(slot => (
                        <TableRow key={slot.id}>
                            <TableCell sx={{ 
                                fontWeight: 600,
                                background: slot.isBreak ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {slot.label}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {slot.start} - {slot.end}
                                    </Typography>
                                </Box>
                            </TableCell>
                            {weekDays.map(day => (
                                <TableCell key={`${day}-${slot.id}`} sx={{ 
                                    p: 0.5, 
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    background: slot.isBreak ? 'rgba(255, 193, 7, 0.05)' : 'transparent'
                                }}>
                                    {slot.isBreak ? (
                                        <Box sx={{ 
                                            p: 2, 
                                            textAlign: 'center',
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        }}>
                                            {slot.label}
                                        </Box>
                                    ) : (
                                        <Box sx={{ minHeight: 80, position: 'relative' }}>
                                            {timetable[day]?.[slot.id] ? (
                                                <Card sx={{ 
                                                    height: '100%',
                                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08))',
                                                        transform: 'scale(1.02)'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => handleOpenDialog(day, slot.id)}
                                                >
                                                    <CardContent sx={{ p: 1 }}>
                                                        <Typography variant="caption" sx={{ 
                                                            fontWeight: 600,
                                                            color: '#10b981',
                                                            display: 'block'
                                                        }}>
                                                            {getSubjectName(timetable[day][slot.id].subject)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ 
                                                            display: 'block',
                                                            color: 'text.secondary',
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            {getTeacherName(timetable[day][slot.id].teacher)}
                                                        </Typography>
                                                        {timetable[day][slot.id].room && (
                                                            <Typography variant="caption" sx={{ 
                                                                display: 'block',
                                                                color: 'text.secondary',
                                                                fontSize: '0.7rem'
                                                            }}>
                                                                Room: {timetable[day][slot.id].room}
                                                            </Typography>
                                                        )}
                                                        <IconButton 
                                                            size="small" 
                                                            sx={{ 
                                                                position: 'absolute',
                                                                top: 2,
                                                                right: 2,
                                                                background: 'rgba(239, 68, 68, 0.1)',
                                                                '&:hover': {
                                                                    background: 'rgba(239, 68, 68, 0.2)'
                                                                }
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteSchedule(day, slot.id);
                                                            }}
                                                        >
                                                            <DeleteIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                                                        </IconButton>
                                                    </CardContent>
                                                </Card>
                                            ) : (
                                                <Box sx={{ 
                                                    height: '100%',
                                                    border: '2px dashed rgba(255, 255, 255, 0.2)',
                                                    borderRadius: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        border: '2px dashed rgba(16, 185, 129, 0.5)',
                                                        background: 'rgba(16, 185, 129, 0.05)'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => handleOpenDialog(day, slot.id)}
                                                >
                                                    <AddIcon sx={{ color: 'rgba(255, 255, 255, 0.4)' }} />
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mt: 1, mb: 4,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                    }}>
                        <CalendarTodayIcon />
                        Timetable Management
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Create and manage class schedules
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={selectedClass}
                            label="Class"
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <MenuItem value="10-A">Class 10-A</MenuItem>
                            <MenuItem value="10-B">Class 10-B</MenuItem>
                            <MenuItem value="9-A">Class 9-A</MenuItem>
                            <MenuItem value="9-B">Class 9-B</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        sx={{ 
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                            }
                        }}
                    >
                        Print
                    </Button>
                    
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CheckCircleIcon sx={{ color: '#10b981', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                                    {stats.filledSlots}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Scheduled Periods
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ScheduleIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                                    {stats.totalSlots - stats.filledSlots}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Free Periods
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <ViewWeekIcon sx={{ color: '#8b5cf6', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8b5cf6' }}>
                                    {weekDays.length}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Week Days
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper sx={{ 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AccessTimeIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                                    {stats.percentage}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Completion
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Timetable Grid */}
            <Paper sx={{ 
                p: 3, 
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Weekly Schedule - {selectedClass}
                    </Typography>
                    <Chip 
                        label={`${stats.filledSlots}/${stats.totalSlots} periods scheduled`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>
                
                {renderTimetableGrid()}
            </Paper>

            {/* Schedule Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minHeight: 500
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ScheduleIcon color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {currentSlot?.day && currentSlot?.timeSlotId 
                                ? `Edit Schedule - ${currentSlot.day}`
                                : 'Create New Schedule'
                            }
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        {currentSlot?.day && currentSlot?.timeSlotId 
                            ? `Modify the existing schedule for ${currentSlot.day}`
                            : 'Add a new period to the class schedule'
                        }
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.3)", borderRadius: "4px", "&:hover": { background: "rgba(255, 255, 255, 0.5)" } } }}>
                    {currentSlot?.day && currentSlot?.timeSlotId && (
                        <Box sx={{ 
                            mt: 1, mb: 4, 
                            p: 3, 
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                            borderRadius: '12px',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3b82f6' }}>
                                📅 Schedule Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Day: {currentSlot.day}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <ClassIcon sx={{ color: 'text.secondary' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Class: {selectedClass}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AccessTimeIcon sx={{ color: 'text.secondary' }} />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Time: {timeSlots.find(slot => slot.id === parseInt(currentSlot.timeSlotId))?.label}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', ml: 4 }}>
                                        {timeSlots.find(slot => slot.id === parseInt(currentSlot.timeSlotId))?.start} - {timeSlots.find(slot => slot.id === parseInt(currentSlot.timeSlotId))?.end}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {conflicts.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            {conflicts.map((conflict, index) => (
                                <Alert 
                                    key={index} 
                                    severity={conflict.severity} 
                                    sx={{ 
                                        mb: 1,
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)'
                                    }}
                                >
                                    {conflict.message}
                                </Alert>
                            ))}
                        </Box>
                    )}
                    
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                📚 Schedule Information
                            </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    },
                                    '&.Mui-focused': {
                                        border: '2px solid rgba(16, 185, 129, 0.5)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                    }
                                }
                            }}>
                                <InputLabel>Subject</InputLabel>
                                <Select
                                    value={scheduleForm.subject}
                                    label="Subject"
                                    onChange={(e) => setScheduleForm({...scheduleForm, subject: e.target.value})}
                                >
                                    {mockSubjects.map(subject => (
                                        <MenuItem key={subject.id} value={subject.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <SubjectIcon sx={{ fontSize: 16 }} />
                                                {subject.name} ({subject.code})
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth sx={{
                                '& .MuiOutlinedInput-root': {
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    '&:hover': {
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                    },
                                    '&.Mui-focused': {
                                        border: '2px solid rgba(16, 185, 129, 0.5)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                    }
                                }
                            }}>
                                <InputLabel>Teacher</InputLabel>
                                <Select
                                    value={scheduleForm.teacher}
                                    label="Teacher"
                                    onChange={(e) => setScheduleForm({...scheduleForm, teacher: e.target.value})}
                                >
                                    {mockTeachers.map(teacher => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <PersonIcon sx={{ fontSize: 16 }} />
                                                {teacher.name}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Room Number"
                                value={scheduleForm.room}
                                onChange={(e) => setScheduleForm({...scheduleForm, room: e.target.value})}
                                placeholder="e.g., Room 101, Lab A, Gymnasium"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        '&:hover': {
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                        },
                                        '&.Mui-focused': {
                                            border: '2px solid rgba(16, 185, 129, 0.5)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Additional Notes"
                                multiline
                                rows={4}
                                value={scheduleForm.notes}
                                onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                                placeholder="Add any special instructions, equipment requirements, or notes for this period..."
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
                                            border: '2px solid rgba(16, 185, 129, 0.5)',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Alert 
                        severity="info" 
                        sx={{ 
                            mt: 3,
                            background: 'rgba(59, 130, 246, 0.1)', 
                            border: '1px solid rgba(59, 130, 246, 0.2)' 
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            📋 Schedule Tips:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            • <strong>Subject & Teacher:</strong> Make sure the teacher is qualified for the selected subject<br/>
                            • <strong>Room Assignment:</strong> Consider room capacity and special equipment needs<br/>
                            • <strong>Conflict Check:</strong> The system will automatically check for teacher conflicts<br/>
                            • <strong>Notes:</strong> Add any special requirements or instructions for the period
                        </Typography>
                    </Alert>
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
                        variant="contained" 
                        onClick={handleSaveSchedule}
                        disabled={!scheduleForm.subject || !scheduleForm.teacher}
                        size="large"
                        startIcon={<CheckCircleIcon />}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669, #047857)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)'
                            },
                            '&:disabled': {
                                opacity: 0.5,
                                transform: 'none',
                                boxShadow: 'none'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Save Schedule
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TimetableManagement;
