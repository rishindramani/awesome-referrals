import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  LinkOff as LinkOffIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Camera as CameraIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

// Sample user data
const userData = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  profile_picture_url: '/avatars/john.jpg',
  headline: 'Senior Software Engineer at Google',
  bio: 'Passionate software engineer with 8+ years of experience in full-stack development. Specializing in React, Node.js, and cloud technologies.',
  location: 'San Francisco, CA',
  phone: '(555) 123-4567',
  linkedin_verified: true,
  linkedin_profile: 'linkedin.com/in/johndoe',
  user_type: 'referrer',
  skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'Python', 'Docker'],
  experience: [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      start_date: '2020-03',
      end_date: null,
      current: true,
      description: 'Leading a team of developers working on cloud infrastructure solutions.'
    },
    {
      id: 2,
      title: 'Software Engineer',
      company: 'Facebook',
      location: 'Menlo Park, CA',
      start_date: '2017-06',
      end_date: '2020-02',
      current: false,
      description: 'Developed and maintained frontend components for the main Facebook app.'
    }
  ],
  education: [
    {
      id: 1,
      school: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      start_date: '2015',
      end_date: '2017'
    },
    {
      id: 2,
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      start_date: '2011',
      end_date: '2015'
    }
  ],
  stats: {
    profile_views: 253,
    referrals_given: 12,
    referrals_received: 5,
    success_rate: 75
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setUser(userData);
      setFormData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        headline: userData.headline,
        bio: userData.bio,
        location: userData.location,
        phone: userData.phone,
        skills: [...userData.skills]
      });
      setLoading(false);
    }, 800);
    
    // In a real app, we would dispatch an action to fetch user profile
    // dispatch(fetchUserProfile());
  }, [dispatch]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const toggleEditMode = () => {
    if (editMode) {
      // Reset form data if canceling edit
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        headline: user.headline,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        skills: [...user.skills]
      });
    }
    setEditMode(!editMode);
  };
  
  const handleSaveProfile = () => {
    // In a real app, we would dispatch an action to update the profile
    // dispatch(updateProfile(formData));
    
    // For demo purposes, update the local state
    setUser({
      ...user,
      ...formData
    });
    setEditMode(false);
  };
  
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
  };
  
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleUpdatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, we would dispatch an action to update the password
    // dispatch(updatePassword(passwordData));
    
    // For demo purposes, just close the dialog
    handleClosePasswordDialog();
    // And maybe show a success message
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (!user) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your personal information
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Left Column - Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={user.profile_picture_url}
                  alt={`${user.first_name} ${user.last_name}`}
                  sx={{ width: 120, height: 120 }}
                >
                  {user.first_name.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                  size="small"
                >
                  <CameraIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                {user.headline}
              </Typography>
              {user.linkedin_verified && (
                <Chip
                  icon={<LinkedInIcon />}
                  label="LinkedIn Verified"
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Profile Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary.main">
                      {user.stats.profile_views}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Profile Views
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: 'success.light', borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {user.stats.success_rate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: 'info.light', borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="info.main">
                      {user.stats.referrals_given}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Referrals Given
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {user.stats.referrals_received}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Referrals Received
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Account Settings
              </Typography>
              <List dense disablePadding>
                <ListItem
                  button
                  onClick={handleOpenPasswordDialog}
                  sx={{ borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText primary="Change Password" />
                </ListItem>
                <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notification Settings" />
                </ListItem>
                {!user.linkedin_verified && (
                  <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <LinkedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="Connect LinkedIn" />
                  </ListItem>
                )}
                {user.linkedin_verified && (
                  <ListItem button sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <LinkOffIcon />
                    </ListItemIcon>
                    <ListItemText primary="Disconnect LinkedIn" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column - Profile Info Tabs */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2 }}>
              <Typography variant="h6" fontWeight="medium">
                Profile Information
              </Typography>
              <Button
                variant={editMode ? "outlined" : "contained"}
                color={editMode ? "secondary" : "primary"}
                startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                onClick={toggleEditMode}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </Box>
            
            <Divider />
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" />
              <Tab icon={<WorkIcon />} iconPosition="start" label="Experience" />
              <Tab icon={<SchoolIcon />} iconPosition="start" label="Education" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* Personal Info Tab */}
              {activeTab === 0 && (
                <>
                  {editMode ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          variant="outlined"
                          value={formData.first_name}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          variant="outlined"
                          value={formData.last_name}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Headline"
                          name="headline"
                          variant="outlined"
                          value={formData.headline}
                          onChange={handleInputChange}
                          placeholder="e.g., Senior Software Engineer at Google"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          variant="outlined"
                          multiline
                          rows={4}
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          variant="outlined"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          variant="outlined"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Location"
                          name="location"
                          variant="outlined"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="e.g., San Francisco, CA"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Skills
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                          {formData.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              onDelete={() => handleRemoveSkill(skill)}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        <Box component="form" onSubmit={handleAddSkill} sx={{ display: 'flex' }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Add a skill"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            variant="outlined"
                          />
                          <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ ml: 1 }}
                            disabled={!skillInput.trim()}
                          >
                            <AddIcon />
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          onClick={handleSaveProfile}
                        >
                          Save Changes
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          About
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {user.bio}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {user.email}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Phone
                          </Typography>
                          <Typography variant="body1">
                            {user.phone}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body1">
                            {user.location}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            LinkedIn Profile
                          </Typography>
                          <Typography variant="body1">
                            {user.linkedin_profile ? (
                              <Link href={`https://${user.linkedin_profile}`} target="_blank" rel="noopener">
                                {user.linkedin_profile}
                              </Link>
                            ) : 'Not connected'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Skills
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {user.skills.map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
              
              {/* Experience Tab */}
              {activeTab === 1 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Work Experience
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      color="primary"
                      size="small"
                    >
                      Add Experience
                    </Button>
                  </Box>
                  
                  {user.experience.map((exp, index) => (
                    <Box key={exp.id} sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2}>
                          <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', width: 64, height: 64 }}>
                            {exp.company.charAt(0)}
                          </Avatar>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="h3" fontWeight="medium">
                              {exp.title}
                            </Typography>
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="subtitle1" color="text.secondary">
                            {exp.company} • {exp.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(exp.start_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short' 
                            })} - {exp.current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short' 
                            })}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        </Grid>
                      </Grid>
                      {index < user.experience.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </>
              )}
              
              {/* Education Tab */}
              {activeTab === 2 && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Education
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      color="primary"
                      size="small"
                    >
                      Add Education
                    </Button>
                  </Box>
                  
                  {user.education.map((edu, index) => (
                    <Box key={edu.id} sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={2}>
                          <Avatar variant="rounded" sx={{ bgcolor: 'info.light', width: 64, height: 64 }}>
                            <SchoolIcon />
                          </Avatar>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" component="h3" fontWeight="medium">
                              {edu.school}
                            </Typography>
                            <IconButton size="small">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="subtitle1">
                            {edu.degree} in {edu.field}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.start_date} - {edu.end_date}
                          </Typography>
                        </Grid>
                      </Grid>
                      {index < user.education.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Password Change Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            To change your password, please enter your current password and then your new password twice.
          </DialogContentText>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClosePasswordDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdatePassword} 
            variant="contained" 
            color="primary"
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 