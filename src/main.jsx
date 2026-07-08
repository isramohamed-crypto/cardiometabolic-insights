import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SavedItemsProvider } from './context/SavedItemsContext'
import { ProfileStageProvider } from './context/ProfileStageContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProfileStageProvider>
      <SavedItemsProvider>
        <App />
      </SavedItemsProvider>
    </ProfileStageProvider>
  </React.StrictMode>
)
