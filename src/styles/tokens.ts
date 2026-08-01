/**
 * Bitcoin BAI Design System — Tokens
 * -----------------------------------
 * Single source of truth for all design values.
 * Derived from UI-001 Design Language Specification.
 *
 * These tokens are the programmatic representation of the design system.
 * CSS variables in globals.css mirror these values for Tailwind consumption.
 */

/* ──────────────────────────── Colors ──────────────────────────── */

export const colors = {
  // Background — the canvas
  background: {
    DEFAULT: '#0A0A0A',
    dark: '#0A0A0A',
    light: '#FFFFFF',
  },
  // Surface — cards, modals, dropdowns
  surface: {
    DEFAULT: '#121212',
    dark: '#121212',
    light: '#FAFAFA',
    elevated: '#1A1A1A',
    elevatedLight: '#F5F5F5',
  },
  // Border — separators
  border: {
    DEFAULT: '#262626',
    dark: '#262626',
    light: '#E5E5E5',
    strong: '#3A3A3A',
    strongLight: '#D1D1D1',
  },
  // Accent — Bitcoin gold (the ONLY accent color)
  accent: {
    DEFAULT: '#FFD700',
    hover: '#FFC700',
    soft: '#FFEE93',
    muted: '#B8960B',
  },
  // Text
  text: {
    primary: '#F0F0F0',
    primaryLight: '#171717',
    secondary: '#9CA3AF',
    secondaryLight: '#6B7280',
    tertiary: '#6B7280',
    tertiaryLight: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  // Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.6)',
} as const

/* ────────────────────────── Typography ────────────────────────── */

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  fontSize: {
    display: { size: '3rem', lineHeight: '1.1' }, // 48px
    h1: { size: '2rem', lineHeight: '1.2' }, // 32px
    h2: { size: '1.5rem', lineHeight: '1.25' }, // 24px
    h3: { size: '1.25rem', lineHeight: '1.3' }, // 20px
    h4: { size: '1rem', lineHeight: '1.4' }, // 16px
    body: { size: '0.875rem', lineHeight: '1.5' }, // 14px
    small: { size: '0.75rem', lineHeight: '1.4' }, // 12px
    tiny: { size: '0.6875rem', lineHeight: '1.3' }, // 11px
  },
  fontWeight: {
    display: '700',
    heading: '600',
    body: '400',
    label: '500',
  },
  letterSpacing: {
    display: '-0.02em',
    heading: '-0.01em',
    h3: '-0.005em',
    body: '0.01em',
    small: '0.02em',
    tiny: '0.03em',
  },
} as const

/* ─────────────────────────── Spacing ──────────────────────────── */

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  xxl: '2rem', // 32px
  xxxl: '3rem', // 48px
  xxxxl: '4rem', // 64px
} as const

/* ──────────────────────────── Radius ──────────────────────────── */

export const radius = {
  sm: '0.5rem', // 8px
  md: '0.625rem', // 10px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  full: '9999px',
} as const

/* ──────────────────────────── Shadow ──────────────────────────── */

export const shadow = {
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.08)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  elevated: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
  none: 'none',
} as const

/* ──────────────────────────── Motion ──────────────────────────── */

export const motion = {
  duration: {
    instant: '0.01ms',
    fast: '150ms',
    standard: '200ms',
    slow: '250ms',
    slower: '300ms',
    pulse: '1500ms',
    chart: '600ms',
  },
  easing: {
    standard: 'ease-in-out',
    entrance: 'ease-out',
    exit: 'ease-in',
    natural: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  delay: {
    stagger: '50ms',
    modalContent: '100ms',
    drawerContent: '100ms',
  },
} as const

/* ──────────────────────────── Z-Index ──────────────────────────── */

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 90,
  modal: 100,
  toast: 100,
  tooltip: 200,
  header: 30,
  mobileNav: 40,
} as const

/* ──────────────────────────── Combined ──────────────────────────── */

export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  shadow,
  motion,
  zIndex,
} as const

export default tokens
