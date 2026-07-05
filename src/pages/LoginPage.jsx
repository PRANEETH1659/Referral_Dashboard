import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import {loginUser} from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await loginUser({email, password})
      const token = response?.data?.token
      Cookies.set('jwt_token', token)
      navigate('/', {replace: true})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="login-card">
        <h1>Go Business</h1>
        <p className="subtitle">Sign in to open your referral dashboard.</p>
        <form className="login-form" onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="you@example.com"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {error ? <p className="error-text">{error}</p> : null}
        </form>
      </section>
    </div>
  )
}
