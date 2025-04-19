import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Divider, 
  CircularProgress, 
  Box 
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { getConversations } from '../../store/actions/messageActions';

const ConversationList = () => {
  const dispatch = useDispatch();
  const { conversations, conversationsLoading } = useSelector(state => state.messages);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  // If no user is logged in, return null
  if (!user) return null;

  // Show loading spinner if conversations are loading
  if (conversationsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  // If no conversations, show a message
  if (!conversations || conversations.length === 0) {
    return (
      <Box p={2} textAlign="center">
        <Typography variant="body1">No conversations yet.</Typography>
      </Box>
    );
  }

  return (
    <List>
      {conversations.map(conversation => {
        // Determine the other user in the conversation
        const otherUser = conversation.participants.find(
          participant => participant._id !== user._id
        );

        // Get the last message
        const lastMessage = conversation.lastMessage;
        
        return (
          <React.Fragment key={conversation._id}>
            <ListItem 
              button 
              component={Link} 
              to={`/messages/${conversation._id}`}
              alignItems="flex-start"
            >
              <ListItemAvatar>
                <Avatar 
                  src={otherUser?.avatar} 
                  alt={otherUser?.name || 'User'}
                >
                  {otherUser?.name?.charAt(0) || 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component="span" variant="body1" fontWeight={conversation.unreadCount > 0 ? 'bold' : 'normal'}>
                    {otherUser?.name || 'User'}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                      sx={{ 
                        display: 'inline',
                        fontWeight: conversation.unreadCount > 0 ? 'bold' : 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px'
                      }}
                    >
                      {lastMessage?.content || 'No messages yet'}
                    </Typography>
                    {lastMessage?.createdAt && (
                      <Typography component="span" variant="caption" color="textSecondary" sx={{ float: 'right' }}>
                        {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                      </Typography>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          textAlign: 'center',
                          lineHeight: '20px',
                          fontSize: '0.75rem',
                          ml: 1
                        }}
                      >
                        {conversation.unreadCount}
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default ConversationList; 