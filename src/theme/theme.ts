/* eslint-disable @typescript-eslint/no-empty-object-type */
import { createTheme, Theme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    onPrimary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    onSecondary: string;
    secondaryContainer: string;
    onSecondaryContainer: string;
    tertiary: string;
    onTertiary: string;
    tertiaryContainer: string;
    onTertiaryContainer: string;
    errorContainer: string;
    onErrorContainer: string;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    outline: string;
    outlineVariant: string;
    onBackground: string; // Add explicitly if missing
    onError: string;      // Add explicitly if missing
  }
  interface PaletteOptions {
    onPrimary?: string;
    primaryContainer?: string;
    onPrimaryContainer?: string;
    onSecondary?: string;
    secondaryContainer?: string;
    onSecondaryContainer?: string;
    tertiary?: string;
    onTertiary?: string;
    tertiaryContainer?: string;
    onTertiaryContainer?: string;
    errorContainer?: string;
    onErrorContainer?: string;
    surface?: string;
    onSurface?: string;
    surfaceVariant?: string;
    onSurfaceVariant?: string;
    outline?: string;
    outlineVariant?: string;
    onBackground?: string;
    onError?: string;
  }

  interface TypographyVariants {
    labelLarge: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    labelLarge?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    labelLarge: true;
  }
}

// Light Scheme
const lightPalette = {
  primary: { main: '#2D638B', contrastText: '#FFFFFF' },
  onPrimary: '#FFFFFF',
  primaryContainer: '#CDE5FF',
  onPrimaryContainer: '#094B72',
  secondary: { main: '#51606F', contrastText: '#FFFFFF' },
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D4E4F6',
  onSecondaryContainer: '#394857',
  tertiary: '#67587A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#EDDCFF',
  onTertiaryContainer: '#4F4061',
  error: { main: '#BA1A1A', contrastText: '#FFFFFF' },
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
  background: { default: '#F7F9FF', paper: '#F7F9FF' },
  onBackground: '#181C20',
  surface: '#F7F9FF',
  onSurface: '#181C20',
  surfaceVariant: '#DEE3EB',
  onSurfaceVariant: '#42474E',
  outline: '#72787E',
  outlineVariant: '#C2C7CE',
};

// Dark Scheme
const darkPalette = {
  primary: { main: '#99CCFA', contrastText: '#003352' },
  onPrimary: '#003352',
  primaryContainer: '#094B72',
  onPrimaryContainer: '#CDE5FF',
  secondary: { main: '#B8C8DA', contrastText: '#23323F' },
  onSecondary: '#23323F',
  secondaryContainer: '#394857',
  onSecondaryContainer: '#D4E4F6',
  tertiary: '#D2BFE7',
  onTertiary: '#382A4A',
  tertiaryContainer: '#4F4061',
  onTertiaryContainer: '#EDDCFF',
  background: { default: '#101418', paper: '#101418' },
  onBackground: '#E0E2E8',
  surface: '#101418',
  onSurface: '#E0E2E8',
  surfaceVariant: '#42474E',
  onSurfaceVariant: '#C2C7CE',
  outline: '#8C9198',
  outlineVariant: '#42474E',
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    ...lightPalette,
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    labelLarge: {
      fontSize: '0.9rem', // Approximate M3 labelLarge
      fontWeight: 500,
      lineHeight: '1.25rem',
      letterSpacing: '0.007rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => {
        // Cast themeParam to Theme to ensure it picks up our augmentations
        const t = themeParam as Theme;
        return {
          ':root': {
            '--md-sys-color-primary': t.palette.primary.main,
            '--md-sys-color-on-primary': t.palette.onPrimary,
            '--md-sys-color-primary-container': t.palette.primaryContainer,
            '--md-sys-color-on-primary-container': t.palette.onPrimaryContainer,
            '--md-sys-color-secondary': t.palette.secondary.main,
            '--md-sys-color-on-secondary': t.palette.onSecondary,
            '--md-sys-color-secondary-container': t.palette.secondaryContainer,
            '--md-sys-color-on-secondary-container': t.palette.onSecondaryContainer,
            '--md-sys-color-tertiary': t.palette.tertiary,
            '--md-sys-color-on-tertiary': t.palette.onTertiary,
            '--md-sys-color-tertiary-container': t.palette.tertiaryContainer,
            '--md-sys-color-on-tertiary-container': t.palette.onTertiaryContainer,
            '--md-sys-color-error': t.palette.error.main,
            '--md-sys-color-on-error': t.palette.onError,
            '--md-sys-color-error-container': t.palette.errorContainer,
            '--md-sys-color-on-error-container': t.palette.onErrorContainer,
            '--md-sys-color-background': t.palette.background.default,
            '--md-sys-color-on-background': t.palette.onBackground,
            '--md-sys-color-surface': t.palette.surface,
            '--md-sys-color-on-surface': t.palette.onSurface,
            '--md-sys-color-surface-variant': t.palette.surfaceVariant,
            '--md-sys-color-on-surface-variant': t.palette.onSurfaceVariant,
            '--md-sys-color-outline': t.palette.outline,
            '--md-sys-color-outline-variant': t.palette.outlineVariant,
          },
        };
      },
    },
  },
});
