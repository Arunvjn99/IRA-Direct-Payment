import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/core/store/authStore'
import AppShell from './layouts/AppShell'
import LoginPage from '@/features/auth/LoginPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import FlowSelectionPage from '@/features/ira-payment/FlowSelectionPage'
import PaymentsPage from '@/features/payments/PaymentsPage'
import NewPaymentLayout from '@/features/payments/NewPaymentLayout'
import Step1Details from '@/features/payments/steps/Step1Details'
import Step2Method from '@/features/payments/steps/Step2Method'
import Step3Gateway from '@/features/payments/steps/Step3Gateway'
import Step4Success from '@/features/payments/steps/Step4Success'

// Flow 1
import Flow1Layout from '@/features/ira-payment/flow1/Flow1Layout'
import F1Eligibility from '@/features/ira-payment/flow1/F1Eligibility'
import F1Settings from '@/features/ira-payment/flow1/F1Settings'
import F1Contribution from '@/features/ira-payment/flow1/F1Contribution'
import F1Bank from '@/features/ira-payment/flow1/F1Bank'
import F1Processing from '@/features/ira-payment/flow1/F1Processing'
import F1Confirmation from '@/features/ira-payment/flow1/F1Confirmation'

// Flow 2
import Flow2Layout from '@/features/ira-payment/flow2/Flow2Layout'
import F2Amount from '@/features/ira-payment/flow2/F2Amount'
import F2Bank from '@/features/ira-payment/flow2/F2Bank'
import F2Processing from '@/features/ira-payment/flow2/F2Processing'
import F2Confirmation from '@/features/ira-payment/flow2/F2Confirmation'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Give Zustand persist a tick to rehydrate from localStorage
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    // If already hydrated synchronously, set immediately
    if (useAuthStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },

      {
        element: (
          <AuthGuard>
            <AppShell />
          </AuthGuard>
        ),
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'payments', element: <PaymentsPage /> },
          {
            path: 'payments/new',
            element: <NewPaymentLayout />,
            children: [
              { index: true, element: <Step1Details /> },
              { path: 'method', element: <Step2Method /> },
              { path: 'gateway', element: <Step3Gateway /> },
              { path: 'success', element: <Step4Success /> },
            ],
          },
          { path: 'ira-payment', element: <FlowSelectionPage /> },

          // Flow 1
          {
            path: 'ira-payment/flow1',
            element: <Flow1Layout />,
            children: [
              { index: true, element: <F1Eligibility /> },
              { path: 'settings', element: <F1Settings /> },
              { path: 'contribution', element: <F1Contribution /> },
              { path: 'bank', element: <F1Bank /> },
              { path: 'processing', element: <F1Processing /> },
              { path: 'confirmation', element: <F1Confirmation /> },
            ],
          },

          // Flow 2
          {
            path: 'ira-payment/flow2',
            element: <Flow2Layout />,
            children: [
              { index: true, element: <F2Amount /> },
              { path: 'bank', element: <F2Bank /> },
              { path: 'processing', element: <F2Processing /> },
              { path: 'confirmation', element: <F2Confirmation /> },
            ],
          },

          // Profile placeholder
          {
            path: 'profile',
            element: (
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-8 text-center">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Profile</h2>
                <p className="text-[var(--text-secondary)] text-sm">Profile settings will be available when linked to the main CORE portal.</p>
              </div>
            ),
          },
        ],
      },
    ],
  },
])

export default router
