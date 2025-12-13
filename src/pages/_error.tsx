import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
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
          {statusCode === 404 ? 'Page Not Found' : 'An Error Occurred'}
        </h1>
        <p style={{
          color: '#9ca3af',
          marginBottom: '2rem',
        }}>
          {statusCode === 404
            ? "We couldn't find the page you're looking for."
            : 'We apologize for the inconvenience. Please try again later.'}
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

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
