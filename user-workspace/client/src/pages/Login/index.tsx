import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { User, UserRole } from '../../types/user';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// Default credentials for demo purposes
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { login } = useAuth();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUseDemo = () => {
    formik.setValues(DEFAULT_CREDENTIALS);
    setShowDemo(true);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(loginStart());
        // For demo purposes, check against default credentials
        if (values.username === DEFAULT_CREDENTIALS.username && 
            values.password === DEFAULT_CREDENTIALS.password) {
          const mockUser: User = {
            _id: '1',
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            role: UserRole.ADMIN,
            settings: {
              emailNotifications: true,
              darkMode: false,
              language: 'en',
              timezone: 'UTC'
            },
            notifications: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: new Date()
          };
          const mockToken = 'mock-jwt-token';
          
          dispatch(loginSuccess({ token: mockToken, user: mockUser }));
          login(mockToken, mockUser);
          navigate('/dashboard');
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Login failed. Please check your credentials.';
        dispatch(loginFailure(errorMessage));
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={12}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              py: 4,
              px: 2,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: 'white', fontWeight: 'bold' }}
            >
              SMDI
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: 'white', opacity: 0.9 }}
            >
              Smart Monitoring Device Integration
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 6 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {showDemo && (
              <Alert severity="info" sx={{ mb: 3 }}>
                Using demo credentials: 
                <br />
                Username: {DEFAULT_CREDENTIALS.username}
                <br />
                Password: {DEFAULT_CREDENTIALS.password}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={formik.handleSubmit}
            >
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                sx={{ mb: 2 }}
                disabled={loading}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{ mb: 3 }}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mb: 2,
                  height: 48,
                  position: 'relative',
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                ) : (
                  'Login'
                )}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleUseDemo}
                disabled={loading}
              >
                Use Demo Credentials
              </Button>
            </Box>

            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mt: 3 }}
            >
              Only authorized personnel can access this system.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
