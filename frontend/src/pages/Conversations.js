import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Divider, 
  CircularProgress 
} from '@mui/material';
import ConversationList from '../components/messaging/ConversationList';
import MessageThread from '../components/messaging/MessageThread';
import EmptyState from '../components/common/EmptyState';
import { useAuthContext } from '../context/AuthContext';
import { setAlert } from '../store/actions/uiActions';
import apiService from '../services/apiService';

// Helper function to get URL parameters
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Conversations = () => {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const query = useQuery();
  const conversationIdFromUrl = query.get('conversation');
  
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await apiService.messages.getConversations();
        const fetchedConversations = response.data.data.conversations;
        setConversations(fetchedConversations);
        
        // If there's a conversation ID in the URL, select that conversation
        if (conversationIdFromUrl && fetchedConversations.length > 0) {
          const conversation = fetchedConversations.find(c => c.id === conversationIdFromUrl);
          if (conversation) {
            setSelectedConversation(conversation);
          } else {
            dispatch(setAlert('Conversation not found', 'error'));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        dispatch(setAlert('Failed to load conversations', 'error'));
        setLoading(false);
      }
    };

    fetchConversations();
  }, [dispatch, conversationIdFromUrl]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await apiService.messages.getMessages(selectedConversation.id);
        setMessages(response.data.data.messages);
        setLoadingMessages(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        dispatch(setAlert('Failed to load messages', 'error'));
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, dispatch]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      const response = await apiService.messages.sendMessage(
        selectedConversation.id, 
        content
      );
      
      // Add the new message to the list
      setMessages(prevMessages => [...prevMessages, response.data.data.message]);
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(setAlert('Failed to send message', 'error'));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={2} sx={{ height: '75vh', overflow: 'hidden' }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Conversations List */}
            <Grid item xs={12} md={4} lg={3} sx={{ borderRight: 1, borderColor: 'divider', height: '100%' }}>
              <ConversationList 
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
                currentUserId={user?.id}
              />
            </Grid>
            
            {/* Message Thread */}
            <Grid item xs={12} md={8} lg={9} sx={{ height: '100%' }}>
              {selectedConversation ? (
                <MessageThread 
                  conversation={selectedConversation}
                  messages={messages}
                  loading={loadingMessages}
                  onSendMessage={handleSendMessage}
                  currentUserId={user?.id}
                />
              ) : (
                <EmptyState 
                  title="No conversation selected"
                  description="Select a conversation to view messages"
                  icon="chat"
                  height="75vh"
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default Conversations; 