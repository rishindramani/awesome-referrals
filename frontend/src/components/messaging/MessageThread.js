import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Typography, 
  Avatar, 
  TextField, 
  Button, 
  CircularProgress,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Send as SendIcon,
  AttachFile as AttachIcon 
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import EmptyState from '../common/EmptyState';

const MessageThread = ({ 
  conversation, 
  messages, 
  loading, 
  onSendMessage, 
  currentUserId 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const otherUser = conversation.users.find(user => user.id !== currentUserId);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Conversation Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar 
          src={otherUser?.profile?.avatar_url}
          alt={`${otherUser?.first_name} ${otherUser?.last_name}`}
          sx={{ mr: 2 }}
        >
          {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {otherUser?.first_name} {otherUser?.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {otherUser?.profile?.current_position || 'No title'}
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Start the conversation by sending a message"
          icon="chat"
          height="calc(100% - 144px)" // 72px for header + 72px for input
        />
      ) : (
        <Box 
          sx={{ 
            p: 2, 
            flexGrow: 1, 
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUserId;
            const showAvatar = index === 0 || 
              messages[index - 1].sender_id !== message.sender_id;
            
            return (
              <Box 
                key={message.id}
                sx={{ 
                  display: 'flex', 
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                {!isCurrentUser && showAvatar && (
                  <Avatar 
                    src={otherUser?.profile?.avatar_url}
                    alt={`${otherUser?.first_name} ${otherUser?.last_name}`}
                    sx={{ mr: 1, width: 36, height: 36 }}
                  >
                    {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                  </Avatar>
                )}
                
                {!isCurrentUser && !showAvatar && <Box sx={{ width: 36, mr: 1 }} />}
                
                <Box>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      maxWidth: '70%',
                      borderRadius: 2,
                      backgroundColor: isCurrentUser ? 'primary.main' : 'grey.100',
                      color: isCurrentUser ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography variant="body1">{message.content}</Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block', 
                      mt: 0.5,
                      ml: 1,
                      textAlign: isCurrentUser ? 'right' : 'left'
                    }}
                  >
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </Typography>
                </Box>
                
                {isCurrentUser && showAvatar && (
                  <Avatar 
                    sx={{ ml: 1, width: 36, height: 36 }}
                  >
                    {currentUserId.substring(0, 2)}
                  </Avatar>
                )}
                
                {isCurrentUser && !showAvatar && <Box sx={{ width: 36, ml: 1 }} />}
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* Message Input */}
      <Divider />
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <IconButton size="small" sx={{ mr: 1 }}>
          <AttachIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type a message..."
          multiline
          maxRows={4}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!newMessage.trim()}
          onClick={handleSendMessage}
          sx={{ ml: 1, minWidth: 0, width: 40, height: 40, p: 0 }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

MessageThread.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      profile: PropTypes.shape({
        avatar_url: PropTypes.string,
        current_position: PropTypes.string
      })
    })).isRequired
  }).isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    sender_id: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired
  })),
  loading: PropTypes.bool,
  onSendMessage: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired
};

export default MessageThread; 