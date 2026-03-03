import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Badge } from '@mui/material';
import { useGamification, Lead } from '../../context/GamificationContext';
import { LeadCard } from './LeadCard';
import { QuickActionModal } from './QuickActionModal';

export const LeadList: React.FC = () => {
    const { state } = useGamification();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [tabValue, setTabValue] = useState(0);

    const handleQuickUpdate = (lead: Lead) => {
        setSelectedLead(lead);
    };

    const handleCloseModal = () => {
        setSelectedLead(null);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Separate normal and gold mine leads
    const normalLeads = state.leads.filter(l => !l.is_gold_mine);
    const goldMineLeads = state.leads.filter(l => l.is_gold_mine);

    const activeLeads = tabValue === 0 ? normalLeads : goldMineLeads;

    // Sort: New leads first, then Negotiating
    const sortedLeads = [...activeLeads].sort((a, b) => {
        if (a.status === 'Mới' && b.status !== 'Mới') return -1;
        if (a.status !== 'Mới' && b.status === 'Mới') return 1;
        if (a.status === 'Đang thương lượng' && b.status !== 'Đang thương lượng') return -1;
        if (a.status !== 'Đang thương lượng' && b.status === 'Đang thương lượng') return 1;
        return 0;
    });

    return (
        <Box sx={{ mt: 3, width: '100%' }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-on-background)', mb: 1 }}>
                    Danh sách Khách hàng
                </Typography>

                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                        minHeight: 40,
                        backgroundColor: 'var(--md-sys-color-surface-variant)',
                        borderRadius: 3,
                        p: 0.5,
                        '& .MuiTabs-indicator': {
                            display: 'none',
                        },
                        '& .MuiTab-root': {
                            minHeight: 40,
                            borderRadius: 2.5,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            color: 'var(--md-sys-color-on-surface-variant)',
                            transition: 'all 0.2s',
                            '&.Mui-selected': {
                                backgroundColor: 'var(--md-sys-color-surface)',
                                color: tabValue === 1 ? '#FFB300' : 'var(--md-sys-color-primary)', // Amber for Gold Mine
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }
                        }
                    }}
                >
                    <Tab label="Cơ hội mới" />
                    <Tab
                        label={
                            <Badge
                                badgeContent={goldMineLeads.length}
                                color="error"
                                sx={{ '& .MuiBadge-badge': { right: -15, top: 4 } }}
                            >
                                Mỏ Vàng
                            </Badge>
                        }
                    />
                </Tabs>
            </Box>

            {sortedLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead} onQuickUpdate={handleQuickUpdate} />
            ))}

            {sortedLeads.length === 0 && (
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center', py: 4 }}>
                    {tabValue === 0 ? "Không có khách hàng mới nào." : "Chưa có mỏ vàng nào được khai quật."}
                </Typography>
            )}

            {selectedLead && (
                <QuickActionModal
                    open={!!selectedLead}
                    onClose={handleCloseModal}
                    lead={selectedLead}
                />
            )}
        </Box>
    );
};
