import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding.jsx'
import NameInput from './pages/onboarding/NameInput.jsx'
import SexAtBirth from './pages/onboarding/SexAtBirth.jsx'
import FoundationIntro from './pages/onboarding/FoundationIntro.jsx'
import PillarQuestion from './pages/onboarding/PillarQuestion.jsx'
import Summary from './pages/onboarding/Summary.jsx'
import HealthConditions from './pages/onboarding/HealthConditions.jsx'
import FocusAreas from './pages/onboarding/FocusAreas.jsx'
import Recommendations from './pages/onboarding/Recommendations.jsx'
import ConnectSteps from './pages/onboarding/ConnectSteps.jsx'
import CreateAccount from './pages/onboarding/CreateAccount.jsx'
import AllSet from './pages/onboarding/AllSet.jsx'
import AppLayout from './pages/app/AppLayout.jsx'
import Routine from './pages/app/Routine.jsx'
import Read from './pages/app/Read.jsx'
import Collection from './pages/app/Collection.jsx'
import Me from './pages/app/Me.jsx'
import HabitDetail from './pages/app/HabitDetail.jsx'
import HabitEdit from './pages/app/HabitEdit.jsx'
import HabitChat from './pages/app/HabitChat.jsx'
import HealthCheck from './pages/app/HealthCheck.jsx'
import { OnboardingProvider } from './onboarding/OnboardingContext.jsx'
import { HabitsProvider } from './habits/HabitsContext.jsx'
import { FavoritesProvider } from './content/FavoritesContext.jsx'
import DemoSeeder from './demo/DemoSeeder.jsx'

function App() {
  return (
    <BrowserRouter>
      <OnboardingProvider>
        <HabitsProvider>
          <FavoritesProvider>
            <DemoSeeder />
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/onboarding/name" element={<NameInput />} />
              <Route path="/onboarding/sex" element={<SexAtBirth />} />
              <Route path="/onboarding/habits-intro" element={<FoundationIntro />} />
              <Route path="/onboarding/habits/:pillar" element={<PillarQuestion />} />
              <Route path="/onboarding/summary" element={<Summary />} />
              <Route path="/onboarding/health-conditions" element={<HealthConditions />} />
              <Route path="/onboarding/focus" element={<FocusAreas />} />
              <Route path="/onboarding/recommendations" element={<Recommendations />} />
              <Route path="/connect" element={<ConnectSteps />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/all-set" element={<AllSet />} />
              <Route path="/habit/:habitId" element={<HabitDetail />} />
              <Route path="/habit/:habitId/edit" element={<HabitEdit />} />
              <Route path="/habit/:habitId/chat" element={<HabitChat />} />
              <Route path="/health-check" element={<HealthCheck />} />

              <Route element={<AppLayout />}>
                <Route path="/routine" element={<Routine />} />
                <Route path="/read" element={<Read />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/me" element={<Me />} />
              </Route>
            </Routes>
          </FavoritesProvider>
        </HabitsProvider>
      </OnboardingProvider>
    </BrowserRouter>
  )
}

export default App
