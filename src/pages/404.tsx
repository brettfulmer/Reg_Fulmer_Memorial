function Custom404() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '1rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          fontWeight: '400',
        }}>
          Page Not Found
        </h1>
        <p style={{
          color: '#9ca3af',
          marginBottom: '2rem',
        }}>
          We couldn&apos;t find the page you&apos;re looking for.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#d4a861',
            color: '#0a0a0a',
            borderRadius: '0.75rem',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          Return Home
        </a>
      </div>
    </div>
  )
}

export default Custom404
