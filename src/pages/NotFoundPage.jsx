import {Link} from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <section className="not-found-card">
        <h1>404 - Page Not Found</h1>
        <Link to="/">Back to dashboard</Link>
      </section>
    </div>
  )
}
