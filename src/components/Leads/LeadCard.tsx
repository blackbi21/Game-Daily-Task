import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { Gem } from 'lucide-react';
import { Lead } from '../../context/GamificationContext';

interface LeadCardProps {
    lead: Lead;
    onQuickUpdate: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onQuickUpdate }) => {
    const isNew = lead.status === 'Mới';
    const isSold = lead.status === 'Thành công';

    // Gold mine styling conditions
    const isGold = lead.is_gold_mine;
    const goldColor = '#FFB300';
    const bgGold = 'rgba(255, 179, 0, 0.05)';

    return (
        <Paper
            elevation={isGold ? 2 : 0}
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                backgroundColor: isGold ? bgGold : 'var(--md-sys-color-surface-variant)',
                border: isGold ? `2px solid ${goldColor}` : '2px solid transparent',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                transition: 'all 0.3s ease-in-out',
                ...(isGold && {
                    animation: 'pulseGold 2s infinite',
                    '@keyframes pulseGold': {
                        '0%': { boxShadow: '0 0 0 0 rgba(255, 179, 0, 0.4)' },
                        '70%': { boxShadow: '0 0 0 8px rgba(255, 179, 0, 0)' },
                        '100%': { boxShadow: '0 0 0 0 rgba(255, 179, 0, 0)' }
                    }
                })
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isGold && <Gem size={18} color={goldColor} />}
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: isGold ? goldColor : 'var(--md-sys-color-on-surface)' }}>
                            {lead.customer_name}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        {lead.car_model || 'Chưa rõ dòng xe'}
                    </Typography>
                    {isGold && (
                        <Typography variant="caption" sx={{ color: '#F37021', fontWeight: 'bold', mt: 0.5, display: 'block' }}>
                            ✨ Mỏ vàng x1.5 điểm cày cuốc
                        </Typography>
                    )}
                </Box>
                <Chip
                    label={lead.status}
                    size="small"
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: isNew
                            ? 'var(--md-sys-color-error-container)'
                            : isSold
                                ? 'var(--md-sys-color-primary-container)'
                                : 'var(--md-sys-color-tertiary-container)',
                        color: isNew
                            ? 'var(--md-sys-color-on-error-container)'
                            : isSold
                                ? 'var(--md-sys-color-on-primary-container)'
                                : 'var(--md-sys-color-on-tertiary-container)',
                    }}
                />
            </Box>

            {lead.note && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'var(--md-sys-color-outline)' }}>
                    "{lead.note}"
                </Typography>
            )}

            {/* Action Area */}
            {lead.status !== 'Thành công' && lead.status !== 'Thất bại' && (
                <Button
                    variant={isNew || isGold ? 'contained' : 'outlined'}
                    fullWidth
                    size="small"
                    onClick={() => onQuickUpdate(lead)}
                    sx={{
                        mt: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        backgroundColor: isGold ? goldColor : isNew ? 'var(--md-sys-color-primary)' : 'transparent',
                        color: (isNew || isGold) ? '#FFFFFF' : 'var(--md-sys-color-primary)',
                        borderColor: isNew ? 'transparent' : 'var(--md-sys-color-outline)',
                        '&:hover': {
                            backgroundColor: isGold ? '#FFA000' : isNew ? 'var(--md-sys-color-primary-container)' : 'rgba(0,0,0,0.05)',
                        }
                    }}
                >
                    {isGold ? 'Khai thác ngay' : isNew ? 'Bắt đầu thương lượng' : 'Cập nhật nhanh'}
                </Button>
            )}
        </Paper>
    );
};
