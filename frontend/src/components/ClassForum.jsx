import React, { useState, useRef } from 'react';
import {
    Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Avatar, Chip, IconButton, Card, CardContent, CardActions, Tab, Tabs,
    InputAdornment, Select, FormControl, MenuItem
} from '@mui/material';
import toast from 'react-hot-toast';

// Icons
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReplyIcon from '@mui/icons-material/Reply';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

// Simple date formatting function
const formatDistanceToNow = (date) => {
    try {
        const now = new Date();
        const diffInMs = now - new Date(date);
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInDays === 1) return 'yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        
        return new Date(date).toLocaleDateString();
    } catch (error) {
        return 'recently';
    }
};

// Mock data for forum messages
const mockMessages = [
    {
        id: 1,
        type: 'announcement',
        author: {
            id: 1,
            name: 'Dr. Sarah Johnson',
            role: 'teacher',
            subject: 'Mathematics'
        },
        content: 'Important: Math test scheduled for next Friday, October 15th. Please review chapters 4-6 in your textbook.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        replies: 3,
        pinned: true,
        tags: ['test', 'important']
    },
    {
        id: 2,
        type: 'question',
        author: {
            id: 2,
            name: 'Alex Johnson',
            role: 'student',
            class: '10-A'
        },
        content: 'Can someone explain the quadratic formula step by step? I\'m having trouble with the discriminant part.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 5,
        replies: 8,
        pinned: false,
        tags: ['homework', 'help']
    },
    {
        id: 3,
        type: 'discussion',
        author: {
            id: 3,
            name: 'Emma Davis',
            role: 'student',
            class: '10-A'
        },
        content: 'Did anyone notice the beautiful mathematical patterns in today\'s geometry lesson? The golden ratio appearing in nature is fascinating!',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likes: 15,
        replies: 6,
        pinned: false,
        tags: ['discussion', 'geometry']
    }
];

