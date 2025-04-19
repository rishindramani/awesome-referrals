import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Box, 
  TextField, 
  IconButton, 
  CircularProgress,
  Button,
  Paper,
  Typography
} from '@mui/material';
import { 
  Send as SendIcon, 
  AttachFile as AttachFileIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { sendMessage } from '../../store/actions/messageActions';

const MessageInput = ({ conversationId, referralRequestId = null }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);

  const handleInputChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview the files
    const filePreviews = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : null
    }));
    
    setPreviewFiles([...previewFiles, ...filePreviews]);
  };

  const removeFile = (index) => {
    const updatedPreviews = [...previewFiles];
    
    // Revoke object URL if it exists to avoid memory leaks
    if (updatedPreviews[index].preview) {
      URL.revokeObjectURL(updatedPreviews[index].preview);
    }
    
    updatedPreviews.splice(index, 1);
    setPreviewFiles(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && previewFiles.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Process files to the format expected by the API
      const processedAttachments = await Promise.all(
        previewFiles.map(async (fileInfo) => {
          // Here you would typically upload the file to your server/S3
          // and get back a URL. For now, we'll mock this process
          
          // In a real implementation, you'd use something like:
          // const formData = new FormData();
          // formData.append('file', fileInfo.file);
          // const uploadResponse = await apiService.uploadFile(formData);
          // return { fileName: fileInfo.name, fileType: fileInfo.type, fileUrl: uploadResponse.url, fileSize: fileInfo.size };
          
          // Mock implementation:
          return { 
            fileName: fileInfo.name, 
            fileType: fileInfo.type, 
            fileUrl: fileInfo.preview || 'https://example.com/file', 
            fileSize: fileInfo.size 
          };
        })
      );
      
      await dispatch(sendMessage(conversationId, content, processedAttachments, referralRequestId));
      
      // Clear input and files after successful send
      setContent('');
      setPreviewFiles([]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* File previews */}
      {previewFiles.length > 0 && (
        <Paper 
          variant="outlined" 
          sx={{ p: 1, mb: 2, maxHeight: '150px', overflowY: 'auto' }}
        >
          {previewFiles.map((file, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: 'background.paper' 
              }}
            >
              {file.preview ? (
                <Box 
                  component="img" 
                  src={file.preview} 
                  alt={file.name}
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 1, 
                    objectFit: 'cover',
                    mr: 1 
                  }} 
                />
              ) : (
                <AttachFileIcon sx={{ mr: 1 }} />
              )}
              
              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography variant="body2" noWrap>{file.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
              
              <IconButton 
                size="small"
                onClick={() => removeFile(index)}
                aria-label="remove file"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {/* File attachment button */}
        <Button
          component="label"
          sx={{ minWidth: 'auto', p: 1 }}
        >
          <AttachFileIcon />
          <input
            type="file"
            multiple
            hidden
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
        </Button>
        
        {/* Message input */}
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          value={content}
          onChange={handleInputChange}
          disabled={isSubmitting}
          multiline
          maxRows={4}
          sx={{ ml: 1 }}
        />
        
        {/* Send button */}
        <IconButton 
          color="primary" 
          type="submit" 
          disabled={isSubmitting || (!content.trim() && previewFiles.length === 0)}
          sx={{ ml: 1 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageInput; 