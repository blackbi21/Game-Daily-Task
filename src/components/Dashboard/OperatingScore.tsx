import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useGamification } from '../../context/GamificationContext';

export const OperatingScore: React.FC = () => {
    const { state } = useGamification();
    const osRaw = state.profile?.current_os || 0;
    const os = Math.round(osRaw * 10) / 10;

    // Kpi Levels & Colors mapped to M3 Tokens
    const getKpiData = (val: number) => {
        if (val < 40) return { label: 'Yếu', color: 'var(--md-sys-color-error)' };
        if (val < 60) return { label: 'Trung\nBình', color: 'var(--md-sys-color-tertiary)' };
        if (val < 80) return { label: 'Tốt', color: 'var(--md-sys-color-secondary)' };
        if (val < 90) return { label: 'Xuất\nsắc', color: 'var(--md-sys-color-primary)' };
        return { label: 'Hoàn\nhảo', color: 'var(--md-sys-color-primary)' };
    };

    const kpiData = getKpiData(os);
    const isAhead = os >= 60; // Pace threshold

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 4,
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
            }}
        >
            {/* Top Section - Circular Progress (OS) */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold', fontSize: '1rem' }}>
                        Điểm Vận Hành
                    </Typography>
                    <Typography sx={{ color: 'var(--md-sys-color-on-surface)', fontWeight: '900', fontSize: '2.5rem', lineHeight: 1.2 }}>
                        {Number.isInteger(os) ? os : os.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--md-sys-color-outline)', mt: 0.5 }}>
                        Mục tiêu: 80%
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={80}
                        thickness={6}
                        sx={{ color: 'var(--md-sys-color-outline-variant)' }}
                    />
                    <CircularProgress
                        variant="determinate"
                        value={os}
                        size={80}
                        thickness={6}
                        sx={{
                            color: kpiData.color,
                            position: 'absolute',
                            left: 0,
                            strokeLinecap: 'round',
                            transition: 'stroke-dashoffset 0.5s ease-in-out',
                        }}
                    />
                    <Box
                        sx={{
                            top: 0, left: 0, bottom: 0, right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', color: kpiData.color, textAlign: 'center', lineHeight: 1.1 }}>
                            {kpiData.label.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Bottom Section - Goal Progress Slider & Insights */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, backgroundColor: 'var(--md-sys-color-surface)' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: 'var(--md-sys-color-on-surface)' }}>
                    Goal Progress
                </Typography>

                {/* Progress Track */}
                <Box sx={{ position: 'relative', height: 12, borderRadius: 6, backgroundColor: 'var(--md-sys-color-surface-variant)', mb: 1, mt: 1 }}>
                    {/* Behind Pace Striped Reference (Simulating 80% target) */}
                    {!isAhead && (
                        <Box sx={{
                            position: 'absolute', left: 0, top: 0, height: '100%', width: '80%',
                            backgroundImage: 'repeating-linear-gradient(45deg, var(--md-sys-color-error-container), var(--md-sys-color-error-container) 10px, transparent 10px, transparent 20px)',
                            opacity: 0.5, borderRadius: 6
                        }} />
                    )}

                    {/* Filled Bar */}
                    <Box
                        sx={{
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${Math.min(100, os)}%`,
                            backgroundColor: kpiData.color,
                            borderRadius: 6,
                            transition: 'width 0.5s ease-in-out'
                        }}
                    />

                    {/* Thumb / Handle */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: `${Math.min(100, os)}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 20,
                            height: 20,
                            backgroundColor: 'var(--md-sys-color-surface)',
                            border: `4px solid ${kpiData.color}`,
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            transition: 'left 0.5s ease-in-out'
                        }}
                    />
                </Box>

                {/* KPI Axis Markers */}
                <Box sx={{ position: 'relative', height: 16, width: '100%', mt: 0.5 }}>
                    {[
                        { value: 40, label: 'Yếu' },
                        { value: 60, label: 'TB' },
                        { value: 80, label: 'Tốt' },
                        { value: 90, label: 'XS' }
                    ].map(mark => (
                        <Box key={mark.value} sx={{
                            position: 'absolute',
                            left: `${mark.value}%`,
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'var(--md-sys-color-outline)', fontWeight: 'bold' }}>
                                {mark.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* Insight Message */}
                <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', mt: 2, lineHeight: 1.5 }}>
                    {isAhead ? (
                        <>Bạn đang <strong style={{ color: 'var(--md-sys-color-primary)' }}>vượt tiến độ</strong> và dự kiến đạt mục tiêu KPI đề ra trước hạn! Tiếp tục phát huy nhé.</>
                    ) : (
                        <>Bạn đang <strong style={{ color: 'var(--md-sys-color-error)' }}>chậm tiến độ</strong>, hãy tăng tốc xử lý khách hàng để đạt KPI đề ra.</>
                    )}
                </Typography>
            </Paper>
        </Paper>
    );
};

