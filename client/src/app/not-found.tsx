import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="dashboard">
      <div className="dashboard-content">
        <div className="form-kicker">
          <span className="kicker-line" /> 404
        </div>
        <h1>Page not found.</h1>
        <p className="dashboard-intro">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link className="primary-button success-link" href="/dashboard">
          Go to your workspace <span>→</span>
        </Link>
      </div>
    </main>
  );
}
