import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",  
        formData
      );

      if (response.data.success) {
        setSuccessMsg("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate('/login'); // move to login page after signup success
        }, 1500);
      } else {
        setErrorMsg(response.data.message || "Signup failed.");
      }

    } catch (error) {
      setErrorMsg("Something went wrong. Try again.");
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: 400,
          p: 3,
          border: '1px solid #ddd',
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'white',
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Signup
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <PhoneInput
            country={'us'}
            value={formData.phone}
            onChange={handlePhoneChange}
            enableSearch
            inputStyle={{ width: '100%' }}
            placeholder="Enter phone number"
            required
          />

          <TextField
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {genders.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {/* Error Message */}
          {errorMsg && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errorMsg}
            </Typography>
          )}

          {/* Success Message */}
          {successMsg && (
            <Typography color="green" sx={{ mt: 1 }}>
              {successMsg}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Signup
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignUpPage;
