import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Card, CardContent, CardActions, IconButton, Chip,
    List, ListItem, ListItemText, ListItemSecondaryAction, Divider,
    Autocomplete, Paper, Alert, Avatar, Tabs, Tab, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
    Add as AddIcon,
    Group as GroupIcon,
    Person as PersonIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Assignment as AssignmentIcon,
    PersonAdd as PersonAddIcon,
    Class as ClassIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const ClassManagement = ({ currentRole = 'class' }) => {
    const [myClass, setMyClass] = useState(null); // Class teacher manages only ONE class
    const [assignedClasses, setAssignedClasses] = useState([]); // Subject teacher's assigned classes
    const [availableStudents, setAvailableStudents] = useState([]);
    const [availableTeachers, setAvailableTeachers] = useState([]);
    const [openCreateClassDialog, setOpenCreateClassDialog] = useState(false);
    const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
    const [openAssignTeacherDialog, setOpenAssignTeacherDialog] = useState(false);
    const [selectedSubjectSlot, setSelectedSubjectSlot] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [newClassName, setNewClassName] = useState('');

    // Role-specific configuration
    const isClassTeacher = currentRole === 'class';
    const isSubjectTeacher = currentRole === 'subject';

    // Mock data representing CSV imported dataset
    const csvDataset = {
        students: [
            { id: 'STU001', name: 'Alice Johnson', role: 'student', email: 'alice.johnson@school.edu', instituteId: 'INS001', dob: '2008-05-15', isAssigned: false },
            { id: 'STU002', name: 'Bob Smith', role: 'student', email: 'bob.smith@school.edu', instituteId: 'INS002', dob: '2008-03-22', isAssigned: false },
            { id: 'STU003', name: 'Carol Williams', role: 'student', email: 'carol.williams@school.edu', instituteId: 'INS003', dob: '2008-07-10', isAssigned: true },
            { id: 'STU004', name: 'David Brown', role: 'student', email: 'david.brown@school.edu', instituteId: 'INS004', dob: '2008-09-05', isAssigned: false },
            { id: 'STU005', name: 'Emma Davis', role: 'student', email: 'emma.davis@school.edu', instituteId: 'INS005', dob: '2008-01-30', isAssigned: false },
            { id: 'STU006', name: 'Frank Miller', role: 'student', email: 'frank.miller@school.edu', instituteId: 'INS006', dob: '2008-11-18', isAssigned: false },
            { id: 'STU007', name: 'Grace Wilson', role: 'student', email: 'grace.wilson@school.edu', instituteId: 'INS007', dob: '2008-04-12', isAssigned: false },
            { id: 'STU008', name: 'Henry Moore', role: 'student', email: 'henry.moore@school.edu', instituteId: 'INS008', dob: '2008-08-25', isAssigned: false },
            { id: 'STU009', name: 'Isabella Garcia', role: 'student', email: 'isabella.garcia@school.edu', instituteId: 'INS009', dob: '2008-06-20', isAssigned: false },
            { id: 'STU010', name: 'Jack Robinson', role: 'student', email: 'jack.robinson@school.edu', instituteId: 'INS010', dob: '2008-12-03', isAssigned: false }
        ],
        teachers: [
            { id: 'TCH001', name: 'Dr. Sarah Johnson', role: 'teacher', email: 'sarah.johnson@school.edu', instituteId: 'INS101', subjects: ['Mathematics', 'Statistics'] },
            { id: 'TCH002', name: 'Prof. Michael Chen', role: 'teacher', email: 'michael.chen@school.edu', instituteId: 'INS102', subjects: ['Physics', 'Chemistry'] },
            { id: 'TCH003', name: 'Ms. Emily Davis', role: 'teacher', email: 'emily.davis@school.edu', instituteId: 'INS103', subjects: ['English', 'Literature'] },
            { id: 'TCH004', name: 'Mr. Robert Wilson', role: 'teacher', email: 'robert.wilson@school.edu', instituteId: 'INS104', subjects: ['History', 'Geography'] },
            { id: 'TCH005', name: 'Dr. Lisa Anderson', role: 'teacher', email: 'lisa.anderson@school.edu', instituteId: 'INS105', subjects: ['Biology', 'Environmental Science'] },
            { id: 'TCH006', name: 'Mr. James Taylor', role: 'teacher', email: 'james.taylor@school.edu', instituteId: 'INS106', subjects: ['Computer Science', 'Mathematics'] },
            { id: 'TCH007', name: 'Ms. Rachel Green', role: 'teacher', email: 'rachel.green@school.edu', instituteId: 'INS107', subjects: ['Physical Education', 'Health'] },
            { id: 'TCH008', name: 'Dr. Kevin Zhang', role: 'teacher', email: 'kevin.zhang@school.edu', instituteId: 'INS108', subjects: ['Art', 'Design'] }
        ]
    };

    // Subject slots that need teachers
    const subjectSlots = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 
        'History', 'Geography', 'Computer Science', 'Physical Education', 'Art'
    ];

    useEffect(() => {
        // Load unassigned students for class teacher
        setAvailableStudents(csvDataset.students.filter(student => !student.isAssigned));
        
        // Load available teachers
        setAvailableTeachers(csvDataset.teachers);

        if (isClassTeacher) {
            // Class teacher: Check if they have created their class
            // In real app, this would be loaded from API
            setMyClass(null); // No class created yet
        } else {
            // Subject teacher: Load assigned classes (read-only)
            setAssignedClasses([
                { id: 1, name: 'Class 10-A', studentsCount: 25 },
                { id: 2, name: 'Class 9-B', studentsCount: 22 }
            ]);
        }
    }, [currentRole]);

    const handleCreateClass = () => {
        if (!newClassName.trim()) {
            toast.error('Please enter a class name');
            return;
        }

        const newClass = {
            id: Date.now(),
            name: newClassName,
            students: [],
            subjectTeachers: {}, // Will store subject -> teacher mapping
            createdAt: new Date()
        };

        setMyClass(newClass);
        setNewClassName('');
        setOpenCreateClassDialog(false);
        toast.success(`Class "${newClassName}" created successfully!`);
    };

    const handleAddStudent = (student) => {
        if (!myClass) return;

        const updatedClass = {
            ...myClass,
            students: [...myClass.students, student]
        };

        setMyClass(updatedClass);
        
        // Remove from available students
        setAvailableStudents(prev => prev.filter(s => s.id !== student.id));
        
        toast.success(`${student.name} added to class`);
        setOpenAddStudentDialog(false);
    };

    const handleRemoveStudent = (studentId) => {
        if (!myClass) return;

        const studentToRemove = myClass.students.find(s => s.id === studentId);
        const updatedClass = {
            ...myClass,
            students: myClass.students.filter(s => s.id !== studentId)
        };

        setMyClass(updatedClass);
        
        // Add back to available students
        if (studentToRemove) {
            setAvailableStudents(prev => [...prev, studentToRemove]);
        }
        
        toast.success('Student removed from class');
    };

    const handleAssignTeacher = (teacher, subject) => {
        if (!myClass) return;

        const updatedClass = {
            ...myClass,
            subjectTeachers: {
                ...myClass.subjectTeachers,
                [subject]: teacher
            }
        };

        setMyClass(updatedClass);
        toast.success(`${teacher.name} assigned to ${subject}`);
        setOpenAssignTeacherDialog(false);
        setSelectedSubjectSlot('');
    };

    const getTeachersForSubject = (subject) => {
        return availableTeachers.filter(teacher => 
            teacher.subjects.includes(subject)
        );
    };

    const renderClassTeacherView = () => {
        if (!myClass) {
            // No class created yet
            return (
                <Card sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <ClassIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Create Your Class
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                        As a Class Teacher, you need to create your assigned class first. 
                        Once created, you can add students and assign subject teachers.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreateClassDialog(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #059669, #047857)'
                            }
                        }}
                    >
                        Create My Class
                    </Button>
                </Card>
            );
        }

        return (
            <Box>
                {/* Class Info Card */}
                <Card sx={{ 
                    mb: 3,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {myClass.name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                    {myClass.students.length} students enrolled
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                                onClick={() => setOpenAddStudentDialog(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #059669, #047857)'
                                    }
                                }}
                            >
                                Add Students
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Tabs for Students and Subject Teachers */}
                <Paper sx={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Tabs 
                        value={currentTab} 
                        onChange={(e, newValue) => setCurrentTab(newValue)}
                        variant="fullWidth"
                    >
                        <Tab label={`Students (${myClass.students.length})`} />
                        <Tab label="Subject Teachers" />
                    </Tabs>
                    
                    <Box sx={{ p: 3 }}>
                        {currentTab === 0 && (
                            // Students Tab
                            <Box>
                                {myClass.students.length === 0 ? (
                                    <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                                        No students added yet. Click "Add Students" to search and add students from the database.
                                    </Typography>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Institute ID</TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>Date of Birth</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {myClass.students.map((student) => (
                                                    <TableRow key={student.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar sx={{ bgcolor: '#3b82f6' }}>
                                                                    <PersonIcon />
                                                                </Avatar>
                                                                {student.name}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{student.instituteId}</TableCell>
                                                        <TableCell>{student.email}</TableCell>
                                                        <TableCell>{new Date(student.dob).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <IconButton 
                                                                color="error"
                                                                onClick={() => handleRemoveStudent(student.id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Box>
                        )}
                        
                        {currentTab === 1 && (
                            // Subject Teachers Tab
                            <Box>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                    Assign Subject Teachers
                                </Typography>
                                <Grid container spacing={2}>
                                    {subjectSlots.map((subject) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={subject}>
                                            <Card sx={{ 
                                                p: 2,
                                                background: myClass.subjectTeachers[subject] 
                                                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                border: myClass.subjectTeachers[subject]
                                                    ? '1px solid rgba(16, 185, 129, 0.2)'
                                                    : '1px solid rgba(255, 255, 255, 0.1)'
                                            }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                    {subject}
                                                </Typography>
                                                {myClass.subjectTeachers[subject] ? (
                                                    <Box>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                                            {myClass.subjectTeachers[subject].name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            {myClass.subjectTeachers[subject].email}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedSubjectSlot(subject);
                                                            setOpenAssignTeacherDialog(true);
                                                        }}
                                                    >
                                                        Assign Teacher
                                                    </Button>
                                                )}
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Box>
        );
    };

    const renderSubjectTeacherView = () => {
        return (
            <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    My Assigned Classes
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                    As a Subject Teacher, you can view the classes where you teach. Class creation and student management 
                    is handled by Class Teachers.
                </Alert>
                <Grid container spacing={2}>
                    {assignedClasses.map((classData) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={classData.id}>
                            <Card sx={{ 
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {classData.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        {classData.studentsCount} students
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {isClassTeacher ? 'My Class Management' : 'My Subject Classes'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {isClassTeacher 
                        ? 'Create your class, add students from the database, and assign subject teachers'
                        : 'View the classes where you teach your subject'
                    }
                </Typography>
            </Box>

            {/* Role-specific Alert */}
            <Alert 
                severity="info" 
                sx={{ mb: 3 }}
                icon={<SchoolIcon />}
            >
                {isClassTeacher 
                    ? 'As a Class Teacher, you can create ONE class, search and add students from the institute database, and assign subject teachers to your class.'
                    : 'As a Subject Teacher, you can view classes assigned to you by Class Teachers. You cannot create classes or manage students.'
                }
            </Alert>

            {/* Main Content */}
            {isClassTeacher ? renderClassTeacherView() : renderSubjectTeacherView()}

            {/* Create Class Dialog */}
            <Dialog 
                open={openCreateClassDialog} 
                onClose={() => setOpenCreateClassDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minHeight: 400
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ClassIcon color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Create Your Class
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        Set up your class to start managing students and subjects
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.3)", borderRadius: "4px", "&:hover": { background: "rgba(255, 255, 255, 0.5)" } } }}>
                    <Box sx={{ 
                        mt: 1, mb: 4, 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3b82f6' }}>
                            📚 Class Setup Information
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                            Enter the class name assigned to you by the school management. 
                            This will be your primary class that you'll manage throughout the academic year.
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        🏫 Class Details
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="Class Name"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="e.g., Class 10-A, Grade 9 Section B, Room 204"
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
                                    border: '2px solid rgba(16, 185, 129, 0.5)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                }
                            },
                            '& .MuiOutlinedInput-input': {
                                fontSize: '1.1rem',
                                padding: '16px'
                            }
                        }}
                    />

                    <Alert 
                        severity="info" 
                        sx={{ 
                            background: 'rgba(59, 130, 246, 0.1)', 
                            border: '1px solid rgba(59, 130, 246, 0.2)' 
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            📝 After Creating Your Class:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            • <strong>Add Students:</strong> Search and add students from the institute database<br/>
                            • <strong>Assign Teachers:</strong> Assign subject-specific teachers to your class<br/>
                            • <strong>Manage Schedule:</strong> Create and manage the class timetable<br/>
                            • <strong>Class Updates:</strong> Send announcements and updates to students
                        </Typography>
                    </Alert>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2,
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)", justifyContent: "flex-end", gap: 2, flexWrap: "wrap",
                    justifyContent: 'flex-end'
                }}>
                    <Button 
                        onClick={() => setOpenCreateClassDialog(false)}
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
                        onClick={handleCreateClass}
                        disabled={!newClassName.trim()}
                        size="large"
                        startIcon={<SchoolIcon />}
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
                        Create Class
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Student Dialog */}
            <Dialog 
                open={openAddStudentDialog} 
                onClose={() => setOpenAddStudentDialog(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'rgba(30, 30, 30, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        minHeight: 600
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PersonAddIcon color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Add Students to Your Class
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        Search and select students from the institute database to add to your class
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.3)", borderRadius: "4px", "&:hover": { background: "rgba(255, 255, 255, 0.5)" } } }}>
                    <Box sx={{ 
                        mt: 1, mb: 4, 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3b82f6' }}>
                            👥 Available Students ({availableStudents.length})
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                            Only unassigned students are shown. Students who are already assigned to other classes will not appear in this list.
                        </Typography>
                    </Box>

                    {availableStudents.length === 0 ? (
                        <Alert severity="warning" sx={{ 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            textAlign: 'center',
                            py: 4
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                No Available Students
                            </Typography>
                            <Typography variant="body2">
                                All students from the database have been assigned to classes. 
                                Contact administration to add new students to the system.
                            </Typography>
                        </Alert>
                    ) : (
                        <TableContainer sx={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            maxHeight: 400
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            Student Information
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            Institute ID
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            Contact
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                            textAlign: 'center'
                                        }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {availableStudents.map((student) => (
                                        <TableRow 
                                            key={student.id}
                                            sx={{
                                                '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.02)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ 
                                                        bgcolor: '#3b82f6',
                                                        width: 40,
                                                        height: 40
                                                    }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                            {student.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                            DOB: {new Date(student.dob).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={student.instituteId}
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {student.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleAddStudent(student)}
                                                    startIcon={<AddIcon />}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        borderRadius: '8px',
                                                        px: 3,
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                                            transform: 'translateY(-1px)'
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 4, 
                    pt: 0,
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)", justifyContent: "flex-end", gap: 2, flexWrap: "wrap"
                }}>
                    <Button 
                        onClick={() => setOpenAddStudentDialog(false)}
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
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign Teacher Dialog */}
            <Dialog 
                open={openAssignTeacherDialog} 
                onClose={() => setOpenAssignTeacherDialog(false)}
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
                        <AssignmentIcon color="primary" />
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Assign Teacher for {selectedSubjectSlot}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        Select a qualified teacher to handle {selectedSubjectSlot} for your class
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.3)", borderRadius: "4px", "&:hover": { background: "rgba(255, 255, 255, 0.5)" } } }}>
                    <Box sx={{ 
                        mt: 1, mb: 4, 
                        p: 3, 
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3b82f6' }}>
                            📚 Subject: {selectedSubjectSlot}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                            Available teachers who are qualified to teach {selectedSubjectSlot}. 
                            Teachers are filtered based on their subject expertise.
                        </Typography>
                    </Box>

                    {getTeachersForSubject(selectedSubjectSlot).length === 0 ? (
                        <Alert severity="warning" sx={{ 
                            background: 'rgba(245, 158, 11, 0.1)', 
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            textAlign: 'center',
                            py: 4
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                No Qualified Teachers Available
                            </Typography>
                            <Typography variant="body2">
                                No teachers in the database are qualified to teach {selectedSubjectSlot}. 
                                Contact administration to add qualified teachers for this subject.
                            </Typography>
                        </Alert>
                    ) : (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                👨‍🏫 Available Teachers ({getTeachersForSubject(selectedSubjectSlot).length})
                            </Typography>
                            
                            <Grid container spacing={3}>
                                {getTeachersForSubject(selectedSubjectSlot).map((teacher) => (
                                    <Grid size={{ xs: 12 }} key={teacher.id}>
                                        <Card
                                            sx={{ 
                                                p: 3,
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
                                                }
                                            }}
                                            onClick={() => handleAssignTeacher(teacher, selectedSubjectSlot)}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Avatar sx={{ 
                                                    bgcolor: '#3b82f6',
                                                    width: 56,
                                                    height: 56
                                                }}>
                                                    <PersonIcon sx={{ fontSize: 28 }} />
                                                </Avatar>
                                                
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {teacher.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                                        {teacher.email}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        {teacher.subjects.map((subject) => (
                                                            <Chip
                                                                key={subject}
                                                                label={subject}
                                                                size="small"
                                                                color={subject === selectedSubjectSlot ? 'primary' : 'default'}
                                                                variant={subject === selectedSubjectSlot ? 'filled' : 'outlined'}
                                                                sx={{
                                                                    ...(subject === selectedSubjectSlot && {
                                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                                        color: 'white'
                                                                    })
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                                
                                                <Button
                                                    variant="contained"
                                                    startIcon={<AssignmentIcon />}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #10b981, #059669)',
                                                        borderRadius: '8px',
                                                        px: 3,
                                                        py: 1,
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #059669, #047857)',
                                                        }
                                                    }}
                                                >
                                                    Assign
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    <Alert 
                        severity="info" 
                        sx={{ 
                            mt: 4,
                            background: 'rgba(59, 130, 246, 0.1)', 
                            border: '1px solid rgba(59, 130, 246, 0.2)' 
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            📝 Teacher Assignment:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            • <strong>Subject Match:</strong> Teachers shown are qualified for {selectedSubjectSlot}<br/>
                            • <strong>Automatic Notification:</strong> Assigned teacher will be notified about the class<br/>
                            • <strong>Timetable Integration:</strong> Assignment will be reflected in the timetable system<br/>
                            • <strong>Change Anytime:</strong> You can reassign teachers if needed
                        </Typography>
                    </Alert>
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 4, 
                    pt: 0,
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)", justifyContent: "flex-end", gap: 2, flexWrap: "wrap"
                }}>
                    <Button 
                        onClick={() => setOpenAssignTeacherDialog(false)}
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
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClassManagement;
