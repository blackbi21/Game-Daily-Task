import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

// Schema Based on Implementation Plan
export type LeadStatus = 'Mới' | 'Đang thương lượng' | 'Thành công' | 'Thất bại';

export interface SaleProfile {
    id: string;
    name: string;
    commission_base: number;
    current_os: number; // 0 - 100
    streak_count: number;
    rank: string;
    last_known_rank?: number; // To trigger FOMO notifications
    claims_today?: number;    // Anti-hoarding
    last_claim_date?: string; // Anti-hoarding
}

export interface Lead {
    id: string;
    customer_name: string;
    status: LeadStatus;
    last_update: string; // Used as creation date simulation
    pic_id: string | null; // null means it's in the Public Pool
    note?: string;
    car_model?: string;
    is_gold_mine?: boolean;
    last_bonus_at?: string;
    claimed_at?: string;
    original_pic_id?: string;
}

export interface Log {
    id: string;
    lead_id: string;
    action_timestamp: string;
    old_status: LeadStatus;
    new_status: LeadStatus;
}

export interface SaleStatusNewLog {
    id: string; // uuid
    lead_id: string;
    old_stage: string;
    new_stage: string;
    tags: string[];
    note?: string;
    created_at: string;
    status: 'pending' | 'success' | 'failed';
    is_bonus_action?: boolean;
    multiplier?: number;
    os_added?: number;
}

export interface LeaderboardEntry {
    user_id: string;
    name: string;
    avatar_url?: string;
    rank: number;
    score: number; // The synthesized score, NO GMV exposed.
    streak_count: number;
    trend: 'up' | 'down' | 'flat';
}

export interface LeaderboardResponse {
    top_10: LeaderboardEntry[];
    current_user: LeaderboardEntry;
}

interface GamificationState {
    profile: SaleProfile | null;
    leads: Lead[];
    logs: Log[];
    statusLogs: SaleStatusNewLog[];
}

interface GamificationContextType {
    state: GamificationState;
    expectedCommission: number;
    updateLeadStatusOptimistic: (leadId: string, newStatus: LeadStatus, tags: string[], note?: string) => void;
    simulateGoldMineCronjob: () => void;
    simulateRevokeCronjob: () => void;
    claimLeadFromPool: (leadId: string) => Promise<{ success: boolean; message: string }>;
    fetchLeaderboard: () => LeaderboardResponse;
    resetMockData: () => void;
}

const DEFAULT_COMPETITORS = [
    { id: 'sal02', name: 'Hoa Sale', streak_count: 12, base_score: 85, trend: 'up' as const },
    { id: 'sal03', name: 'Hùng Xe Cũ', streak_count: 8, base_score: 78, trend: 'down' as const },
    { id: 'sal04', name: 'Mai Mua Bán', streak_count: 5, base_score: 72, trend: 'up' as const },
    { id: 'sal05', name: 'Trí Oto', streak_count: 3, base_score: 60, trend: 'flat' as const },
    { id: 'sal06', name: 'Lan Vucar', streak_count: 15, base_score: 92, trend: 'flat' as const },
    { id: 'sal07', name: 'Thanh Auto', streak_count: 1, base_score: 55, trend: 'down' as const },
    { id: 'sal08', name: 'Bình Bô', streak_count: 0, base_score: 40, trend: 'flat' as const },
    { id: 'sal09', name: 'Cường Xe', streak_count: 2, base_score: 45, trend: 'up' as const },
    { id: 'sal10', name: 'Đức Sale', streak_count: 7, base_score: 65, trend: 'down' as const },
    { id: 'sal11', name: 'Linh VIP', streak_count: 20, base_score: 95, trend: 'flat' as const },
];

const DEFAULT_PROFILE: SaleProfile = {
    id: 'sal01',
    name: 'Tuấn Sale',
    commission_base: 5000000,
    current_os: 45,
    streak_count: 5,
    rank: 'Bạc III'
};

// Create artificial old dates for candidates
const thirtyOneDaysAgo = new Date();
thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

const elevenDaysAgo = new Date();
elevenDaysAgo.setDate(elevenDaysAgo.getDate() - 11);

const fiveDaysAgo = new Date();
fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

const twentyDaysAgo = new Date();
twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

