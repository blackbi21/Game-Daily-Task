import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useGamification } from '../../context/GamificationContext';

export const OperatingScore: React.FC = () => {
    const { state } = useGamification();
    const osRaw = state.profile?.current_os || 0;
    const os = Math.round(osRaw * 10) / 10; // Fix floating-point precision

    // Dynamic color based on OS percentage
    const getColor = (val: number) => {
        if (val < 50) return 'var(--md-sys-color-error)';
        if (val < 80) return 'var(--md-sys-color-tertiary)';
        return 'var(--md-sys-color-primary)';
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 4,
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold' }}>
                    Điểm Vận Hành
                </Typography>
                <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: '900' }}>
                    {Number.isInteger(os) ? os : os.toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--md-sys-color-outline)', mt: 0.5 }}>
                    Mục tiêu: 80%
                </Typography>
            </Box>

            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={64}
                    thickness={5}
                    sx={{ color: 'var(--md-sys-color-outline-variant)' }}
                />
                <CircularProgress
                    variant="determinate"
                    value={os}
                    size={64}
                    thickness={5}
                    sx={{
                        color: getColor(os),
                        position: 'absolute',
                        left: 0,
                        strokeLinecap: 'round',
                        transition: 'stroke-dashoffset 0.5sease-in-out',
                    }}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: getColor(os) }}>
                        {os < 50 ? 'Cần cố gắng' : os < 80 ? 'Đang ổn định' : 'Xuất sắc!'}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};
