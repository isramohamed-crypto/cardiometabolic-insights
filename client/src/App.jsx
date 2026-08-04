import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding.jsx'
import NameInput from './pages/onboarding/NameInput.jsx'
import PillarQuestion from './pages/onboarding/PillarQuestion.jsx'
import Summary from './pages/onboarding/Summary.jsx'
import HealthConditions from './pages/onboarding/HealthConditions.jsx'
import FocusAreas from './pages/onboarding/FocusAreas.jsx'
import Recommendations from './pages/onboarding/Recommendations.jsx'
import AppLayout from './pages/app/AppLayout.jsx'
import Routine from './pages/app/Routine.jsx'
import Read from './pages/app/Read.jsx'
import Collection from './pages/app/Collection.jsx'
import Me from './pages/app/Me.jsx'
import { OnboardingProvider } from './onboarding/OnboardingContext.jsx'

function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/onboarding/name" element={<NameInput />} />
          <Route path="/onboarding/habits/:pillar" element={<PillarQuestion />} />
          <Route path="/onboarding/summary" element={<Summary />} />
          <Route path="/onboarding/health-conditions" element={<HealthConditions />} />
          <Route path="/onboarding/focus" element={<FocusAreas />} />
          <Route path="/onboarding/recommendations" element={<Recommendations />} />

          <Route element={<AppLayout />}>
            <Route path="/routine" element={<Routine />} />
            <Route path="/read" element={<Read />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </OnboardingProvider>
    </BrowserRouter>
  )
}

export default App
