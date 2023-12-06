import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signupUserAsync } from '../actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { isMobileDevice } from '../utils';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);

  const [address, setAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setError('Invalid email format');
      return;
    }

    // Concatenate address fields
    const fullAddress = [
      address.address1,
      address.address2,
      address.city,
      address.state,
      address.zipCode,
    ]
      .filter(Boolean)
      .join(', ');

    try {
      // Assuming you have an action or API call to signup a user
      const resp = dispatch(
        signupUserAsync({
          email,
          password,
          firstName,
          lastName,
          address: fullAddress,
        })
      );

      console.log(resp);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError('Signup failed. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Assuming your login route is '/login'
  };

  const isValidEmail = (email) => {
    // Basic email validation: check for "@" and a valid domain suffix
    return /\S+@\S+\.\S+/.test(email);
  };
  
  return (
    <>
      {loading && <Loader />}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: `url("/Login.jpeg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          component="div"
          sx={{
           
            width: isMobileDevice() ? "100%" : "340px",
            padding: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Almost opaque white
            borderRadius: '15px',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.25)', // Soft box shadow
            marginRight: isMobileDevice() ? "0" : "10%",
          }}
        >
          <Typography variant="h5" align="center" mb={3} color="textSecondary">
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box mt={2}>
              <label>
                <input
                  type="checkbox"
                  checked={showAddressFields}
                  onChange={() => setShowAddressFields(!showAddressFields)}
                />{' '}
                Add Address (Optional)
              </label>
            </Box>
            {showAddressFields && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address Line 1"
                  variant="outlined"
                  value={address.address1}
                  onChange={(e) =>
                    setAddress({ ...address, address1: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address Line 2"
                  variant="outlined"
                  value={address.address2}
                  onChange={(e) =>
                    setAddress({ ...address, address2: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="City"
                  variant="outlined"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="State"
                  variant="outlined"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Zip Code"
                  variant="outlined"
                  value={address.zipCode}
                  onChange={(e) =>
                    setAddress({ ...address, zipCode: e.target.value })
                  }
                />
              </>
            )}
            <Button
              style={{ height: '56px' }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Signup
            </Button>
          </form>
          {error && (
            <Typography variant="body2" color="error" align="center" mt={2}>
              {error}
            </Typography>
          )}
          <Typography
            variant="body2"
            align="center"
            mt={2}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleLoginRedirect}
          >
            Back to Login
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Signup;
