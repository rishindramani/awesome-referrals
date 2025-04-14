import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Divider, 
  CircularProgress,
  Alert,
  FormControl,
  FormHelperText,
  Grid
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Send as SendIcon } from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthContext';
import { useDispatch } from 'react-redux';
import { setAlert } from '../../store/actions/uiActions';
import apiService from '../../services/apiService';

const validationSchema = Yup.object({
  message: Yup.string()
    .required('Please include a message with your request')
    .min(20, 'Message should be at least 20 characters')
    .max(1000, 'Message should not exceed 1000 characters'),
  resume_url: Yup.string()
    .url('Must be a valid URL to your resume')
    .nullable(),
  linkedin_profile: Yup.string()
    .url('Must be a valid LinkedIn URL')
    .nullable()
});

const ReferralRequestForm = ({ jobId, referrerId, companyName, jobTitle, onSuccess }) => {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      message: '',
      resume_url: user?.profile?.resume_url || '',
      linkedin_profile: user?.profile?.linkedin_profile || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // Create referral request payload
        const requestData = {
          job_id: jobId,
          referrer_id: referrerId,
          message: values.message,
          resume_url: values.resume_url || null,
          linkedin_profile: values.linkedin_profile || null
        };
        
        // Call API to send referral request
        await apiService.referrals.create(requestData);
        
        // Handle success
        setSuccess(true);
        setLoading(false);
        dispatch(setAlert('Referral request sent successfully', 'success'));
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to send referral request';
        setError(errorMessage);
        dispatch(setAlert(errorMessage, 'error'));
        setLoading(false);
      }
    }
  });

  if (success) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Your referral request has been sent successfully!
        </Alert>
        <Typography variant="body1" paragraph>
          We've notified the referrer about your request. They will review your profile and get back to you soon.
        </Typography>
        <Button 
          variant="outlined" 
          onClick={() => {
            setSuccess(false);
            formik.resetForm();
          }}
        >
          Send Another Request
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Request a Referral for {jobTitle} at {companyName}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.message && Boolean(formik.errors.message)}>
              <TextField
                id="message"
                name="message"
                label="Your Message to the Referrer"
                multiline
                rows={4}
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.message && Boolean(formik.errors.message)}
                disabled={loading}
                placeholder="Introduce yourself and explain why you're a good fit for this position. Be specific about your relevant skills and experience."
              />
              {formik.touched.message && formik.errors.message && (
                <FormHelperText>{formik.errors.message}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={formik.touched.resume_url && Boolean(formik.errors.resume_url)}>
              <TextField
                id="resume_url"
                name="resume_url"
                label="Link to Your Resume (Optional)"
                value={formik.values.resume_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.resume_url && Boolean(formik.errors.resume_url)}
                disabled={loading}
                placeholder="https://drive.google.com/your-resume"
              />
              {formik.touched.resume_url && formik.errors.resume_url && (
                <FormHelperText>{formik.errors.resume_url}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={formik.touched.linkedin_profile && Boolean(formik.errors.linkedin_profile)}>
              <TextField
                id="linkedin_profile"
                name="linkedin_profile"
                label="LinkedIn Profile URL (Optional)"
                value={formik.values.linkedin_profile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.linkedin_profile && Boolean(formik.errors.linkedin_profile)}
                disabled={loading}
                placeholder="https://linkedin.com/in/your-profile"
              />
              {formik.touched.linkedin_profile && formik.errors.linkedin_profile && (
                <FormHelperText>{formik.errors.linkedin_profile}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !formik.isValid}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              >
                {loading ? 'Sending...' : 'Send Referral Request'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

ReferralRequestForm.propTypes = {
  jobId: PropTypes.string.isRequired,
  referrerId: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  jobTitle: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default ReferralRequestForm; 