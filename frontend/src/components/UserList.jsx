import { Box, Typography, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function UserList({ title, users, onDelete }) {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <List sx={{ background: 'rgba(45, 45, 45, 0.75)', borderRadius: '8px' }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(user.id)}>
                <DeleteIcon sx={{ color: '#A0A0A0' }} />
              </IconButton>
            }
          >
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default UserList;