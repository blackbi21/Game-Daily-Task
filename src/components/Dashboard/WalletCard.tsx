import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Box, Drawer, Divider, IconButton, Button, Chip } from '@mui/material';
import { Close as CloseIcon, WarningAmber as WarningIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { useGamification } from '../../context/GamificationContext';

export const WalletCard: React.FC = () => {
    const { state, expectedCommission } = useGamification();
    const [animate, setAnimate] = useState(false);
    const [isSheetOpen, setSheetOpen] = useState(false);
    const prevCommissionRef = useRef(expectedCommission);

    const profile = state.profile;

    useEffect(() => {
        if (expectedCommission > prevCommissionRef.current) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500); // Reset animation
        }
        prevCommissionRef.current = expectedCommission;
    }, [expectedCommission]);

    const handleOpenWallet = () => {
        // Tracker: AC 2.3 (Activity Log)
        console.log("Analytics Event [WALLET_DETAIL_VIEWED]:", {
            event_name: 'WALLET_DETAIL_VIEWED',
            properties: {
                sale_id: profile?.id,
                current_os: profile?.current_os,
                timestamp: new Date().toISOString()
            }
        });
        setSheetOpen(true);
    };

    const formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(expectedCommission);
    const baseCommission = profile?.commission_base || 0;
    const formattedBase = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(baseCommission);

    // Score Mocking
    const os = profile?.current_os || 0;
    const isDangerOS = os < 50;
    const timelyScore = (os * 0.6).toFixed(1);
    const contextScore = (os * 0.4).toFixed(1);

    // AC 2.4 - Top 3 Leads làm tụt điểm
    const worstLeads = state.leads
        .filter(l => l.pic_id === profile?.id && l.status !== 'Thành công' && l.status !== 'Thất bại')
        .sort((a, b) => new Date(a.last_update).getTime() - new Date(b.last_update).getTime())
        .slice(0, 3);

    return (
        <>
            <Paper
                elevation={2}
                onClick={handleOpenWallet}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: 'var(--md-sys-color-primary-container)',
                    color: 'var(--md-sys-color-on-primary-container)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transform: animate ? 'scale(1.05)' : 'scale(1)',
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
                    Ví hoa hồng (Dự kiến)
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

                <Typography variant="caption" sx={{ mt: 1, display: 'inline-block', opacity: 0.8 }}>
                    Chạm để xem chi tiết
                </Typography>
            </Paper>

            {/* Bottom Sheet - Wallet Breakdown */}
            <Drawer
                anchor="bottom"
                open={isSheetOpen}
                onClose={() => setSheetOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        p: 3,
                        pb: 5,
                        backgroundColor: 'var(--md-sys-color-surface)',
                        maxHeight: '90vh'
                    }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-on-surface)' }}>
                        Phân rã Thu nhập
                    </Typography>
                    <IconButton onClick={() => setSheetOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, backgroundColor: 'var(--md-sys-color-surface-variant)', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>KPI Hoa hồng Gốc</Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>{formattedBase}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Hệ số Điểm Vận Hành (OS)</Typography>
                        <Typography sx={{ fontWeight: 'bold', color: isDangerOS ? 'var(--md-sys-color-error)' : 'var(--md-sys-color-primary)' }}>
                            x {(os / 100).toFixed(2)}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 1.5, borderColor: 'var(--md-sys-color-outline-variant)' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <Typography sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-on-surface)' }}>Hoa hồng Nhận được</Typography>
                        <Typography variant="h5" sx={{ fontWeight: '900', color: 'var(--md-sys-color-primary)' }}>
                            {formattedValue}
                        </Typography>
                    </Box>
                </Paper>

                {/* Score Breakdown Section */}
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'var(--md-sys-color-on-surface)' }}>
                    Bóc tách Điểm Vận Hành (OS)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'transparent' }}>
                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'block', mb: 0.5 }}>
                            Điểm Kịp thời (S_timely)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-secondary)' }}>
                            {timelyScore}%
                        </Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: 3, border: '1px solid var(--md-sys-color-outline-variant)', backgroundColor: 'transparent' }}>
                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'block', mb: 0.5 }}>
                            Điểm Nội dung (S_context)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-tertiary)' }}>
                            {contextScore}%
                        </Typography>
                    </Paper>
                </Box>

                {/* Edge Case Alert */}
                {isDangerOS && (
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <WarningIcon sx={{ color: 'var(--md-sys-color-error)' }} />
                            <Typography sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-error)' }}>
                                Cảnh báo: Điểm OS tụt dưới Chuẩn (50%)
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Dưới đây là 3 Leads quá hạn (SLA) đang kéo tụt điểm của bạn nhiều nhất. Hãy cập nhật ngay để gỡ điểm:
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {worstLeads.map((lead, idx) => (
                                <Box key={lead.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 2 }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{lead.customer_name}</Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--md-sys-color-error)' }}>Trễ: {Math.floor((Date.now() - new Date(lead.last_update).getTime()) / (1000 * 3600 * 24))} ngày</Typography>
                                    </Box>
                                    <Button size="small" variant="contained" color="error" sx={{ borderRadius: 6, textTransform: 'none', fontWeight: 'bold' }}>
                                        Cập nhật
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}
            </Drawer>
        </>
    );
};

