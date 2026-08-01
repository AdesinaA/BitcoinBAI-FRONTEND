/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        /* ── Canvas & surfaces ── */
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        'surface-elevated': 'hsl(var(--surface-elevated))',
        'surface-overlay': 'hsl(var(--surface-overlay))',

        /* ── Hairlines ── */
        border: 'hsl(var(--border))',
        'border-strong': 'hsl(var(--border-strong))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        /* ── Text ── */
        foreground: 'hsl(var(--foreground))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',
        'text-inverse': 'hsl(var(--text-inverse))',

        /* ── Bitcoin Gold (the only accent) ── */
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          hover: 'hsl(var(--accent-hover))',
          active: 'hsl(var(--accent-active))',
          foreground: 'hsl(var(--accent-foreground))',
          soft: 'hsl(var(--accent-soft))',
          muted: 'hsl(var(--accent-muted))',
        },
        gold: 'hsl(var(--accent))',

        /* ── Status ── */
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        danger: {
          DEFAULT: 'hsl(var(--danger))',
          foreground: 'hsl(var(--danger-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },

        /* ── Floating layers & scrim ── */
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        overlay: 'hsl(var(--overlay))',

        /* ── shadcn-compatible aliases ── */
        primary: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--surface-elevated))',
          foreground: 'hsl(var(--text-primary))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },

      borderRadius: {
        sm: 'calc(var(--radius) - 4px)' /* 6px */,
        md: 'calc(var(--radius) - 2px)' /* 8px */,
        lg: 'var(--radius)' /* 10px */,
        xl: 'calc(var(--radius) + 4px)' /* 14px */,
        '2xl': 'calc(var(--radius) + 8px)' /* 18px */,
        full: '9999px',
      },

      /* Layered, restrained shadows — depth comes mostly from borders in dark UI */
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.25)',
        raised:
          '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 4px 12px -2px rgb(0 0 0 / 0.25)',
        floating:
          '0 2px 6px -1px rgb(0 0 0 / 0.35), 0 12px 32px -4px rgb(0 0 0 / 0.4)',
        modal:
          '0 4px 12px -2px rgb(0 0 0 / 0.4), 0 24px 64px -12px rgb(0 0 0 / 0.55)',
        'glow-gold': '0 0 0 1px hsl(var(--accent) / 0.35), 0 4px 24px -4px hsl(var(--accent) / 0.25)',
        /* legacy aliases */
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 4px 12px -2px rgb(0 0 0 / 0.25)',
        elevated:
          '0 2px 6px -1px rgb(0 0 0 / 0.35), 0 12px 32px -4px rgb(0 0 0 / 0.4)',
        glass: '0 12px 32px -4px rgb(0 0 0 / 0.4)',
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'SF Mono',
          'Menlo',
          'JetBrains Mono',
          'monospace',
        ],
      },

      /* ── Layering scale (single source of truth) ── */
      zIndex: {
        sticky: '40',
        dropdown: '50',
        overlay: '90',
        modal: '100',
        toast: '110',
        tooltip: '120',
      },

      /* ── Motion: subtle, professional ── */
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '280ms',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-up': 'fade-up 280ms cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in': 'scale-in 180ms cubic-bezier(0.32, 0.72, 0, 1)',
        shimmer: 'shimmer 2s infinite',
        'pulse-slow': 'pulse-slow 1.6s ease-in-out infinite',
        'accordion-down': 'accordion-down 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        'accordion-up': 'accordion-up 200ms cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}