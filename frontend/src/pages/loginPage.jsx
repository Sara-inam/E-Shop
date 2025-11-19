import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',  // <-- paste your backend login URL here
                formData
            );

            // If backend returns success
            if (response.data.success) {

                // ⭐ SAVE TOKEN IN LOCAL STORAGE
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                }

                // Redirect to homepage
                navigate('/home');
            } 
            else {
                setErrorMsg(response.data.message || 'Invalid credentials');
            }

        } catch (err) {
            setErrorMsg('Email or password is incorrect.');
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
                p: 2,
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
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
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

                    {errorMsg && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {errorMsg}
                        </Typography>
                    )}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={true}
                                inputProps={{ 'aria-label': 'remember me checkbox' }}
                            />
                        }
                        label="Remember me"
                        sx={{ mt: 1 }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>

                    <Typography
                        variant="body2"
                        textAlign="center"
                        sx={{ mt: 2 }}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}
                        >
                            Sign up here
                        </Link>
                    </Typography>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
