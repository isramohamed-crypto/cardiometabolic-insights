import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import CheckInFab from '../../components/CheckInFab.jsx'
import './AppLayout.css'

// Shell for everything after onboarding: a header (wordmark + section
// title) and a 4-tab footer nav (Today / Read / Habits / Progress), with
// the active section rendered in between via <Outlet />.
//
// The daily check-in button is mounted here rather than on a page so it
// rides above every tab — it's a thing you can do at any moment, not a
// feature of one screen.
function AppLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__content">
        <Outlet />
      </main>
      <CheckInFab />
      <Footer />
    </div>
  )
}

export default AppLayout
