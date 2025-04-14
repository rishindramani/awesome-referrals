import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  TextField,
  Button,
  Chip,
  Paper,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LinkedIn as LinkedInIcon,
  Camera as CameraIcon
} from '@mui/icons-material';
import { useForm } from '../../hooks';
import { validation } from '../../utils';

const ProfileForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  error = null
}) => {
  const [skillInput, setSkillInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Initialize form with custom hook
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    handleSubmit,
    setFormValues
  } = useForm(
    initialData,
    async (formData) => {
      // If there's a file upload, we need to handle it specially
      if (avatarPreview) {
        const profileData = { ...formData, profile_picture: avatarPreview };
        await onSubmit(profileData);
      } else {
        await onSubmit(formData);
      }
    },
    (values) => validation.validateForm(values, validation.profileValidation)
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !values.skills.includes(skillInput.trim())) {
      setFormValues({
        skills: [...values.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormValues({
      skills: values.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar
            src={avatarPreview || values.profile_picture_url}
            alt={`${values.first_name} ${values.last_name}`}
            sx={{ width: 120, height: 120 }}
          />
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-upload">
            <IconButton
              aria-label="upload picture"
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <CameraIcon />
            </IconButton>
          </label>
        </Box>
        
        {values.linkedin_verified && (
          <Chip
            icon={<LinkedInIcon />}
            label="LinkedIn Verified"
            color="primary"
            size="small"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="first_name"
            name="first_name"
            label="First Name"
            value={values.first_name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.first_name && Boolean(errors.first_name)}
            helperText={touched.first_name && errors.first_name}
            margin="normal"
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="last_name"
            name="last_name"
            label="Last Name"
            value={values.last_name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.last_name && Boolean(errors.last_name)}
            helperText={touched.last_name && errors.last_name}
            margin="normal"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            value={values.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            margin="normal"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="headline"
            name="headline"
            label="Headline"
            value={values.headline || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.headline && Boolean(errors.headline)}
            helperText={touched.headline && errors.headline}
            margin="normal"
            placeholder="e.g. Senior Software Engineer at Google"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="bio"
            name="bio"
            label="Bio"
            value={values.bio || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.bio && Boolean(errors.bio)}
            helperText={touched.bio && errors.bio}
            margin="normal"
            multiline
            rows={4}
            placeholder="Tell us about yourself"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="location"
            name="location"
            label="Location"
            value={values.location || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.location && Boolean(errors.location)}
            helperText={touched.location && errors.location}
            margin="normal"
            placeholder="e.g. San Francisco, CA"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            value={values.phone || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone && Boolean(errors.phone)}
            helperText={touched.phone && errors.phone}
            margin="normal"
            placeholder="e.g. (555) 123-4567"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="linkedin_url"
            name="linkedin_url"
            label="LinkedIn Profile URL"
            value={values.linkedin_url || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.linkedin_url && Boolean(errors.linkedin_url)}
            helperText={touched.linkedin_url && errors.linkedin_url}
            margin="normal"
            placeholder="e.g. linkedin.com/in/username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkedInIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          <Box component={Paper} sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                id="skill-input"
                value={skillInput}
                onChange={handleSkillInputChange}
                placeholder="Add a skill (e.g. JavaScript, Project Management)"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleAddSkill}
                startIcon={<AddIcon />}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {values.skills && values.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => handleRemoveSkill(skill)}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {(!values.skills || values.skills.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  No skills added yet
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          startIcon={<CancelIcon />}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
          disabled={loading}
        >
          Save Changes
        </Button>
      </Box>
    </form>
  );
};

ProfileForm.propTypes = {
  initialData: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    headline: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    profile_picture_url: PropTypes.string,
    linkedin_verified: PropTypes.bool,
    linkedin_url: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default ProfileForm; 