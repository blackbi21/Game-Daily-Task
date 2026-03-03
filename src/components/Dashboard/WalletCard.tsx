import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useGamification } from '../../context/GamificationContext';

export const WalletCard: React.FC = () => {
    const { expectedCommission } = useGamification();
    const [animate, setAnimate] = useState(false);
    const prevCommissionRef = useRef(expectedCommission);

    useEffect(() => {
        if (expectedCommission > prevCommissionRef.current) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500); // Reset animation
        }
        prevCommissionRef.current = expectedCommission;
    }, [expectedCommission]);

    const formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(expectedCommission);

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: 'var(--md-sys-color-primary-container)',
                color: 'var(--md-sys-color-on-primary-container)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: animate ? 'scale(1.05)' : 'scale(1)', // Micro-animation bounce
                boxShadow: animate ? '0 8px 24px rgba(15, 137, 206, 0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
            }}
        >
            {/* Background Pattern */}
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'var(--md-sys-color-primary)',
                opacity: 0.1,
            }} />

            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, opacity: 0.8 }}>
                Hoa hồng dự kiến
            </Typography>

            <Typography
                variant="h3"
                sx={{
                    fontWeight: '900',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: animate ? 'scale(1.15)' : 'scale(1)',
                    color: animate ? 'var(--md-sys-color-tertiary-container)' : 'inherit',
                }}
            >
                {formattedValue}
            </Typography>

        </Paper>
    );
};
