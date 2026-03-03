import React, { useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Icon } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = React.useState(0);

    const routes = ['/', '/leads', '/pool', '/leaderboard'];

    useEffect(() => {
        const index = routes.findIndex(route => location.pathname === route);
        if (index !== -1) {
            setValue(index);
        }
    }, [location.pathname, routes]);

    return (
        <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, maxWidth: 430, margin: '0 auto' }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                    navigate(routes[newValue]);
                }}
                sx={{
                    backgroundColor: 'var(--md-sys-color-surface)', // Use token
                    height: 80, // M3 specs usually 80dp
                }}
            >
                <BottomNavigationAction
                    label="Trang chủ"
                    value={0}
                    icon={<Icon baseClassName="material-symbols-outlined">home</Icon>}
                    sx={{
                        color: value === 0 ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                        '&.Mui-selected': { color: 'var(--md-sys-color-on-secondary-container)' },
                    }}
                />
                <BottomNavigationAction
                    label="Khách hàng"
                    value={1}
                    icon={<Icon baseClassName="material-symbols-outlined">list_alt</Icon>}
                    sx={{
                        color: value === 1 ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                        '&.Mui-selected': { color: 'var(--md-sys-color-on-secondary-container)' },
                    }}
                />
                <BottomNavigationAction
                    label="Chợ Lead"
                    value={2}
                    icon={<Icon baseClassName="material-symbols-outlined">bolt</Icon>}
                    sx={{
                        color: value === 2 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
                        '&.Mui-selected': { color: 'var(--md-sys-color-primary)' },
                    }}
                />
                <BottomNavigationAction
                    label="Xếp hạng"
                    value={3}
                    icon={<Icon baseClassName="material-symbols-outlined">emoji_events</Icon>}
                    sx={{
                        color: value === 3 ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-surface-variant)',
                        '&.Mui-selected': { color: 'var(--md-sys-color-on-secondary-container)' },
                    }}
                />
            </BottomNavigation>
        </Paper>
    );
};
