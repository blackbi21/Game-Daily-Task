import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Pickaxe } from 'lucide-react';
import { useGamification } from '../../context/GamificationContext';
import { WalletCard } from '../Dashboard/WalletCard';
import { OperatingScore } from '../Dashboard/OperatingScore';
import { StreakRank } from '../Dashboard/StreakRank';
import { LeadList } from '../Leads/LeadList';

export const HomeView = () => {
    const { state, simulateGoldMineCronjob, simulateRevokeCronjob } = useGamification();

    return (
        <Box sx={{ pb: 4 }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, mt: 1 }}>
                <Box>
                    <Typography variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Chào buổi sáng,
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-background)', fontWeight: 'bold' }}>
                        {state.profile?.name || 'Nhân viên Vucar'}
                    </Typography>
                </Box>
                <StreakRank />
            </Box>

            {/* Main Stats Area */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <WalletCard />
                <OperatingScore />
            </Box>

            {/* Actionable Area */}
            <LeadList />

            {/* Dev Action Area */}
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Button
                    variant="text"
                    sx={{ color: '#FFB300', textTransform: 'none', fontWeight: 'bold' }}
                    startIcon={<Pickaxe size={18} />}
                    onClick={simulateGoldMineCronjob}
                >
                    [Dev Action] Chạy Máy Đào Vàng
                </Button>
                <Button
                    variant="text"
                    sx={{ color: 'var(--md-sys-color-error)', textTransform: 'none', fontWeight: 'bold' }}
                    onClick={simulateRevokeCronjob}
                >
                    [Dev Action] Chạy Máy Thu Hồi Lead
                </Button>
            </Box>
        </Box>
    );
};
