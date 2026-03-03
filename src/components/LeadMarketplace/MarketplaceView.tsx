import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Button, List, CircularProgress } from '@mui/material';
import { useGamification, Lead } from '../../context/GamificationContext';
import { Clock, Car, Zap, User } from 'lucide-react';

const maskName = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length <= 1) return name.charAt(0) + '***';
    const last = parts.pop();
    return parts.join(' ') + ' ' + last?.charAt(0) + '***';
};

const MarketLeadCard = ({ lead, onClaim }: { lead: Lead, onClaim: (id: string) => void }) => {
    const [claiming, setClaiming] = useState(false);

    const handleClaim = () => {
        setClaiming(true);
        onClaim(lead.id);
        // We do not set claim back to false here because the lead should disappear on success
        // or the parent will handle the error and we reset it if needed.
        setTimeout(() => setClaiming(false), 2000); // Safety reset
    };

    // Calculate days idle
    const lastUpdate = new Date(lead.last_update);
    const now = new Date();
    const daysIdle = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24));

    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                borderRadius: 4,
                border: '2px dashed var(--md-sys-color-secondary-container)',
                backgroundColor: 'var(--md-sys-color-surface)',
                position: 'relative',
                overflow: 'visible'
            }}
        >
            <Chip
                label="Free Lead"
                size="small"
                sx={{
                    position: 'absolute',
                    top: -10,
                    right: 16,
                    backgroundColor: 'var(--md-sys-color-error)',
                    color: 'var(--md-sys-color-on-error)',
                    fontWeight: 'bold',
                    border: '2px solid var(--md-sys-color-surface)'
                }}
            />
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: 'var(--md-sys-color-primary-container)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <User color="var(--md-sys-color-on-primary-container)" size={24} />
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: '900', color: 'var(--md-sys-color-on-surface)' }}>
                            {maskName(lead.customer_name)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            090****123
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {lead.car_model && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--md-sys-color-on-surface-variant)' }}>
                            <Car size={16} />
                            <Typography variant="body2" sx={{ fontWeight: '500' }}>{lead.car_model}</Typography>
                        </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--md-sys-color-error)' }}>
                        <Clock size={16} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Bị bỏ rơi {daysIdle} ngày</Typography>
                    </Box>
                </Box>

                {lead.note && (
                    <Box sx={{
                        backgroundColor: 'var(--md-sys-color-surface-variant)',
                        p: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        borderLeft: '4px solid var(--md-sys-color-outline)'
                    }}>
                        <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontStyle: 'italic' }}>
                            "{lead.note}"
                        </Typography>
                    </Box>
                )}

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleClaim}
                    disabled={claiming}
                    sx={{
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        backgroundColor: 'var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-on-primary)',
                        display: 'flex',
                        gap: 1
                    }}
                >
                    {claiming ? <CircularProgress size={24} color="inherit" /> : <><Zap size={20} /> Cướp Ngay</>}
                </Button>
            </CardContent>
        </Card>
    );
};

export const MarketplaceView = () => {
    const { state, claimLeadFromPool } = useGamification();
    const [claimingId, setClaimingId] = useState<string | null>(null);

    // Filter leads that don't have a pic_id
    const poolLeads = state.leads.filter(l => l.pic_id === null || l.pic_id === undefined);

    const handleClaim = async (leadId: string) => {
        if (claimingId) return; // Prevent multiple clicks
        setClaimingId(leadId);

        await claimLeadFromPool(leadId);

        setClaimingId(null);
    };

    return (
        <Box sx={{ pb: 10, px: 2, pt: 2, minHeight: '100vh', backgroundColor: 'var(--md-sys-color-background)' }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: '900', color: 'var(--md-sys-color-on-background)', mb: 0.5 }}>
                    Chợ Lead Tự Do
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {poolLeads.length === 0
                        ? "Hiện chưa có Lead nào bị bỏ rơi. Hãy kiên nhẫn chờ đợi!"
                        : `Có ${poolLeads.length} Lead đang vô chủ. Phải nhanh tay mới có phần!`}
                </Typography>
            </Box>

            <List disablePadding>
                {poolLeads.map(lead => (
                    <MarketLeadCard
                        key={lead.id}
                        lead={lead}
                        onClaim={handleClaim}
                    />
                ))}
            </List>

            {poolLeads.length === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 10, opacity: 0.5 }}>
                    <Zap size={64} style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Chợ đang trống</Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>Các Sale khác đang chăm sóc rất tốt.<br />Hãy quay lại sau!</Typography>
                </Box>
            )}
        </Box>
    );
};
