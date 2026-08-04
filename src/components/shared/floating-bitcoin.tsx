'use client'

import React from 'react'

const BTC_ORANGE = '#f7931a'

/** Round to 4 decimal places — helps reduce precision drift during SSR. */
function r4(n: number): number {
  return Math.round(n * 10000) / 10000
}

/** Single Bitcoin ₿ logo rendered as an inline SVG. */
function BitcoinLogo({ size = 24, opacity = 0.18 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={r4(size)}
      height={r4(size)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: r4(opacity), display: 'block' }}
    >
      <circle cx="16" cy="16" r="14" fill={BTC_ORANGE} />
      <text
        x="16"
        y="22.5"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
        fontFamily="Inter, system-ui, sans-serif"
      >
        ₿
      </text>
    </svg>
  )
}

export interface FloatingBitcoinProps {
  /** Number of floating logos to render. */
  count?: number
  /** Optional explicit seed for deterministic placement. */
  seed?: number
}

/** Deterministic pseudo-random in [0, 1) — stable across SSR */
function makeRng(seed = 0): (n: number) => number {
  return (n: number) => {
    const x = Math.sin(seed * 9973 + n * 7919) * 10000
    return x - Math.floor(x)
  }
}

/** Renders many floating Bitcoin ₿ logos that drift around the landing page. */
export function FloatingBitcoin({ count = 18, seed = 0 }: FloatingBitcoinProps) {
  const rng = React.useMemo(() => makeRng(seed), [seed])

  const items = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const rawSize = 20 + rng(i * 9 + 1) * 32
      const rawStartLeft = 5 + rng(i * 9 + 2) * 90
      const rawStartTop = 5 + rng(i * 9 + 3) * 85
      const rawDuration = 4 + rng(i * 9 + 4) * 5
      const rawSpinDuration = 2 + rng(i * 9 + 16) * 3
      const rawDelay = -rng(i * 9 + 5) * 15
      const rawOpacity = 0.7 + rng(i * 9 + 6) * 0.3
      const rawPulseDelay = -rng(i * 9 + 7) * 6
      // Direction variant for diverse movement paths
      const direction = rng(i * 9 + 8) > 0.5 ? 1 : -1
      // Larger drift distances for playful screen movement
      const driftX = (60 + rng(i * 9 + 9) * 140) * direction
      const driftY = (40 + rng(i * 9 + 10) * 100) * (rng(i * 9 + 11) > 0.5 ? 1 : -1)
      // Secondary movement for more complex paths
      const driftX2 = (30 + rng(i * 9 + 12) * 80) * (rng(i * 9 + 13) > 0.5 ? 1 : -1)
      const driftY2 = (25 + rng(i * 9 + 14) * 70) * (rng(i * 9 + 15) > 0.5 ? 1 : -1)

      return {
        id: i,
        size: r4(rawSize),
        startLeft: r4(rawStartLeft),
        startTop: r4(rawStartTop),
        duration: r4(rawDuration),
        spinDuration: r4(rawSpinDuration),
        delay: r4(rawDelay),
        opacity: r4(rawOpacity),
        pulseDelay: r4(rawPulseDelay),
        driftX: r4(driftX),
        driftY: r4(driftY),
        driftX2: r4(driftX2),
        driftY2: r4(driftY2),
      }
    })
  }, [count, rng])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {items.map((item) => (
        <div
          key={item.id}
          className="btc-anim absolute"
          style={{
            left: `${item.startLeft}%`,
            top: `${item.startTop}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            ['--drift-x' as string]: `${item.driftX}px`,
            ['--drift-y' as string]: `${item.driftY}px`,
            ['--drift-x2' as string]: `${item.driftX2}px`,
            ['--drift-y2' as string]: `${item.driftY2}px`,
            perspective: '300px',
            animation: `float-btc-play ${item.duration}s ease-in-out ${item.delay}s infinite, pulse-btc ${r4(item.duration * 0.5)}s ease-in-out ${item.pulseDelay}s infinite both`,
          }}
          suppressHydrationWarning
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              animation: `coin-flip-btc ${item.spinDuration}s linear infinite`,
            }}
          >
            <BitcoinLogo size={item.size} opacity={item.opacity} />
          </div>
        </div>
      ))}
    </div>
  )
}
