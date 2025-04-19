import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Divider, 
  CircularProgress, 
  Container,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import ConversationList from '../components/chat/ConversationList';
import ChatMessage from '../components/chat/ChatMessage';
import MessageInput from '../components/chat/MessageInput';
import { getConversation, getMessages, markMessagesAsRead, resetConversationState } from '../store/actions/messageActions';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { 
    currentConversation, 
    messages, 
    conversationsLoading, 
    messagesLoading 
  } = useSelector(state => state.messages);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load conversation when ID changes
  useEffect(() => {
    if (conversationId) {
      dispatch(getConversation(conversationId));
      dispatch(getMessages(conversationId));
      
      // Mark messages as read when viewing conversation
      dispatch(markMessagesAsRead(conversationId));
    }
    
    // Cleanup when unmounting
    return () => {
      dispatch(resetConversationState());
    };
  }, [dispatch, conversationId]);

  if (!isAuthenticated) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          height: 'calc(100vh - 200px)', 
          display: 'flex', 
          overflow: 'hidden' 
        }}
      >
        {/* Conversation list - hide on mobile when viewing a conversation */}
        {(!isMobile || !conversationId) && (
          <Box 
            sx={{ 
              width: isMobile ? '100%' : 300, 
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowY: 'auto'
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6">Conversations</Typography>
            </Box>
            <ConversationList />
          </Box>
        )}
        
        {/* Chat area */}
        {(!isMobile || conversationId) && (
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {conversationId ? (
              <>
                {/* Chat header */}
                <Box 
                  sx={{ 
                    p: 2, 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {isMobile && (
                    <IconButton 
                      edge="start" 
                      onClick={() => navigate('/messages')}
                      sx={{ mr: 1 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  
                  {conversationsLoading ? (
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                  ) : (
                    <Typography variant="h6">
                      {currentConversation?.participants
                        .find(p => p._id !== user?._id)?.name || 'Chat'}
                    </Typography>
                  )}
                </Box>
                
                {/* Messages area */}
                <Box 
                  sx={{ 
                    flexGrow: 1, 
                    p: 2, 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse' // Show newest messages at the bottom
                  }}
                >
                  {messagesLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : messages && messages.length > 0 ? (
                    <Box>
                      {messages.map(message => (
                        <ChatMessage key={message._id} message={message} />
                      ))}
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        height: '100%' 
                      }}
                    >
                      <Typography color="textSecondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                {/* Message input */}
                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <MessageInput conversationId={conversationId} />
                </Box>
              </>
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  p: 3 
                }}
              >
                <Typography variant="h6" color="textSecondary" align="center">
                  Select a conversation or start a new one.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ChatPage; 