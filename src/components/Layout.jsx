import {Link, NavLink, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Layout({children, footer = false}) {
  const navigate = useNavigate()

  const onLogout = () => {
    Cookies.remove('jwt_token')
    navigate('/login', {replace: true})
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Go to dashboard home">
          Go Business
        </Link>
        <nav aria-label="Primary" className="topnav">
          <NavLink to="/">Home</NavLink>
        </nav>
        <button className="ghost-button" type="button" onClick={onLogout}>
          Log out
        </button>
      </header>
      <main>{children}</main>
      {footer ? (
        <footer className="footer">
          <span className="footer-brand">Go Business</span>
          <nav aria-label="Footer" className="footer-nav">
            <a href="/">About</a>
            <a href="/">Privacy</a>
          </nav>
          <span>© 2024 Go Business</span>
        </footer>
      ) : null}
    </div>
  )
}
