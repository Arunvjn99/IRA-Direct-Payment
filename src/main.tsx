import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

// Apply stored theme on load
const stored = localStorage.getItem('ira-theme')
if (stored) {
  try {
    const { state } = JSON.parse(stored) as { state: { theme: string } }
    if (state?.theme) {
      document.documentElement.setAttribute('data-theme', state.theme)
      if (state.theme === 'dark') document.documentElement.classList.add('dark')
    }
  } catch {
    document.documentElement.setAttribute('data-theme', 'light')
  }
} else {
  document.documentElement.setAttribute('data-theme', 'light')
}

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
