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

    // Segment Leads
    const newLeads = activeLeads.filter(l => l.status === 'Mới');
    const negotiatingLeads = activeLeads.filter(l => l.status === 'Đang thương lượng');
    const successLeads = activeLeads.filter(l => l.status === 'Thành công');
    const failedLeads = activeLeads.filter(l => l.status === 'Thất bại');

    const renderSection = (title: string, leads: Lead[], color: string) => {
        if (leads.length === 0) return null;
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ color, fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase', pl: 1, borderLeft: `4px solid ${color}` }}>
                    {title} ({leads.length})
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {leads.map(lead => (
                        <LeadCard key={lead.id} lead={lead} onQuickUpdate={handleQuickUpdate} />
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ mt: 3, width: '100%', pb: 10 }}>
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

            {/* Sections Rendering */}
            {renderSection('Khách hàng mới', newLeads, 'var(--md-sys-color-primary)')}
            {renderSection('Đang Thương lượng', negotiatingLeads, 'var(--md-sys-color-tertiary)')}
            {renderSection('Thành công', successLeads, 'var(--md-sys-color-secondary)')}
            {renderSection('Thất bại', failedLeads, 'var(--md-sys-color-error)')}

            {activeLeads.length === 0 && (
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