const ClassForum = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [messageType, setMessageType] = useState('discussion');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const tabLabels = ['All Posts', 'Announcements', 'Questions', 'Discussions'];

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg = {
            id: Date.now(),
            type: messageType,
            author: {
                id: 999,
                name: 'Current User',
                role: 'teacher',
                subject: 'Mathematics'
            },
            content: newMessage,
            timestamp: new Date(),
            likes: 0,
            replies: 0,
            pinned: false,
            tags: messageType === 'announcement' ? ['important'] : ['general']
        };

        setMessages([newMsg, ...messages]);
        setNewMessage('');
        toast.success('Message posted successfully!');
    };

    const handleLike = (messageId) => {
        setMessages(messages.map(msg => 
            msg.id === messageId 
                ? { ...msg, likes: msg.likes + 1 }
                : msg
        ));
    };

    const getFilteredMessages = () => {
        let filtered = messages;

        // Filter by tab
        if (currentTab === 1) filtered = filtered.filter(msg => msg.type === 'announcement');
        else if (currentTab === 2) filtered = filtered.filter(msg => msg.type === 'question');
        else if (currentTab === 3) filtered = filtered.filter(msg => msg.type === 'discussion');

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(msg => 
                msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.author.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort: pinned first, then by timestamp
        return filtered.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
    };

    const getMessageTypeIcon = (type) => {
        switch (type) {
            case 'announcement':
                return <AnnouncementIcon sx={{ color: '#f59e0b' }} />;
            case 'question':
                return <QuestionAnswerIcon sx={{ color: '#3b82f6' }} />;
            default:
                return <ForumIcon sx={{ color: '#10b981' }} />;
        }
    };

    const getMessageTypeColor = (type) => {
        switch (type) {
            case 'announcement':
                return 'warning';
            case 'question':
                return 'info';
            default:
                return 'success';
        }
    };

    const MessageCard = ({ message }) => (
        <Card sx={{ 
            mb: 2, 
            background: message.pinned 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05))'
                : 'rgba(255, 255, 255, 0.05)',
            border: message.pinned 
                ? '1px solid rgba(245, 158, 11, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
        }}>
            {message.pinned && (
                <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8,
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '50%',
                    p: 0.5
                }}>
                    <PushPinIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                </Box>
            )}
            
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar 
                        sx={{ 
                            bgcolor: message.author.role === 'teacher' ? '#10b981' : '#3b82f6',
                            width: 48,
                            height: 48
                        }}
                    >
                        {message.author.role === 'teacher' ? <SchoolIcon /> : <PersonIcon />}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {message.author.name}
                            </Typography>
                            <Chip 
                                size="small"
                                label={message.author.role === 'teacher' ? 'Teacher' : 'Student'}
                                color={message.author.role === 'teacher' ? 'success' : 'primary'}
                                sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                            <Chip 
                                size="small"
                                icon={getMessageTypeIcon(message.type)}
                                label={message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                                color={getMessageTypeColor(message.type)}
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            {formatDistanceToNow(message.timestamp)}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {message.content}
                        </Typography>
                        
                        {message.tags && message.tags.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                                {message.tags.map((tag, index) => (
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
                    </Box>
                    
                    <IconButton size="small">
                        <MoreVertIcon />
                    </IconButton>
                </Box>
            </CardContent>
            
            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button 
                    size="small" 
                    startIcon={<ThumbUpOutlinedIcon />}
                    onClick={() => handleLike(message.id)}
                    sx={{ color: 'text.secondary' }}
                >
                    {message.likes}
                </Button>
                <Button 
                    size="small" 
                    startIcon={<ReplyIcon />}
                    onClick={() => setSelectedMessage(message)}
                    sx={{ color: 'text.secondary' }}
                >
                    Reply ({message.replies})
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <Box sx={{ p: 3, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3
            }}>
                <Box>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                    }}>
                        <ForumIcon />
                        Class Forum
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Collaborate, ask questions, and stay updated with your class
                    </Typography>
                </Box>
                
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ 
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #059669, #047857)'
                        }
                    }}
                    onClick={() => setSelectedMessage({ id: 'new' })}
                >
                    New Post
                </Button>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search messages..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>

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

            {/* Messages Area */}
            <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                pr: 1,
                maxHeight: '60vh'
            }}>
                {getFilteredMessages().length === 0 ? (
                    <Paper sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <ForumIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                            No messages found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {searchQuery ? 'Try adjusting your search terms' : 'Start a conversation by posting the first message!'}
                        </Typography>
                    </Paper>
                ) : (
                    getFilteredMessages().map((message) => (
                        <MessageCard key={message.id} message={message} />
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Quick Message Input */}
            <Paper sx={{ 
                p: 2, 
                mt: 2,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={3}
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={messageType}
                                onChange={(e) => setMessageType(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="discussion">Discussion</MenuItem>
                                <MenuItem value="question">Question</MenuItem>
                                <MenuItem value="announcement">Announcement</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                            sx={{ 
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #059669, #047857)'
                                }
                            }}
                        >
                            <SendIcon />
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Reply Dialog */}
            <Dialog 
                open={selectedMessage !== null} 
                onClose={() => setSelectedMessage(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.90))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        minHeight: '500px'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    pb: 1, 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {selectedMessage?.id === 'new' ? <AddIcon color="primary" /> : <ReplyIcon color="primary" />}
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {selectedMessage?.id === 'new' ? 'Create New Post' : 'Reply to Message'}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                        {selectedMessage?.id === 'new' 
                            ? 'Share your thoughts, questions, or announcements with the class' 
                            : `Replying to ${selectedMessage?.author?.name || 'message'}`
                        }
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-track": { background: "rgba(255, 255, 255, 0.1)", borderRadius: "4px" }, "&::-webkit-scrollbar-thumb": { background: "rgba(255, 255, 255, 0.3)", borderRadius: "4px", "&:hover": { background: "rgba(255, 255, 255, 0.5)" } } }}>
                    {selectedMessage?.id === 'new' && (
                        <Box sx={{ mt: 1, mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                Post Type
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    value={messageType}
                                    onChange={(e) => setMessageType(e.target.value)}
                                    sx={{
                                        '& .MuiSelect-select': {
                                            py: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }
                                    }}
                                >
                                    <MenuItem value="discussion">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ForumIcon sx={{ color: '#10b981' }} />
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>Discussion</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    General discussion or sharing thoughts
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="question">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <QuestionAnswerIcon sx={{ color: '#3b82f6' }} />
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>Question</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    Ask for help or clarification
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value="announcement">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AnnouncementIcon sx={{ color: '#f59e0b' }} />
                                            <Box>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>Announcement</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    Important information for the class
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}
                    
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        {selectedMessage?.id === 'new' ? 'Message Content' : 'Your Reply'}
                    </Typography>
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={selectedMessage?.id === 'new' ? 8 : 6}
                        placeholder={selectedMessage?.id === 'new' 
                            ? 'Write your message here... Share your thoughts, ask questions, or make announcements.' 
                            : 'Write your reply here... Be helpful and constructive in your response.'
                        }
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        variant="outlined"
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
                    
                    {selectedMessage?.id === 'new' && (
                        <Box sx={{ mt: 3, p: 3, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: '#10b981', fontWeight: 600 }}>
                                💡 Posting Tips
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                • Be clear and specific in your communication<br/>
                                • Use proper formatting and check your spelling<br/>
                                • Tag important announcements appropriately<br/>
                                • Keep discussions respectful and constructive
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                
                <DialogActions sx={{ 
                    p: 3, 
                    gap: 2,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap'
                }}>
                    <Button 
                        onClick={() => setSelectedMessage(null)}
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
                        size="large"
                        onClick={() => {
                            if (selectedMessage?.id === 'new') {
                                setNewMessage(replyText);
                                setTimeout(handleSendMessage, 100);
                            }
                            setReplyText('');
                            setSelectedMessage(null);
                            toast.success('Posted successfully!');
                        }}
                        disabled={!replyText.trim()}
                        startIcon={selectedMessage?.id === 'new' ? <SendIcon /> : <ReplyIcon />}
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
                        {selectedMessage?.id === 'new' ? 'Post Message' : 'Send Reply'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClassForum;
