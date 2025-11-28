import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import GitHubIcon from '@mui/icons-material/GitHub';
// import GoogleIcon from '@mui/icons-material/Google';
// import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';

const LoginPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: ''
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
                'https://exemption-cornwall-serum-kernel.trycloudflare.com/api/auth/login',
                formData
            );
            console.log(response.data); 
            // console.log(response.data);
            if (response.data.token) {
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem("userRole", response.data.user.role);
                }
                const role = response.data.role || response.data.user?.role; 

                // console.log("Role:", role);

                if (role === 'admin') {
                    navigate("/dashboard");
                } else if (role === "user") {
                    navigate("/"); 
                } else {
                    setErrorMsg("Unknown User");
                }
            }
            else {
                setErrorMsg(response.data.message || 'Invalid credentials');
            }
        } catch (err) {
            setErrorMsg('Email or password is incorrect.');
        }
    };
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 relative p-4">
            <div className="relative w-full max-w-md">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[92%] bg-gradient-to-r from-blue-400 to-blue-600  text-white rounded-2xl shadow-xl py-5 text-center z-10">
                    <h2 className="text-2xl font-semibold">Log in</h2>
                    {/* <div className="flex justify-center gap-8 mt-8 text-white text-2xl">
                        <FacebookOutlinedIcon
                            sx={{
                                fontSize: "20px",
                                color: "white",
                                transition: "0.3s ease",
                                fontWeight: 100,
                                mb: 2,
                                "&:hover": {
                                    color: "#FF5722",
                                    transform: "translateY(-5px)",
                                    cursor: "pointer",
                                }
                            }}
                        />
                        <GitHubIcon
                            sx={{
                                fontSize: "20px",
                                color: "white",
                                transition: "0.3s ease",
                                fontWeight: 100,
                                mb: 2,
                                "&:hover": {
                                    color: "#FF5722",
                                    transform: "translateY(-5px)",
                                    cursor: "pointer",
                                }
                            }}
                        />
                        <GoogleIcon
                            sx={{
                                fontSize: "20px",
                                color: "white",
                                transition: "0.3s ease",
                                fontWeight: 100,
                                mb: 2,
                                "&:hover": {
                                    color: "#FF5722",
                                    transform: "translateY(-5px)",
                                    cursor: "pointer",
                                }
                            }}
                        />
                    </div> */}
                </div>
                <div className="bg-white rounded-2xl shadow-lg pt-28 pb-8 px-6 mt-10">
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        {errorMsg && (
                            <Typography color="error" sx={{ mt: 1 }}>
                                {errorMsg}
                            </Typography>
                        )}
                        <div className="flex items-center mt-1 mb-3">
                            <Checkbox defaultChecked />
                            <span className="text-gray-600">Remember me</span>
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                py: 1.3,
                                mt: 1,
                                borderRadius: "8px",
                                fontWeight: "bold",
                                background: "linear-gradient(to right, #2F80ED, #56CCF2)",
                            }}
                        >
                            Login
                        </Button>
                        <p className="text-center mt-4 text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );

};

export default LoginPage;
