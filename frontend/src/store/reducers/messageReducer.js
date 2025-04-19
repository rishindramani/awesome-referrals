import {
  SET_CONVERSATIONS,
  SET_CURRENT_CONVERSATION,
  SET_CONVERSATION_LOADING,
  SET_MESSAGES,
  ADD_MESSAGE,
  SET_MESSAGES_LOADING,
  RESET_CONVERSATION_STATE,
  MESSAGE_ERROR
} from '../actions/actionTypes';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  conversationsLoading: false,
  messagesLoading: false,
  error: null
};

export default function messageReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_CONVERSATIONS:
      return {
        ...state,
        conversations: payload,
        conversationsLoading: false,
        error: null
      };
    
    case SET_CURRENT_CONVERSATION:
      return {
        ...state,
        currentConversation: payload,
        conversationsLoading: false,
        error: null
      };
    
    case SET_CONVERSATION_LOADING:
      return {
        ...state,
        conversationsLoading: true,
        error: null
      };
    
    case SET_MESSAGES:
      return {
        ...state,
        messages: payload,
        messagesLoading: false,
        error: null
      };
    
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
        error: null
      };
    
    case SET_MESSAGES_LOADING:
      return {
        ...state,
        messagesLoading: true,
        error: null
      };
    
    case MESSAGE_ERROR:
      return {
        ...state,
        conversationsLoading: false,
        messagesLoading: false,
        error: payload
      };
    
    case RESET_CONVERSATION_STATE:
      return initialState;
    
    default:
      return state;
  }
} 