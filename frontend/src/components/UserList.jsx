import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function UserList({ title, users, onDelete, userRole }) {
  return (
    <Box sx={{ p: 3, background: 'rgba(45, 45, 45, 0.75)', borderRadius: '8px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              userRole === 'teacher' ? (
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user.id)}>
                  <DeleteIcon sx={{ color: '#A0A0A0' }} />
                </IconButton>
              ) : null
            }
            sx={{ background: 'rgba(30, 30, 30, 0.6)', mb: 1, borderRadius: '4px' }}
          >
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default UserList;