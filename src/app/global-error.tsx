'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            Something went wrong
          </h1>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              background: '#FFD700',
              color: '#0F172A',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
