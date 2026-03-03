import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { LocalFireDepartment as LocalFireDepartmentIcon, Star as StarIcon } from '@mui/icons-material';
import { useGamification } from '../../context/GamificationContext';

export const StreakRank: React.FC = () => {
    const { state } = useGamification();
    const profile = state.profile;

    if (!profile) return null;

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
                icon={<LocalFireDepartmentIcon fontSize="small" />}
                label={`${profile.streak_count} Ngày`}
                size="small"
                sx={{
                    backgroundColor: 'var(--md-sys-color-error-container)',
                    color: 'var(--md-sys-color-on-error-container)',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': {
                        color: 'var(--md-sys-color-error)'
                    }
                }}
            />
            <Chip
                icon={<StarIcon sx={{ color: 'var(--md-sys-color-primary) !important' }} />}
                label={
                    <Typography variant="labelLarge" sx={{ fontWeight: 'bold' }}>
                        {profile.rank}
                    </Typography>
                }
                sx={{
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    borderRadius: 2,
                    '& .MuiChip-icon': {
                        marginLeft: '8px',
                    }
                }}
            />
        </Box>
    );
};
