import { apiService } from '../../services/apiService';
import { setAlert } from './uiActions';
import {
  SET_CONVERSATIONS,
  SET_CURRENT_CONVERSATION,
  SET_CONVERSATION_LOADING,
  SET_MESSAGES,
  ADD_MESSAGE,
  SET_MESSAGES_LOADING,
  RESET_CONVERSATION_STATE,
  MESSAGE_ERROR
} from './actionTypes';

/**
 * Load all conversations for the current user
 */
export const getConversations = () => async (dispatch) => {
  try {
    dispatch({ type: SET_CONVERSATION_LOADING });
    
    const response = await apiService.getConversations();
    
    dispatch({
      type: SET_CONVERSATIONS,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch conversations'
    });
    
    dispatch(setAlert('Failed to fetch conversations', 'error'));
    console.error('Error fetching conversations:', error);
    return null;
  }
};

/**
 * Set the current active conversation
 * @param {Object} conversation - The conversation to set as active
 */
export const getConversation = (userId) => async (dispatch) => {
  try {
    dispatch({ type: SET_CONVERSATION_LOADING });
    
    const response = await apiService.getOrCreateConversation(userId);
    
    dispatch({
      type: SET_CURRENT_CONVERSATION,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch conversation'
    });
    
    dispatch(setAlert('Failed to fetch conversation', 'error'));
    console.error('Error fetching conversation:', error);
    return null;
  }
};

/**
 * Load messages for a specific conversation
 * @param {string} conversationId - The ID of the conversation
 */
export const getMessages = (conversationId, page = 1, limit = 20) => async (dispatch) => {
  try {
    dispatch({ type: SET_MESSAGES_LOADING });
    
    const response = await apiService.getMessages(conversationId, page, limit);
    
    dispatch({
      type: SET_MESSAGES,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: error.response?.data?.message || 'Failed to fetch messages'
    });
    
    dispatch(setAlert('Failed to fetch messages', 'error'));
    console.error('Error fetching messages:', error);
    return null;
  }
};

/**
 * Send a new message in the current conversation
 * @param {string} conversationId - The ID of the conversation
 * @param {string} content - The message content
 */
export const sendMessage = (conversationId, content, attachments = [], referralRequestId = null) => async (dispatch) => {
  try {
    const messageData = {
      content,
      attachments,
      referralRequestId
    };
    
    const response = await apiService.sendMessage(conversationId, messageData);
    
    dispatch({
      type: ADD_MESSAGE,
      payload: response.data
    });
    
    return response.data;
  } catch (error) {
    dispatch({
      type: MESSAGE_ERROR,
      payload: error.response?.data?.message || 'Failed to send message'
    });
    
    dispatch(setAlert('Failed to send message', 'error'));
    console.error('Error sending message:', error);
    return null;
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - The ID of the conversation
 */
export const markMessagesAsRead = (conversationId) => async (dispatch) => {
  try {
    const response = await apiService.markMessagesAsRead(conversationId);
    
    // Refresh messages after marking as read
    dispatch(getMessages(conversationId));
    
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    dispatch(setAlert('Failed to mark messages as read', 'error'));
    return null;
  }
};

/**
 * Reset conversation state (used for cleanup)
 */
export const resetConversationState = () => ({
  type: RESET_CONVERSATION_STATE
}); 