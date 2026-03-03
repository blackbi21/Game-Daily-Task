import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginView: React.FC = () => {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(username, pin)) {
            navigate('/');
        } else {
            setError('Sai thông tin đăng nhập. Dùng sale01 / vucar123');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',
                backgroundColor: 'var(--md-sys-color-background)',
                px: 3,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: 'var(--md-sys-color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 4,
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': { transform: 'scale(1.05)' },
                    }}
                >
                    {/* Flame or Logo placeholder */}
                    <Typography variant="h3" color="var(--md-sys-color-on-primary)">V</Typography>
                </Box>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-on-background)' }}>
                    Vucar
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 4, textAlign: 'center' }}>
                    Hệ Thống Tăng Trưởng Doanh Số
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Tài khoản"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'var(--md-sys-color-surface-variant)',
                                color: 'var(--md-sys-color-on-surface-variant)',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Mã PIN"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'var(--md-sys-color-surface-variant)',
                                color: 'var(--md-sys-color-on-surface-variant)',
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                            py: 2,
                            borderRadius: 4,
                            backgroundColor: 'var(--md-sys-color-primary)',
                            color: 'var(--md-sys-color-on-primary)',
                            textTransform: 'none',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 14px 0 rgba(15, 137, 206, 0.39)', // using primary blueish theme shadow
                            '&:hover': {
                                backgroundColor: 'var(--md-sys-color-primary-container)',
                                color: 'var(--md-sys-color-on-primary-container)',
                            },
                        }}
                    >
                        Đăng nhập
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};
