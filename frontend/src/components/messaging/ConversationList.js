import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Divider,
  Badge, 
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { Search as SearchIcon } from '@mui/icons-material';
import EmptyState from '../common/EmptyState';

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  currentUserId,
  loading = false 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    
    return conversations.filter(conversation => {
      const otherUser = conversation.users.find(user => user.id !== currentUserId);
      return otherUser && (
        otherUser.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        otherUser.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [conversations, searchQuery, currentUserId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Box>
      
      {filteredConversations.length === 0 ? (
        <EmptyState
          title="No conversations"
          description={searchQuery ? "No conversations match your search" : "Start a new conversation"}
          icon="forum"
          height="calc(100% - 72px)"
        />
      ) : (
        <List sx={{ 
          overflow: 'auto',
          height: 'calc(100% - 72px)', // Account for search box height
          p: 0
        }}>
          {filteredConversations.map((conversation) => {
            const otherUser = conversation.users.find(user => user.id !== currentUserId);
            const isSelected = selectedConversation?.id === conversation.id;
            const lastMessage = conversation.last_message;
            
            return (
              <React.Fragment key={conversation.id}>
                <ListItem
                  button
                  selected={isSelected}
                  alignItems="flex-start"
                  onClick={() => onSelectConversation(conversation)}
                  sx={{
                    py: 2,
                    backgroundColor: isSelected ? 'action.selected' : 'background.paper',
                    '&:hover': {
                      backgroundColor: isSelected ? 'action.selected' : 'action.hover',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      badgeContent={conversation.unread_count}
                      color="primary"
                      invisible={conversation.unread_count === 0}
                    >
                      <Avatar 
                        src={otherUser?.profile?.avatar_url}
                        alt={`${otherUser?.first_name} ${otherUser?.last_name}`}
                      >
                        {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography 
                        component="span" 
                        variant="subtitle1" 
                        fontWeight={conversation.unread_count > 0 ? 'bold' : 'regular'}
                      >
                        {otherUser?.first_name} {otherUser?.last_name}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ 
                            display: 'inline',
                            fontWeight: conversation.unread_count > 0 ? 'medium' : 'regular',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {lastMessage?.content || "No messages yet"}
                        </Typography>
                        {lastMessage?.created_at && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: true })}
                          </Typography>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};

ConversationList.propTypes = {
  conversations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      first_name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        avatar_url: PropTypes.string
      })
    })).isRequired,
    last_message: PropTypes.shape({
      content: PropTypes.string,
      created_at: PropTypes.string
    }),
    unread_count: PropTypes.number
  })).isRequired,
  selectedConversation: PropTypes.object,
  onSelectConversation: PropTypes.func.isRequired,
  currentUserId: PropTypes.string.isRequired,
  loading: PropTypes.bool
};

export default ConversationList; 