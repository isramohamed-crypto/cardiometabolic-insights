import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './AppLayout.css'

// Shell for everything after onboarding: a header (wordmark + section
// title) and a 4-tab footer nav (Routine / Read / Collection / Me), with
// the active section rendered in between via <Outlet />.
function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout
