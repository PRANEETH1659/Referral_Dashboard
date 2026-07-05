import {useEffect, useMemo, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Layout from '../components/Layout'
import {fetchReferrals} from '../lib/api'
import {formatCurrency, formatDate, normalizeDashboardData} from '../lib/formatters'

const PAGE_SIZE = 10

export default function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState({
    metrics: [],
    serviceSummary: {},
    referral: {},
    referrals: [],
  })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const response = await fetchReferrals({
          ...(search ? {search} : {}),
          sort,
        })
        if (active) {
          setDashboard(normalizeDashboardData(response))
        }
      } catch (err) {
        if (active) {
          setError(err.message)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      active = false
    }
  }, [search, sort])

  const referrals = dashboard.referrals
  const totalPages = Math.max(1, Math.ceil(referrals.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  useEffect(() => {
    setPage(1)
  }, [search, sort])

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage)
    }
  }, [page, safePage])

  const currentItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return referrals.slice(start, start + PAGE_SIZE)
  }, [referrals, safePage])

  const summaryText = referrals.length
    ? `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
        safePage * PAGE_SIZE,
        referrals.length,
      )} of ${referrals.length} entries`
    : 'Showing 0–0 of 0 entries'

  const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1)

  const copyValue = async (value, key) => {
    await navigator.clipboard.writeText(value || '')
    setCopied(key)
    window.setTimeout(() => setCopied(''), 1500)
  }

  return (
    <Layout footer>
      <section className="hero">
        <div>
          <h1>Referral Dashboard</h1>
          <p>Track your referrals, earnings, and partner activity in one place.</p>
        </div>
      </section>

      {loading ? <p className="panel">Loading...</p> : null}
      {error ? (
        <p className="panel error-panel" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <div className="dashboard-grid">
          <section className="panel" role="region" aria-label="Overview metrics">
            <h2>Overview</h2>
            <div className="metrics-grid">
              {dashboard.metrics.map(item => (
                <article key={item.id} className="metric-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="panel" aria-label="Service summary">
            <h2>Service summary</h2>
            <div className="summary-grid">
              <div>
                <span>Service</span>
                <strong>{dashboard.serviceSummary.service}</strong>
              </div>
              <div>
                <span>Your Referrals</span>
                <strong>{dashboard.serviceSummary.yourReferrals}</strong>
              </div>
              <div>
                <span>Active Referrals</span>
                <strong>{dashboard.serviceSummary.activeReferrals}</strong>
              </div>
              <div>
                <span>Total Ref. Earnings</span>
                <strong>{dashboard.serviceSummary.totalRefEarnings}</strong>
              </div>
            </div>
          </section>

          <section className="panel" aria-label="Share referral">
            <h2>Refer friends and earn more</h2>
            <div className="share-grid">
              <div>
                <label>Your Referral Link</label>
                <div className="share-row">
                  <input readOnly value={dashboard.referral.link || ''} />
                  <button type="button" onClick={() => copyValue(dashboard.referral.link, 'link')}>
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label>Your Referral Code</label>
                <div className="share-row">
                  <input readOnly value={dashboard.referral.code || ''} />
                  <button type="button" onClick={() => copyValue(dashboard.referral.code, 'code')}>
                    Copy
                  </button>
                </div>
              </div>
              {copied ? <p className="copy-text">Copied {copied}</p> : null}
            </div>
          </section>

          <section className="panel table-panel">
            <div className="table-header">
              <h2>All referrals</h2>
              <div className="table-controls">
                <input
                  aria-label="Search referrals"
                  placeholder="Name or service…"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />
                <label>
                  Sort by date
                  <select value={sort} onChange={event => setSort(event.target.value)}>
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length ? (
                    currentItems.map(item => (
                      <tr
                        key={item.id}
                        onClick={() => navigate(`/referral/${item.id}`)}
                        onKeyDown={event => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            navigate(`/referral/${item.id}`)
                          }
                        }}
                        tabIndex="0"
                      >
                        <td>{item.name}</td>
                        <td>{item.serviceName}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{formatCurrency(item.profit)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-row">
                        No matching entries
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>{summaryText}</span>
              <div className="pagination-controls">
                <button type="button" onClick={() => setPage(safePage - 1)} disabled={safePage === 1}>
                  Previous
                </button>
                {pageNumbers.length > 1
                  ? pageNumbers.map(number => (
                      <button
                        key={number}
                        type="button"
                        className={number === safePage ? 'active-page' : ''}
                        onClick={() => setPage(number)}
                      >
                        {number}
                      </button>
                    ))
                  : null}
                <button
                  type="button"
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </Layout>
  )
}
