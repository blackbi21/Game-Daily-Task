import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Paper, List, ListItem, ListItemAvatar, ListItemText, Chip, CircularProgress } from '@mui/material';
import { useGamification, LeaderboardEntry } from '../../context/GamificationContext';
import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Subcomponent: Podium (Top 1-3)
const Podium = ({ top3 }: { top3: LeaderboardEntry[] }) => {
    if (top3.length < 3) return null;

    const [second, first, third] = [top3[1], top3[0], top3[2]];

    const renderPodiumItem = (entry: LeaderboardEntry, rank: number, height: number, color: string, ringColor: string) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', mt: rank === 1 ? 0 : rank === 2 ? 2 : 4 }}>
            <Box sx={{ position: 'relative', mb: 1 }}>
                <Avatar
                    sx={{
                        width: rank === 1 ? 72 : 56,
                        height: rank === 1 ? 72 : 56,
                        border: `4px solid ${ringColor}`,
                        backgroundColor: 'var(--md-sys-color-surface-variant)',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        fontWeight: 'bold',
                        fontSize: rank === 1 ? '1.5rem' : '1.2rem',
                    }}
                >
                    {entry.name.charAt(0)}
                </Avatar>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: ringColor,
                        color: '#FFF',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        border: '2px solid var(--md-sys-color-surface)'
                    }}
                >
                    {rank}
                </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 1, textAlign: 'center', color: 'var(--md-sys-color-on-background)', px: 0.5, lineHeight: 1.2 }}>
                {entry.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold', mt: 0.5 }}>
                {entry.score} điểm
            </Typography>

            {/* The Base */}
            <Paper
                elevation={rank === 1 ? 4 : 2}
                sx={{
                    mt: 1,
                    width: '100%',
                    height: height,
                    backgroundColor: color,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    pt: 1
                }}
            >
            </Paper>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', px: 1, mb: 4, mt: 2 }}>
            {renderPodiumItem(second, 2, 70, '#E0E0E0', '#C0C0C0')}
            {renderPodiumItem(first, 1, 100, '#FFF59D', '#FFD700')}
            {renderPodiumItem(third, 3, 50, '#FFCC80', '#CD7F32')}
        </Box>
    );
};

// Subcomponent: Leaderboard List (Rank 4+)
const LeaderboardList = ({ entries, currentUserId }: { entries: LeaderboardEntry[], currentUserId: string }) => {
    const getTrendIcon = (trend: 'up' | 'down' | 'flat') => {
        if (trend === 'up') return <TrendingUp size={16} color="var(--md-sys-color-primary)" />;
        if (trend === 'down') return <TrendingDown size={16} color="var(--md-sys-color-error)" />;
        return <Minus size={16} color="var(--md-sys-color-outline)" />;
    };

    return (
        <List sx={{ width: '100%', pb: 10 }}>
            {entries.map((entry) => {
                const isMe = entry.user_id === currentUserId;
                return (
                    <ListItem
                        key={entry.user_id}
                        sx={{
                            mb: 1,
                            backgroundColor: isMe ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-variant)',
                            borderRadius: 3,
                            px: 2,
                            py: 1.5,
                        }}
                    >
                        <Box sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', mr: 2, color: 'var(--md-sys-color-on-surface-variant)' }}>
                            {entry.rank}
                        </Box>

                        <ListItemAvatar>
                            <Avatar sx={{ width: 40, height: 40, backgroundColor: isMe ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-secondary)' }}>
                                {entry.name.charAt(0)}
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                            primary={
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: isMe ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface)' }}>
                                    {entry.name} {isMe && "(Tôi)"}
                                </Typography>
                            }
                            secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--md-sys-color-on-surface-variant)' }}>
                                        {entry.score} đ
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#FFB300' }}>
                                        <Flame size={14} fill="#FFB300" />
                                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{entry.streak_count}</Typography>
                                    </Box>
                                </Box>
                            }
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24 }}>
                            {getTrendIcon(entry.trend)}
                        </Box>
                    </ListItem>
                );
            })}
        </List>
    );
};

// Subcomponent: Sticky Self-Rank
const StickySelfRank = ({ entry }: { entry: LeaderboardEntry }) => {
    const isDropping = entry.trend === 'down';

    return (
        <Paper
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: 80, // Above BottomNav
                left: 0,
                right: 0,
                maxWidth: 430,
                margin: '0 auto',
                zIndex: 900,
                backgroundColor: isDropping ? 'var(--md-sys-color-error-container)' : 'var(--md-sys-color-tertiary-container)',
                color: isDropping ? 'var(--md-sys-color-on-error-container)' : 'var(--md-sys-color-on-tertiary-container)',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                transform: 'translateY(0)',
                animation: isDropping ? 'flashRed 2s infinite' : 'none',
                '@keyframes flashRed': {
                    '0%': { backgroundColor: 'var(--md-sys-color-error-container)' },
                    '50%': { backgroundColor: '#FF8A80' },
                    '100%': { backgroundColor: 'var(--md-sys-color-error-container)' }
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 30, textAlign: 'center', fontWeight: '900', fontSize: '1.2rem' }}>
                    #{entry.rank}
                </Box>
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Hạng của bạn</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', opacity: 0.9 }}>
                        {entry.score} điểm • 🔥 {entry.streak_count} ngày
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {entry.trend === 'up' && <TrendingUp size={24} />}
                {entry.trend === 'down' && <TrendingDown size={24} />}
                {entry.trend === 'flat' && <Minus size={24} />}
            </Box>
        </Paper>
    );
};

export const LeaderboardView = () => {
    const { fetchLeaderboard, state } = useGamification();
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState<{ top_10: LeaderboardEntry[], current_user: LeaderboardEntry } | null>(null);

    useEffect(() => {
        // Simulate network fetch
        const timer = setTimeout(() => {
            const data = fetchLeaderboard();
            setLeaderboard(data);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [state]); // Re-fetch if GamificationContext state changes

    if (loading || !leaderboard) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', pb: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    const { top_10, current_user } = leaderboard;
    const top3 = top_10.slice(0, 3);
    const rest = top_10.slice(3);

    // Check if the current user is within the view (e.g. they are in top 10, meaning they might be visible)
    // Actually, in a real app, we might use IntersectionObserver, but roughly, if rank > 3, show sticky so they always see themselves clearly.
    // Let's just always show the sticky bar for FOMO effect.
    const showSticky = current_user.rank > 3;

    return (
        <Box sx={{ pb: showSticky ? 12 : 8, minHeight: '100vh', pt: 2 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: '900', color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Bảng Vàng Vucar
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 0.5 }}>
                    Cập nhật mới nhất • BXH Tháng
                </Typography>
            </Box>

            <Podium top3={top3} />

            <Box sx={{ px: 2 }}>
                <LeaderboardList entries={rest} currentUserId={current_user.user_id} />
            </Box>

            <StickySelfRank entry={current_user} />
        </Box>
    );
};