const fortyDaysAgo = new Date();
fortyDaysAgo.setDate(fortyDaysAgo.getDate() - 40);

const DEFAULT_LEADS: Lead[] = [
    // --- Leads hiện có ---
    { id: 'L001', customer_name: 'Nguyễn Văn An', status: 'Mới', last_update: new Date().toISOString(), pic_id: 'sal01', car_model: 'Toyota Vios 2020', note: 'Khách hỏi giá qua Zalo' },
    { id: 'L002', customer_name: 'Trần Thị Bích', status: 'Đang thương lượng', last_update: thirtyOneDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Honda City 2021', note: 'Đã xem xe lần 2, đang so giá' },
    { id: 'L003', customer_name: 'Lê Văn Cường', status: 'Mới', last_update: elevenDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Mazda 3 2019' }, // Candidate for revoke (>10 ngày)
    { id: 'L004', customer_name: 'Phạm Đức Dũng', status: 'Thành công', last_update: new Date().toISOString(), pic_id: 'sal01', car_model: 'Kia Seltos 2022', note: 'Đã ký HĐ, giao xe tuần sau' },
    { id: 'L005', customer_name: 'Đặng Tuấn Em', status: 'Mới', last_update: new Date().toISOString(), pic_id: null, car_model: 'VinFast VF8 2023', note: 'Quan tâm giá rớt' }, // Public Pool lead

    // --- 10 Leads mới ---
    { id: 'L006', customer_name: 'Hoàng Minh Phúc', status: 'Mới', last_update: fiveDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Toyota Camry 2021', note: 'Cần gấp trong tuần này' },
    { id: 'L007', customer_name: 'Võ Thị Hương', status: 'Đang thương lượng', last_update: new Date().toISOString(), pic_id: 'sal01', car_model: 'Hyundai Accent 2022', note: 'Chồng đồng ý, chờ duyệt ngân hàng' },
    { id: 'L008', customer_name: 'Bùi Quang Hải', status: 'Mới', last_update: fortyDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Ford Ranger 2020', note: 'Chạy dịch vụ, cần xe bền' }, // Gold Mine candidate (>30 ngày)
    { id: 'L009', customer_name: 'Ngô Thanh Tùng', status: 'Thất bại', last_update: twentyDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Mercedes C200 2019', note: 'Mua xe mới thay vì xe cũ' },
    { id: 'L010', customer_name: 'Đỗ Thị Mai Lan', status: 'Đang thương lượng', last_update: twentyDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Mitsubishi Xpander 2021', note: 'Yêu cầu giảm thêm 10tr' }, // Candidate for revoke
    { id: 'L011', customer_name: 'Trịnh Văn Khoa', status: 'Thành công', last_update: fiveDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'Honda CR-V 2022', note: 'Giao xe xong, khách rất hài lòng' },
    { id: 'L012', customer_name: 'Lý Hoàng Nam', status: 'Mới', last_update: new Date().toISOString(), pic_id: null, car_model: 'Toyota Fortuner 2021', note: 'Lead từ showroom, bận nên chưa liên hệ' }, // Public Pool
    { id: 'L013', customer_name: 'Phan Thị Ngọc Ánh', status: 'Mới', last_update: new Date().toISOString(), pic_id: null, car_model: 'Mazda CX-5 2022', note: 'Khách nữ, muốn SUV gọn nhẹ' }, // Public Pool
    { id: 'L014', customer_name: 'Huỳnh Bảo Long', status: 'Đang thương lượng', last_update: elevenDaysAgo.toISOString(), pic_id: 'sal01', car_model: 'BMW 320i 2020', note: 'Cần kiểm tra lịch sử bảo dưỡng' }, // Candidate for revoke
    { id: 'L015', customer_name: 'Mai Xuân Trường', status: 'Thất bại', last_update: new Date().toISOString(), pic_id: 'sal01', car_model: 'VinFast Lux A 2021', note: 'Khách đổi ý, chọn xe Nhật' },
];

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GamificationState>({
        profile: null,
        leads: [],
        logs: [],
        statusLogs: []
    });

    const [toast, setToast] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'info' });
    const showToast = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => setToast({ open: true, message, severity });
    const closeToast = () => setToast(prev => ({ ...prev, open: false }));

    // Calculate Expected Commission dynamically
    const expectedCommission = state.profile
        ? state.profile.commission_base * (state.profile.current_os / 100)
        : 0;

    useEffect(() => {
        // Hydrate from localStorage
        const storedStateStr = localStorage.getItem('vucar_gamification');
        if (storedStateStr) {
            try {
                const storedState = JSON.parse(storedStateStr);
                setState(storedState);
            } catch (e) {
                console.error("Local storage parsing error. Resetting to mock.");
                resetMockData();
            }
        } else {
            resetMockData();
        }
    }, []);

    const persistState = (newState: GamificationState) => {
        setState(newState);
        localStorage.setItem('vucar_gamification', JSON.stringify(newState));
    };

    const resetMockData = () => {
        persistState({
            profile: DEFAULT_PROFILE,
            leads: DEFAULT_LEADS,
            logs: [],
            statusLogs: []
        });
    };

    const updateLeadStatusOptimistic = (leadId: string, newStatus: LeadStatus, tags: string[], note?: string) => {
        if (!state.profile) return;

        const leadIndex = state.leads.findIndex(l => l.id === leadId);
        if (leadIndex === -1) return;

        const lead = state.leads[leadIndex];

        // Allow same status update ONLY if it's a Gold Mine re-engaging in 'Đang thương lượng'
        if (lead.status === newStatus && !(lead.is_gold_mine && newStatus === 'Đang thương lượng')) {
            return; // No change
        }

        const oldStatus = lead.status;
        let rankDelta = 0;
        let commDelta = 0;

        // Gamification Rules Engine
        if (oldStatus === 'Mới' && newStatus === 'Đang thương lượng') {
            rankDelta = 5; // +5% OS
        } else if (oldStatus === 'Đang thương lượng' && newStatus === 'Thành công') {
            rankDelta = 10; // +10% OS
            commDelta = 1000000; // Increase base commission by 1M VND
        } else if (newStatus === 'Thất bại') {
            rankDelta = -5; // Penalty
        } else if (oldStatus === 'Mới' && newStatus === 'Thành công') {
            rankDelta = 15;
            commDelta = 1000000;
        } else if (lead.is_gold_mine && oldStatus === 'Đang thương lượng' && newStatus === 'Đang thương lượng') {
            rankDelta = 5; // Base 5% OS for re-engaging a Gold Mine
        }

        let isBonus = false;
        let multiplier = 1.0;

        // Gold Mine Logic
        if (rankDelta > 0 && lead.is_gold_mine) {
            const now = new Date();
            const lastBonus = lead.last_bonus_at ? new Date(lead.last_bonus_at) : null;

            // Check anti-spam: 24h
            if (!lastBonus || (now.getTime() - lastBonus.getTime()) > 24 * 60 * 60 * 1000) {
                isBonus = true;
                multiplier = 1.5;
                rankDelta = rankDelta * multiplier;
            }
        }

        const snapshotState = { ...state }; // For Rollback

        const updatedProfile: SaleProfile = {
            ...state.profile,
            current_os: Math.min(100, Math.max(0, Math.round((state.profile.current_os + rankDelta) * 100) / 100)),
            commission_base: state.profile.commission_base + commDelta,
            streak_count: newStatus === 'Thành công' ? state.profile.streak_count + 1 : state.profile.streak_count
        };

        const updatedLeads = [...state.leads];
        updatedLeads[leadIndex] = {
            ...lead,
            status: newStatus,
            last_update: new Date().toISOString(),
            last_bonus_at: isBonus ? new Date().toISOString() : lead.last_bonus_at
        };

        const newStatusLog: SaleStatusNewLog = {
            id: Date.now().toString(),
            lead_id: leadId,
            old_stage: oldStatus,
            new_stage: newStatus,
            tags,
            note,
            created_at: new Date().toISOString(),
            status: 'pending',
            is_bonus_action: isBonus,
            multiplier,
            os_added: rankDelta
        };

        // 1. Optimistic Update
        const optimisticState: GamificationState = {
            profile: updatedProfile,
            leads: updatedLeads,
            logs: snapshotState.logs, // Legacy
            statusLogs: [newStatusLog, ...(state.statusLogs || [])]
        };

        persistState(optimisticState);

        // 2. Show Dopamine Toast Immediately
        if (isBonus) {
            showToast(`🔥 Tuyệt vời! Bạn nhận được x1.5 điểm cày cuốc! (+${rankDelta.toFixed(1)}%)`, 'success');
        } else if (rankDelta > 0) {
            showToast(`⚡ +${rankDelta}% điểm vận hành!`, 'success');
        } else if (rankDelta < 0) {
            showToast(`📉 ${rankDelta}% điểm vận hành.`, 'warning');
        } else {
            showToast(`Đã cập nhật trạng thái`, 'info');
        }

        // 3. Simulate Async Background API with 20% failure rate
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2; // 80% success rate

            if (isSuccess) {
                // Background Success Log Resolution
                setState(current => {
                    const logs = current.statusLogs.map(l => l.id === newStatusLog.id ? { ...l, status: 'success' as const } : l);
                    const finalState = { ...current, statusLogs: logs };
                    localStorage.setItem('vucar_gamification', JSON.stringify(finalState));
                    return finalState;
                });
            } else {
                // Background Failure Rollback
                showToast('⚠️ Kết nối gián đoạn, hoàn tất hoàn tác thay đổi.', 'error');

                // Rollback and mark the pending log as failed
                const failedLog = { ...newStatusLog, status: 'failed' as const };
                const rolledBackState = {
                    ...snapshotState,
                    statusLogs: [failedLog, ...(snapshotState.statusLogs || [])]
                };
                persistState(rolledBackState);
            }
        }, 1500); // 1.5s simulated network latency
    };

    const simulateGoldMineCronjob = () => {
        const now = new Date();
        const updatedLeads = state.leads.map(lead => {
            const lastUpdate = new Date(lead.last_update);
            const daysOld = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);

            if (daysOld > 30 && lead.status !== 'Thành công' && lead.status !== 'Thất bại') {
                return { ...lead, is_gold_mine: true };
            }
            return lead;
        });

        // Add a notification so user knows Job ran
        const found = updatedLeads.filter(l => l.is_gold_mine && !state.leads.find(sl => sl.id === l.id && sl.is_gold_mine)).length;
        if (found > 0) {
            showToast(`💎 Tìm thấy ${found} khách hàng cũ, đã đưa vào Mỏ Vàng!`, 'info');
        }

        persistState({ ...state, leads: updatedLeads });
    };

    const fetchLeaderboard = (): LeaderboardResponse => {
        if (!state.profile) return { top_10: [], current_user: {} as LeaderboardEntry };

        // 1. Calculate Current User Score (Worker Simulation)
        // Score = (GMV_Norm * 0.6) + (OS * 0.4)
        // Assuming GMV target is 10M for this prototype (so 5M commission base = 50% normalized)
        const gmvNorm = Math.min(100, (state.profile.commission_base / 10000000) * 100);
        const userScore = (gmvNorm * 0.6) + (state.profile.current_os * 0.4);

        const currentUserEntry: LeaderboardEntry = {
            user_id: state.profile.id,
            name: state.profile.name,
            rank: 0, // Computed later
            score: Math.round(userScore),
            streak_count: state.profile.streak_count,
            trend: 'flat'
        };

        // 2. Combine with Competitors
        const allEntries: LeaderboardEntry[] = [
            currentUserEntry,
            ...DEFAULT_COMPETITORS.map(c => ({
                user_id: c.id,
                name: c.name,
                rank: 0,
                score: c.base_score,
                streak_count: c.streak_count,
                trend: c.trend
            }))
        ];

        // 3. Sort (Redis ZREVRANGE Simulation)
        allEntries.sort((a, b) => b.score - a.score);

        // 4. Assign Ranks
        allEntries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        // 5. Build Response
        const top10 = allEntries.slice(0, 10);
        const currentUserFinal = allEntries.find(e => e.user_id === state.profile!.id)!;

        // 6. Fomo Trigger (If rank dropped)
        if (state.profile.last_known_rank && currentUserFinal.rank > state.profile.last_known_rank) {
            currentUserFinal.trend = 'down';
            // Show alert async so it doesn't block render if called during render
            setTimeout(() => {
                showToast(`⚠️ Báo động! Bạn vừa rớt xuống hạng ${currentUserFinal.rank}`, 'error');
            }, 500);
        } else if (state.profile.last_known_rank && currentUserFinal.rank < state.profile.last_known_rank) {
            currentUserFinal.trend = 'up';
        }

        // Save new rank tracking async
        if (state.profile.last_known_rank !== currentUserFinal.rank) {
            setTimeout(() => {
                persistState({
                    ...state,
                    profile: {
                        ...state.profile!,
                        last_known_rank: currentUserFinal.rank
                    }
                });
            }, 0);
        }

        return {
            top_10: top10,
            current_user: currentUserFinal
        };
    };

    const simulateRevokeCronjob = () => {
        const now = new Date();
        let revokedCount = 0;

        const updatedLeads = state.leads.map(lead => {
            // Only consider leads currently assigned to the active user
            if (lead.pic_id !== state.profile?.id) return lead;

            const lastUpdate = new Date(lead.last_update);
            const daysOld = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);

            // If untouched for >10 days, revoke it to public pool
            if (daysOld > 10 && lead.status !== 'Thành công' && lead.status !== 'Thất bại') {
                revokedCount++;
                return {
                    ...lead,
                    pic_id: null,
                    original_pic_id: lead.pic_id,
                    status: 'Mới' as LeadStatus // Reset to New for the pool
                };
            }
            return lead;
        });

        if (revokedCount > 0) {
            // Fomo Notification for the old owner
            showToast(`⚠️ Cảnh báo: Bạn vừa bị thu hồi ${revokedCount} Lead vì bỏ bê quá 10 ngày!`, 'error');
            persistState({ ...state, leads: updatedLeads });
        } else {
            showToast('Không có Lead nào bị thu hồi hôm nay.', 'info');
        }
    };

    const claimLeadFromPool = async (leadId: string): Promise<{ success: boolean; message: string }> => {
        if (!state.profile) return { success: false, message: 'Not logged in' };

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const profile = state.profile;

        // Anti-hoarding check
        let claimsToday = profile.claims_today || 0;
        if (profile.last_claim_date !== todayStr) {
            claimsToday = 0; // Reset for new day
        }

        if (claimsToday >= 3) {
            return {
                success: false,
                message: 'Bạn đã hết 3 lượt cướp hôm nay. Hãy tập trung khai thác các Lead đang có!'
            };
        }

        // Simulate Network Latency
        await new Promise(resolve => setTimeout(resolve, 600));

        // Let's explicitly check the freshest localStorage data to simulate Atomic DB Transaction (Race Condition)
        const freshestStateStr = localStorage.getItem('vucar_gamification');
        const freshestState: GamificationState = freshestStateStr ? JSON.parse(freshestStateStr) : state;

        const targetLead = freshestState.leads.find(l => l.id === leadId);

        // Check locks (Atomic constraint: WHERE pic_id IS NULL)
        if (!targetLead || targetLead.pic_id !== null) {
            // Simulate 409 Conflict
            return {
                success: false,
                message: 'Rất tiếc, Sale khác đã nhanh tay cắm cờ trước!'
            };
        }

        // Success - Claim it
        const osReward = 0.05;

        const updatedProfile: SaleProfile = {
            ...profile,
            claims_today: claimsToday + 1,
            last_claim_date: todayStr,
            current_os: Math.min(100, Math.round((profile.current_os + osReward) * 100) / 100)
        };

        const updatedLeads = freshestState.leads.map(l => {
            if (l.id === leadId) {
                return {
                    ...l,
                    pic_id: profile.id,
                    claimed_at: new Date().toISOString()
                };
            }
            return l;
        });

        const newState = {
            ...freshestState,
            profile: updatedProfile,
            leads: updatedLeads
        };

        persistState(newState);

        // Dopamine Toast
        showToast(`⚡ Cướp thành công! Cộng ${osReward} điểm OS.`, 'success');

        return { success: true, message: 'Success' };
    };

    return (
        <GamificationContext.Provider value={{ state, expectedCommission, updateLeadStatusOptimistic, simulateGoldMineCronjob, fetchLeaderboard, resetMockData, simulateRevokeCronjob, claimLeadFromPool }}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={closeToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ top: { xs: 16, sm: 24 } }}
            >
                <Alert
                    onClose={closeToast}
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 3, fontWeight: 'bold' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (context === undefined) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};
