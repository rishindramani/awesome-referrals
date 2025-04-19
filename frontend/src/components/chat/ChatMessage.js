import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message }) => {
  const { user } = useSelector(state => state.auth);
  
  // Determine if message is from the current user
  const isCurrentUser = message.sender._id === user?._id;
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      {!isCurrentUser && (
        <Avatar 
          src={message.sender.avatar} 
          alt={message.sender.name}
          sx={{ mr: 1, width: 36, height: 36 }}
        >
          {message.sender.name.charAt(0)}
        </Avatar>
      )}
      
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: isCurrentUser ? 'primary.main' : 'background.paper',
            color: isCurrentUser ? 'white' : 'text.primary'
          }}
        >
          <Typography variant="body1">{message.content}</Typography>
          
          {message.attachments && message.attachments.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {message.attachments.map((attachment, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <a 
                    href={attachment.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: isCurrentUser ? 'white' : 'primary.main',
                      textDecoration: 'none' 
                    }}
                  >
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* File icon based on type could be added here */}
                      {attachment.fileName} ({(attachment.fileSize / 1024).toFixed(2)} KB)
                    </Typography>
                  </a>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
        
        <Typography 
          variant="caption" 
          color="textSecondary"
          sx={{ 
            display: 'block',
            textAlign: isCurrentUser ? 'right' : 'left',
            mt: 0.5
          }}
        >
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          {message.isRead && isCurrentUser && (
            <span style={{ marginLeft: '5px' }}>• Read</span>
          )}
        </Typography>
      </Box>
      
      {isCurrentUser && (
        <Avatar 
          src={user.avatar} 
          alt={user.name}
          sx={{ ml: 1, width: 36, height: 36 }}
        >
          {user.name.charAt(0)}
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage; 