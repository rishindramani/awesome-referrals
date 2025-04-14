import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Link,
  Paper,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { 
  Login as LoginIcon, 
  LinkedIn as LinkedInIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useAuthContext } from '../context/AuthContext';

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
});

const Login = () => {
  const { loading, login } = useAuthContext();

  const handleSubmit = (values) => {
    login(values.email, values.password);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box 
        sx={{ 
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
              Login
            </Typography>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur }) => (
                <Form style={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={loading}
                  />
                  
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    disabled={loading}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading}
                    sx={{ mt: 3, mb: 2 }}
                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LoginIcon />}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                  
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Link component={RouterLink} to="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Box>
                </Form>
              )}
            </Formik>
            
            <Divider sx={{ width: '100%', my: 3 }}>or</Divider>
            
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<LinkedInIcon />}
              sx={{ mb: 2 }}
            >
              Sign in with LinkedIn
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 'bold' }}>
                    Register
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 