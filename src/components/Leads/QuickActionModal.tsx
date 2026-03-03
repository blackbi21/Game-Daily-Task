import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Box, Typography, Button, TextField, Chip } from '@mui/material';
import { Lead, useGamification, LeadStatus } from '../../context/GamificationContext';

interface QuickActionModalProps {
    open: boolean;
    onClose: () => void;
    lead: Lead | null;
}

const SMART_TAGS = ['Khách bận', 'Hẹn gọi lại', 'Chê giá', 'Đang so sánh', 'Sai số'];
const GOLD_MINE_TAGS = ['Gửi báo giá mới', 'Hỏi thăm xe cũ'];

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ open, onClose, lead }) => {
    const { updateLeadStatusOptimistic } = useGamification();
    const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (open && lead) {
            setSelectedStatus(null);
            setSelectedTags([]);
            setNote('');
        }
    }, [open, lead]);

    if (!lead) return null;

    const isGold = lead.is_gold_mine;
    const currentTags = isGold ? GOLD_MINE_TAGS : SMART_TAGS;

    const handleSave = () => {
        if (!selectedStatus) return;
        updateLeadStatusOptimistic(lead.id, selectedStatus, selectedTags, note);
        onClose();
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    // Filter available statuses based on current status
    // For gold mine leads, we always show 'Đang thương lượng' so they can re-engage
    const availableStatuses: LeadStatus[] = ['Đang thương lượng', 'Thành công', 'Thất bại'].filter(
        s => (isGold && s === 'Đang thương lượng') ? true : s !== lead.status
    ) as LeadStatus[];

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            onOpen={() => { }}
            disableSwipeToOpen
            PaperProps={{
                sx: {
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    backgroundColor: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)',
                    p: 3,
                    pb: 5,
                }
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Notch */}
                <Box sx={{ width: 40, height: 5, backgroundColor: 'var(--md-sys-color-outline-variant)', borderRadius: 2.5, mb: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: '900', mb: 1, textAlign: 'center' }}>
                    Cập nhật: {lead.customer_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mb: 3, textAlign: 'center' }}>
                    Hiện tại: {lead.status}
                </Typography>

                <Box sx={{ width: '100%', mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Trạng thái tiếp theo
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                        {availableStatuses.map(status => {
                            const isSelected = selectedStatus === status;
                            return (
                                <Chip
                                    key={status}
                                    label={status}
                                    clickable
                                    onClick={() => setSelectedStatus(status)}
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        py: 2.5,
                                        px: 1,
                                        borderRadius: 3,
                                        backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)',
                                        color: isSelected ? 'var(--md-sys-color-on-primary)' : 'var(--md-sys-color-on-surface-variant)',
                                        '&:hover': {
                                            backgroundColor: isSelected ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-surface-variant)',
                                        }
                                    }}
                                />
                            );
                        })}
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Gắn thẻ nhanh (Smart Tags)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                        {currentTags.map(tag => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    clickable
                                    onClick={() => toggleTag(tag)}
                                    variant={isSelected ? "filled" : "outlined"}
                                    sx={{
                                        fontWeight: '500',
                                        backgroundColor: isSelected ? 'var(--md-sys-color-secondary-container)' : 'transparent',
                                        color: isSelected ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-outline)',
                                        borderColor: isSelected ? 'transparent' : 'var(--md-sys-color-outline)',
                                    }}
                                />
                            );
                        })}
                    </Box>

                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: 'var(--md-sys-color-on-surface-variant)' }}>
                        Ghi chú thêm
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Nhập ghi chú cho quản lý..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        variant="outlined"
                        sx={{
                            mb: 4,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'var(--md-sys-color-surface-variant)',
                                '& fieldset': { border: 'none' },
                            }
                        }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={!selectedStatus}
                        onClick={handleSave}
                        sx={{
                            py: 2,
                            borderRadius: 4,
                            backgroundColor: '#F37021', // Vucar Orange
                            color: '#FFFFFF',
                            textTransform: 'none',
                            fontWeight: '900',
                            fontSize: '1.2rem',
                            boxShadow: '0 8px 24px rgba(243, 112, 33, 0.4)',
                            transition: 'transform 0.1s',
                            '&:active': {
                                transform: 'scale(0.96)',
                            },
                            '&:hover': {
                                backgroundColor: '#D95E1A',
                                boxShadow: '0 8px 24px rgba(243, 112, 33, 0.4)',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: 'var(--md-sys-color-surface-variant)',
                                color: 'var(--md-sys-color-on-surface-variant)',
                                opacity: 0.6,
                                boxShadow: 'none'
                            }
                        }}
                    >
                        Lưu & Nhận Điểm
                    </Button>
                </Box>
            </Box>
        </SwipeableDrawer>
    );
};
