import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import Layout from '../components/Layout'
import {fetchReferrals} from '../lib/api'
import {formatCurrency, formatDate, normalizeReferralDetail} from '../lib/formatters'

export default function ReferralDetailPage() {
  const {id} = useParams()
  const [referral, setReferral] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadReferral() {
      setLoading(true)
      setError('')
      try {
        const response = await fetchReferrals({id})
        if (active) {
          setReferral(normalizeReferralDetail(response, id))
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

    loadReferral()
    return () => {
      active = false
    }
  }, [id])

  return (
    <Layout>
      <section className="detail-page panel">
        {loading ? <p>Loading...</p> : null}
        {!loading && error ? <p role="alert">{error}</p> : null}
        {!loading && !error && !referral ? (
          <>
            <h1>Referral not found</h1>
            <Link to="/">Back to dashboard</Link>
          </>
        ) : null}
        {!loading && !error && referral ? (
          <>
            <h1>Referral Details</h1>
            <h2>{referral.name}</h2>
            <dl className="detail-grid">
              <div>
                <dt>Referral ID</dt>
                <dd>{referral.id}</dd>
              </div>
              <div>
                <dt>Service Name</dt>
                <dd>{referral.serviceName}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{formatDate(referral.date)}</dd>
              </div>
              <div>
                <dt>Profit</dt>
                <dd>{formatCurrency(referral.profit)}</dd>
              </div>
            </dl>
            <Link to="/">Back to dashboard</Link>
          </>
        ) : null}
      </section>
    </Layout>
  )
}
