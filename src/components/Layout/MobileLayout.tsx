import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';
import { BottomNav } from '../Navigation/BottomNav';

interface MobileLayoutProps {
    children: ReactNode;
    showNav?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showNav = true }) => {
    return (
        <Box
            sx={{
                backgroundColor: 'var(--md-sys-color-background)',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Container
                maxWidth="xs" // roughly 444px
                disableGutters
                sx={{
                    backgroundColor: 'var(--md-sys-color-surface)',
                    minHeight: '100vh',
                    position: 'relative',
                    pb: showNav ? '80px' : 0, // Space for BottomNav
                    boxShadow: '0px 0px 20px rgba(0,0,0,0.1)'
                }}
            >
                <Box sx={{ p: showNav ? 2 : 0 }}>
                    {children}
                </Box>
                {showNav && <BottomNav />}
            </Container>
        </Box>
    );
};
