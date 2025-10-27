import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  PersonSearch as PersonSearchIcon,
  NotificationImportant as EmergencyIcon,
  Check as AcceptIcon,
  Close as DenyIcon,
  Send as SendIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  Book as BookIcon,
  Class as ClassIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';

// Mock data - In real app, this would come from your backend
const mockTeacherTimetable = {
  Monday: [
    { hour: '9:00-10:00', subject: 'Mathematics', class: '10A', isOccupied: true },
    { hour: '10:00-11:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '11:00-12:00', subject: 'Mathematics', class: '10B', isOccupied: true },
    { hour: '12:00-1:00', subject: 'Lunch Break', class: '', isOccupied: false },
    { hour: '1:00-2:00', subject: 'Mathematics', class: '9A', isOccupied: true },
    { hour: '2:00-3:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '3:00-4:00', subject: 'Mathematics', class: '9B', isOccupied: true }
  ],
  Tuesday: [
    { hour: '9:00-10:00', subject: 'Mathematics', class: '10A', isOccupied: true },
    { hour: '10:00-11:00', subject: 'Mathematics', class: '9C', isOccupied: true },
    { hour: '11:00-12:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '12:00-1:00', subject: 'Lunch Break', class: '', isOccupied: false },
    { hour: '1:00-2:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '2:00-3:00', subject: 'Mathematics', class: '10B', isOccupied: true },
    { hour: '3:00-4:00', subject: 'Mathematics', class: '9A', isOccupied: true }
  ],
  Wednesday: [
    { hour: '9:00-10:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '10:00-11:00', subject: 'Mathematics', class: '10A', isOccupied: true },
    { hour: '11:00-12:00', subject: 'Mathematics', class: '9B', isOccupied: true },
    { hour: '12:00-1:00', subject: 'Lunch Break', class: '', isOccupied: false },
    { hour: '1:00-2:00', subject: 'Mathematics', class: '10B', isOccupied: true },
    { hour: '2:00-3:00', subject: 'Mathematics', class: '9A', isOccupied: true },
    { hour: '3:00-4:00', subject: 'Free Period', class: '', isOccupied: false }
  ],
  Thursday: [
    { hour: '9:00-10:00', subject: 'Mathematics', class: '9C', isOccupied: true },
    { hour: '10:00-11:00', subject: 'Mathematics', class: '10A', isOccupied: true },
    { hour: '11:00-12:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '12:00-1:00', subject: 'Lunch Break', class: '', isOccupied: false },
    { hour: '1:00-2:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '2:00-3:00', subject: 'Mathematics', class: '9B', isOccupied: true },
    { hour: '3:00-4:00', subject: 'Mathematics', class: '10B', isOccupied: true }
  ],
  Friday: [
    { hour: '9:00-10:00', subject: 'Mathematics', class: '10A', isOccupied: true },
    { hour: '10:00-11:00', subject: 'Free Period', class: '', isOccupied: false },
    { hour: '11:00-12:00', subject: 'Mathematics', class: '9A', isOccupied: true },
    { hour: '12:00-1:00', subject: 'Lunch Break', class: '', isOccupied: false },
    { hour: '1:00-2:00', subject: 'Mathematics', class: '9C', isOccupied: true },
    { hour: '2:00-3:00', subject: 'Mathematics', class: '10B', isOccupied: true },
    { hour: '3:00-4:00', subject: 'Free Period', class: '', isOccupied: false }
  ]
};

// Simulate teacher availability for different time slots
const getAvailableTeachers = (day, timeSlot, requiredSubject) => {
  const allTeachers = [
    { 
      id: 1, 
      name: 'Dr. Smith', 
      subject: 'Mathematics', 
      freeHours: 3,
      email: 'dr.smith@school.edu',
      schedule: {
        Monday: { '10:00-11:00': false, '2:00-3:00': false },
        Tuesday: { '11:00-12:00': false, '1:00-2:00': false },
        Wednesday: { '9:00-10:00': false, '3:00-4:00': false },
        Thursday: { '11:00-12:00': false, '1:00-2:00': false },
        Friday: { '10:00-11:00': false, '3:00-4:00': false }
      }
    },
    { 
      id: 2, 
      name: 'Prof. Johnson', 
      subject: 'Physics', 
      freeHours: 2,
      email: 'prof.johnson@school.edu',
      schedule: {
        Monday: { '10:00-11:00': false, '2:00-3:00': false },
        Tuesday: { '9:00-10:00': false, '2:00-3:00': false },
        Wednesday: { '11:00-12:00': false, '1:00-2:00': false },
        Thursday: { '10:00-11:00': false, '3:00-4:00': false },
        Friday: { '9:00-10:00': false, '1:00-2:00': false }
      }
    },
    { 
      id: 3, 
      name: 'Ms. Williams', 
      subject: 'Chemistry', 
      freeHours: 4,
      email: 'ms.williams@school.edu',
      schedule: {
        Monday: { '9:00-10:00': false, '11:00-12:00': false, '2:00-3:00': false, '3:00-4:00': false },
        Tuesday: { '10:00-11:00': false, '1:00-2:00': false, '3:00-4:00': false },
        Wednesday: { '9:00-10:00': false, '2:00-3:00': false, '3:00-4:00': false },
        Thursday: { '9:00-10:00': false, '11:00-12:00': false, '1:00-2:00': false },
        Friday: { '10:00-11:00': false, '2:00-3:00': false, '3:00-4:00': false }
      }
    },
    { 
      id: 4, 
      name: 'Mr. Brown', 
      subject: 'Mathematics', 
      freeHours: 1,
      email: 'mr.brown@school.edu',
      schedule: {
        Monday: { '2:00-3:00': false },
        Tuesday: { '11:00-12:00': false },
        Wednesday: { '3:00-4:00': false },
        Thursday: { '1:00-2:00': false },
        Friday: { '10:00-11:00': false }
      }
    },
    { 
      id: 5, 
      name: 'Dr. Davis', 
      subject: 'Biology', 
      freeHours: 3,
      email: 'dr.davis@school.edu',
      schedule: {
        Monday: { '9:00-10:00': false, '11:00-12:00': false, '3:00-4:00': false },
        Tuesday: { '10:00-11:00': false, '2:00-3:00': false },
        Wednesday: { '9:00-10:00': false, '1:00-2:00': false },
        Thursday: { '11:00-12:00': false, '2:00-3:00': false, '3:00-4:00': false },
        Friday: { '9:00-10:00': false, '1:00-2:00': false }
      }
    },
    { 
      id: 6, 
      name: 'Prof. Anderson', 
      subject: 'English', 
      freeHours: 2,
      email: 'prof.anderson@school.edu',
      schedule: {
        Monday: { '11:00-12:00': false, '1:00-2:00': false },
        Tuesday: { '9:00-10:00': false, '3:00-4:00': false },
        Wednesday: { '10:00-11:00': false, '2:00-3:00': false },
        Thursday: { '9:00-10:00': false, '2:00-3:00': false },
        Friday: { '11:00-12:00': false, '1:00-2:00': false }
      }
    }
  ];

  // Filter teachers who are available at the requested time slot
  const availableTeachers = allTeachers.filter(teacher => {
    const daySchedule = teacher.schedule[day];
    return daySchedule && daySchedule[timeSlot] === false; // false means they're free
  });

  // Sort by priority: 1) Most free hours, 2) Same subject
  return availableTeachers.sort((a, b) => {
    // Priority 1: Same subject teachers first
    if (a.subject === requiredSubject && b.subject !== requiredSubject) return -1;
    if (b.subject === requiredSubject && a.subject !== requiredSubject) return 1;
    
    // Priority 2: More free hours
    return b.freeHours - a.freeHours;
  });
};

const SmartSubstitution = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [substitutionDialog, setSubstitutionDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [substitutionRequests, setSubstitutionRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);

  // Emergency alert system - Check for unaccepted requests 1 hour before class
  useEffect(() => {
    const checkEmergencyAlerts = () => {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      
      substitutionRequests.forEach(request => {
        if (request.status === 'pending') {
          // Parse the request time
          const [timeStr] = request.time.split('-');
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          // Create date object for the class time
          const classDateTime = new Date(request.date);
          classDateTime.setHours(hours, minutes, 0, 0);
          
          // Check if class is exactly 1 hour away and no teacher accepted
          const timeDiff = classDateTime.getTime() - now.getTime();
          const oneHour = 60 * 60 * 1000;
          
          // If class is within 1 hour and no teacher accepted
          if (timeDiff <= oneHour && timeDiff > 0) {
            const alertExists = emergencyAlerts.some(alert => alert.requestId === request.id);
            
            if (!alertExists) {
              const newAlert = {
                id: Date.now(),
                requestId: request.id,
                message: `🚨 URGENT: No teacher accepted your substitution request for ${request.subject} - ${request.class} at ${request.time} on ${request.day}. Find a substitute ASAP!`,
                time: request.time,
                subject: request.subject,
                class: request.class,
                day: request.day,
                createdAt: now,
                severity: 'critical'
              };
              
              setEmergencyAlerts(prev => [...prev, newAlert]);
              
              // Show toast notification
              toast.error(`🚨 Emergency: Find substitute for ${request.subject} at ${request.time} immediately!`, {
                duration: 10000,
                position: 'top-center'
              });
            }
          }
        }
      });
    };

    // Check every minute for emergency alerts
    const interval = setInterval(checkEmergencyAlerts, 60000);
    
    // Initial check
    checkEmergencyAlerts();

    return () => clearInterval(interval);
  }, [substitutionRequests, emergencyAlerts]);

  // Mock data for requests
  useEffect(() => {
    setSubstitutionRequests([
      {
        id: 1,
        date: '2025-10-28',
        day: 'Monday',
        time: '10:00-11:00',
        subject: 'Mathematics',
        class: '10A',
        reason: 'Medical appointment',
        status: 'pending',
        requestedAt: '2025-10-27 09:30',
        assignedTeacher: null
      },
      {
        id: 2,
        date: '2025-10-29',
        day: 'Tuesday',
        time: '2:00-3:00',
        subject: 'Mathematics',
        class: '10B',
        reason: 'Personal emergency',
        status: 'accepted',
        requestedAt: '2025-10-27 08:15',
        assignedTeacher: 'Dr. Smith'
      }
    ]);

    setReceivedRequests([
      {
        id: 3,
        requesterName: 'Prof. Wilson',
        date: '2025-10-28',
        day: 'Monday',
        time: '1:00-2:00',
        subject: 'Physics',
        class: '11A',
        reason: 'Conference attendance',
        status: 'pending',
        priority: 'high' // Same subject
      },
      {
        id: 4,
        requesterName: 'Ms. Taylor',
        date: '2025-10-28',
        day: 'Monday',
        time: '3:00-4:00',
        subject: 'Chemistry',
        class: '12B',
        reason: 'Family emergency',
        status: 'pending',
        priority: 'normal'
      }
    ]);

    setEmergencyAlerts([
      {
        id: 5,
        requesterName: 'Dr. Anderson',
        date: '2025-10-27',
        day: 'Today',
        time: '2:00-3:00',
        subject: 'Biology',
        class: '11B',
        reason: 'Sudden illness',
        isEmergency: true,
        timeLeft: '45 minutes'
      }
    ]);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleSlotClick = (slot) => {
    if (slot.isOccupied && slot.subject !== 'Lunch Break') {
      setSelectedSlot(slot);
      setSubstitutionDialog(true);
    }
  };

  const handleRequestSubstitution = () => {
    // Get available teachers for this time slot
    const availableTeachers = getAvailableTeachers(selectedDay, selectedSlot.hour, selectedSlot.subject);
    
    const newRequest = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      day: selectedDay,
      time: selectedSlot.hour,
      subject: selectedSlot.subject,
      class: selectedSlot.class,
      reason: reason,
      status: 'pending',
      requestedAt: new Date().toLocaleString(),
      assignedTeacher: null,
      availableTeachers: availableTeachers.length,
      sentTo: availableTeachers.map(t => t.name).join(', ')
    };

    setSubstitutionRequests(prev => [...prev, newRequest]);
    setSubstitutionDialog(false);
    setReason('');
    setSelectedSlot(null);

    // Simulate sending requests to available teachers
    toast.success(`Substitution request sent to ${availableTeachers.length} available teachers`);
    
    // Show which teachers the request was sent to
    if (availableTeachers.length > 0) {
      const priorityTeachers = availableTeachers.filter(t => t.subject === selectedSlot.subject);
      const priorityMessage = priorityTeachers.length > 0 
        ? `Priority sent to ${priorityTeachers.map(t => t.name).join(', ')} (same subject)` 
        : `Request sent to ${availableTeachers.slice(0, 3).map(t => t.name).join(', ')}`;
      
      setTimeout(() => {
        toast.info(priorityMessage);
      }, 1000);
    } else {
      toast.error('No teachers available for this time slot!');
    }
  };

  const handleAcceptRequest = (requestId) => {
    setReceivedRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
  };

  const handleDenyRequest = (requestId) => {
    setReceivedRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'denied' } : req
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'denied': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    return priority === 'high' ? 'error' : 'default';
  };

  const renderTimetableView = () => (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Day</InputLabel>
          <Select
            value={selectedDay}
            label="Day"
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {Object.keys(mockTeacherTimetable).map(day => (
              <MenuItem key={day} value={day}>{day}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Alert severity="info" icon={<ScheduleIcon />}>
          Click on any occupied time slot to request substitution
        </Alert>
      </Box>

      <Grid container spacing={2}>
        {mockTeacherTimetable[selectedDay]?.map((slot, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                cursor: slot.isOccupied && slot.subject !== 'Lunch Break' ? 'pointer' : 'default',
                bgcolor: slot.isOccupied 
                  ? slot.subject === 'Lunch Break' 
                    ? 'grey.100' 
                    : 'primary.50'
                  : 'success.50',
                border: slot.isOccupied && slot.subject !== 'Lunch Break' ? '2px solid' : '1px solid',
                borderColor: slot.isOccupied && slot.subject !== 'Lunch Break' ? 'primary.main' : 'grey.300',
                '&:hover': slot.isOccupied && slot.subject !== 'Lunch Break' ? {
                  bgcolor: 'primary.100',
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                } : {}
              }}
              onClick={() => handleSlotClick(slot)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {slot.hour}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  {slot.subject}
                </Typography>
                {slot.class && (
                  <Typography variant="body2" color="text.secondary">
                    Class: {slot.class}
                  </Typography>
                )}
                <Chip
                  size="small"
                  label={slot.isOccupied ? 'Occupied' : 'Free'}
                  color={slot.isOccupied ? 'primary' : 'success'}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMyRequests = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date & Day</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Subject & Class</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Teachers Contacted</TableCell>
            <TableCell>Assigned Teacher</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {substitutionRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Typography variant="body2">{request.date}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {request.day}
                </Typography>
              </TableCell>
              <TableCell>{request.time}</TableCell>
              <TableCell>
                <Typography variant="body2">{request.subject}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Class {request.class}
                </Typography>
              </TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>
                <Chip
                  label={request.status}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="caption" color="text.secondary">
                  {request.availableTeachers ? `${request.availableTeachers} teachers` : 'Processing...'}
                </Typography>
                {request.sentTo && (
                  <Typography variant="caption" display="block" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {request.sentTo}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {request.assignedTeacher || 'Not assigned'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderReceivedRequests = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Requester</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Subject & Class</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {receivedRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.requesterName}</TableCell>
              <TableCell>
                <Typography variant="body2">{request.date}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {request.time}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{request.subject}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Class {request.class}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={request.priority}
                  color={getPriorityColor(request.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>
                {request.status === 'pending' ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="success"
                      onClick={() => handleAcceptRequest(request.id)}
                      size="small"
                    >
                      <AcceptIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDenyRequest(request.id)}
                      size="small"
                    >
                      <DenyIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderEmergencyAlerts = () => (
    <Box>
      {emergencyAlerts.length === 0 ? (
        <Alert severity="info">No emergency substitution alerts at the moment.</Alert>
      ) : (
        emergencyAlerts.map((alert) => (
          <Card key={alert.id} sx={{ mb: 2, border: '2px solid', borderColor: 'error.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <EmergencyIcon color="error" />
                <Typography variant="h6" color="error">
                  EMERGENCY SUBSTITUTION NEEDED
                </Typography>
                <Chip label={`${alert.timeLeft} left`} color="error" size="small" />
              </Box>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Requester:</strong> {alert.requesterName}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Time:</strong> {alert.time}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Subject:</strong> {alert.subject}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Class:</strong> {alert.class}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Reason:</strong> {alert.reason}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No teachers accepted the original request. Emergency assistance needed!
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AcceptIcon />}
                  onClick={() => handleAcceptRequest(alert.id)}
                >
                  Accept Emergency Substitution
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PersonSearchIcon />}
                >
                  Find Alternative Teacher
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScheduleIcon color="primary" />
        Smart Substitution System
      </Typography>

      <Paper sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Request Substitution" icon={<SendIcon />} />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>My Requests</span>
                <Badge badgeContent={substitutionRequests.length} color="primary" sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none' } }} />
              </Box>
            } 
            icon={<ScheduleIcon />} 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Requests Received</span>
                <Badge badgeContent={receivedRequests.filter(r => r.status === 'pending').length} color="warning" sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none' } }} />
              </Box>
            } 
            icon={<PersonSearchIcon />} 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Emergency Alerts</span>
                <Badge badgeContent={emergencyAlerts.length} color="error" sx={{ '& .MuiBadge-badge': { position: 'relative', transform: 'none' } }} />
              </Box>
            } 
            icon={<EmergencyIcon />} 
          />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {currentTab === 0 && renderTimetableView()}
          {currentTab === 1 && renderMyRequests()}
          {currentTab === 2 && renderReceivedRequests()}
          {currentTab === 3 && renderEmergencyAlerts()}
        </Box>
      </Paper>

      {/* Substitution Request Dialog */}
      <Dialog open={substitutionDialog} onClose={() => setSubstitutionDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          pb: 1, 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScheduleIcon color="primary" />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Request Substitution
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            Submit a substitution request for your class period
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
          {selectedSlot && (
            <Box sx={{ 
              mt: 1, mb: 4, 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05))',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#3b82f6' }}>
                📅 Class Details
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TimeIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Time: {selectedSlot.hour}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BookIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Subject: {selectedSlot.subject}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ClassIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Class: {selectedSlot.class}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarTodayIcon sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Day: {selectedDay}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Show available teachers for this slot */}
          {selectedSlot && (() => {
            const availableTeachers = getAvailableTeachers(selectedDay, selectedSlot.hour, selectedSlot.subject);
            return (
              <Box sx={{ mt: 1, mb: 4, p: 3, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: '#10b981' }}>
                  <PersonSearchIcon />
                  Available Teachers ({availableTeachers.length})
                </Typography>
                {availableTeachers.length > 0 ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      The system will automatically send requests to these teachers based on priority
                    </Typography>
                    <Grid container spacing={2}>
                      {availableTeachers.slice(0, 6).map((teacher) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={teacher.id}>
                          <Box sx={{ 
                            p: 2, 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            borderRadius: '8px',
                            border: teacher.subject === selectedSlot.subject ? '2px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {teacher.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              {teacher.subject} • {teacher.freeHours} free hours
                            </Typography>
                            {teacher.subject === selectedSlot.subject && (
                              <Chip 
                                label="Same Subject" 
                                size="small" 
                                color="success" 
                                sx={{ mt: 0.5, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </Grid>
                      ))}
                      {availableTeachers.length > 6 && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            +{availableTeachers.length - 6} more teachers available
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </>
                ) : (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    No teachers are currently available for this time slot. Your request will be sent as an emergency notification.
                  </Alert>
                )}
              </Box>
            );
          })()}
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            📝 Reason for Substitution
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Detailed Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a detailed reason for requesting substitution. Include any specific instructions for the substitute teacher..."
            sx={{
              mb: 3,
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

          <Alert severity="info" sx={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              🤖 How Smart Substitution Works:
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              <strong>Priority 1:</strong> Same subject teachers (higher chance of acceptance)<br/>
              <strong>Priority 2:</strong> Teachers with most free hours that day<br/>
              <strong>Emergency Alert:</strong> If no one accepts, emergency notification will be sent 1 hour before class<br/>
              <strong>Real-time Updates:</strong> You'll receive notifications when teachers respond
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          gap: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          justifyContent: 'flex-end'
        }}>
          <Button 
            onClick={() => setSubstitutionDialog(false)}
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
            onClick={handleRequestSubstitution} 
            variant="contained"
            size="large"
            disabled={!reason.trim()}
            startIcon={<SendIcon />}
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
            Send Substitution Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartSubstitution;
