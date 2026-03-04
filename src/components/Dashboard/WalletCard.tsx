import React, { useEffect, useState, useRef } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useGamification } from '../../context/GamificationContext';

export const WalletCard: React.FC = () => {
    const { expectedCommission } = useGamification();
    const [animate, setAnimate] = useState(false);
    const prevCommissionRef = useRef(expectedCommission);

    // Xử lý Force Data cho Mục Tiêu KPI Tháng (Mặc định 50 triệu)
    const targetCommission = 50000000;
    // Nếu chưa có data thực tế từ user, giả lập 32 triệu để demo thanh tiến độ ở mức 64%
    const currentCommission = expectedCommission > 0 ? expectedCommission : 32000000;

    // Tính toán tiến độ KPI
    const performancePercentage = Math.min((currentCommission / targetCommission) * 100, 100);

    // Giả lập Pace (tiến độ chuẩn cần đạt) dựa trên ngày hiện tại của tháng
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const pacePercentage = Math.min((currentDay / totalDays) * 100, 100);

    // Cơ chế phân loại KPI theo các mức: Yếu (<40), TB (40-60), Tốt (60-80), Rất Tốt (80-90), Xuất sắc (>=90)
    const getKPIDetails = (percent: number) => {
        if (percent < 40) return { label: 'Yếu', color: 'var(--md-sys-color-error)' };
        if (percent < 60) return { label: 'Trung Bình', color: 'var(--md-sys-color-outline)' };
        if (percent < 80) return { label: 'Tốt', color: 'var(--md-sys-color-primary)' };
        if (percent < 90) return { label: 'Rất Tốt', color: 'var(--md-sys-color-secondary)' };
        return { label: 'Xuất sắc', color: 'var(--md-sys-color-tertiary)' };
    };

    const kpi = getKPIDetails(performancePercentage);
    const isAhead = performancePercentage >= pacePercentage;
    const diffPercentage = Math.abs(performancePercentage - pacePercentage).toFixed(1);

    useEffect(() => {
        if (expectedCommission > prevCommissionRef.current) {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 500); // Animation nảy lên khi nhận data mới
        }
        prevCommissionRef.current = expectedCommission;
    }, [expectedCommission]);

    const formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCommission);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 4,
                backgroundColor: 'var(--md-sys-color-surface)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: animate ? 'scale(1.02)' : 'scale(1)',
            }}
        >
            {/* Header: Title & Mức KPI */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="subtitle2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontWeight: 'bold' }}>
                        KPI Doanh Thu (Tháng)
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: '900',
                            color: 'var(--md-sys-color-on-surface)',
                            mt: 0.5,
                        }}
                    >
                        {formattedValue}
                    </Typography>
                </Box>
                <Box sx={{
                    px: 1.5, py: 0.5,
                    borderRadius: 2,
                    color: kpi.color,
                    border: `1.5px solid ${kpi.color}`,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    backgroundColor: 'var(--md-sys-color-surface)'
                }}>
                    {kpi.label} ({performancePercentage.toFixed(1)}%)
                </Box>
            </Box>

            {/* UI Track: Goal Progress bar */}
            <Box sx={{ position: 'relative', height: 48, display: 'flex', alignItems: 'center', mt: 1 }}>
                {/* Background Track */}
                <Box sx={{
                    position: 'absolute',
                    width: '100%',
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'var(--md-sys-color-surface-variant)',
                    overflow: 'hidden'
                }}>
                    {/* Phần Track hoàn thành thực tế (Màu tuỳ theo trạng thái) */}
                    <Box sx={{
                        position: 'absolute',
                        left: 0,
                        width: isAhead ? `${pacePercentage}%` : `${performancePercentage}%`,
                        height: '100%',
                        backgroundColor: isAhead ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)',
                        zIndex: 1
                    }} />

                    {/* Phần Track chênh lệch gạch sọc (Ahead / Behind pace) */}
                    {isAhead ? (
                        <Box sx={{
                            position: 'absolute',
                            left: `${pacePercentage}%`,
                            width: `${performancePercentage - pacePercentage}%`,
                            height: '100%',
                            opacity: 0.4,
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, var(--md-sys-color-primary) 4px, var(--md-sys-color-primary) 8px)`,
                            zIndex: 1
                        }} />
                    ) : (
                        <Box sx={{
                            position: 'absolute',
                            left: `${performancePercentage}%`,
                            width: `${pacePercentage - performancePercentage}%`,
                            height: '100%',
                            opacity: 0.4,
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, var(--md-sys-color-error) 4px, var(--md-sys-color-error) 8px)`,
                            zIndex: 1
                        }} />
                    )}
                </Box>

                {/* Các vạch mốc KPI: 40, 60, 80, 90 */}
                {[40, 60, 80, 90].map((mark) => (
                    <Box key={mark} sx={{
                        position: 'absolute',
                        left: `${mark}%`,
                        height: 16,
                        width: 2,
                        backgroundColor: 'var(--md-sys-color-outline-variant)',
                        zIndex: 1,
                        transform: 'translateX(-50%)'
                    }} />
                ))}

                {/* Điểm trỏ Thumb Target (Pace hiện tại nên ở đâu) */}
                <Box sx={{
                    position: 'absolute',
                    left: `${pacePercentage}%`,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    border: `4.5px solid ${isAhead ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)'}`,
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </Box>

            {/* Chú thích Pace văn bản */}
            <Typography variant="body2" sx={{ color: 'var(--md-sys-color-on-surface-variant)', lineHeight: 1.4 }}>
                Hiện tại bạn đang{' '}
                <Box component="span" sx={{
                    color: isAhead ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)',
                    fontWeight: 'bold'
                }}>
                    {isAhead ? 'vượt tiến độ ' : 'chậm tiến độ '}
                </Box>
                {diffPercentage}% so với mức mục tiêu đề ra cho ngày hôm nay.{' '}
                {isAhead ? 'Tiếp tục duy trì phong độ nhé!' : 'Hãy cố gắng bứt phá doanh số hơn nữa!'}
            </Typography>
        </Paper>
    );
};
