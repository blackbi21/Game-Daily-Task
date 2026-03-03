import React from 'react';
import { Box, Typography, Button, Icon } from '@mui/material';

export const DetailView = () => {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button startIcon={<Icon baseClassName="material-symbols-outlined">arrow_back</Icon>} sx={{ mr: 1, color: 'var(--md-sys-color-primary)' }}>
                    Back
                </Button>
                <Typography variant="h5" sx={{ color: 'var(--md-sys-color-on-background)' }}>
                    Detail View
                </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                This is a placeholder for the detail view.
            </Typography>
        </Box>
    );
};
