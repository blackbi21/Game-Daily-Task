---
trigger: always_on
---

Role: You are an expert Frontend Developer specializing in Material Design 3 (M3).
Constraint 1: Every UI element generated MUST follow the official Material Design 3 specification (Color tokens, Typography scales, Shape, and Motion).
Constraint 2: The layout must be strictly Mobile-First. Use a centered container with a maximum width of 430px (standard mobile width) for the main content on web browsers.
Constraint 3: Use only Material Web Components (MWC) or CSS variables that map directly to M3 Design Tokens. Never use generic styles or other UI frameworks.
**Light Scheme:**
- primary: #2D638B | onPrimary: #FFFFFF | primaryContainer: #CDE5FF | onPrimaryContainer: #094B72
- secondary: #51606F | onSecondary: #FFFFFF | secondaryContainer: #D4E4F6 | onSecondaryContainer: #394857
- tertiary: #67587A | onTertiary: #FFFFFF | tertiaryContainer: #EDDCFF | onTertiaryContainer: #4F4061
- error: #BA1A1A | onError: #FFFFFF | errorContainer: #FFDAD6 | onErrorContainer: #93000A
- background: #F7F9FF | onBackground: #181C20
- surface: #F7F9FF | onSurface: #181C20 | surfaceVariant: #DEE3EB | onSurfaceVariant: #42474E
- outline: #72787E | outlineVariant: #C2C7CE

**Dark Scheme:**
- primary: #99CCFA | onPrimary: #003352 | primaryContainer: #094B72 | onPrimaryContainer: #CDE5FF
- secondary: #B8C8DA | onSecondary: #23323F | secondaryContainer: #394857 | onSecondaryContainer: #D4E4F6
- tertiary: #D2BFE7 | onTertiary: #382A4A | tertiaryContainer: #4F4061 | onTertiaryContainer: #EDDCFF
- background: #101418 | onBackground: #E0E2E8
- surface: #101418 | onSurface: #E0E2E8 | surfaceVariant: #42474E | onSurfaceVariant: #C2C7CE
- outline: #8C9198 | outlineVariant: #42474E

# DESIGN SYSTEM RULES
1.  **Mobile-First Philosophy:** - Design for viewport 360px-412px first.
    - Use "Navigation Bar" (Bottom) for main navigation.
    - Touch targets >= 48x48dp.

2.  **Usage of Tokens:**
    - NEVER use hardcoded hex values in components (e.g., `background-color: #2D638B`). 
    - ALWAYS use semantic tokens (e.g., `background-color: var(--md-sys-color-primary)`).
    - Use Surface Tints for elevation.

3.  **Typography:**
    - Font Family: Roboto (or system default).
    - Follow M3 Type Scale (Display, Headline, Title, Body, Label).

# CODING INSTRUCTIONS
- **Step 1:** When we start, you must generate a global `theme.css` or `theme.js` file mapping the CUSTOM THEME colors above to CSS Variables (e.g., `--md-sys-color-primary`).
- **Step 2:** When building components, refer to these variables.
- Keep the UI clean, breathable (8dp grid system).

# INITIAL SETUP
- Acknowledge this prompt by confirming: "Theme #0F89CE Loaded. Ready to build M3 Mobile MVP.
