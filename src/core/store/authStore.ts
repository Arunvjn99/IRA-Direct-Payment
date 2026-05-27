import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: { id: string; email: string } | null
  isDemo: boolean
  setUser: (user: { id: string; email: string } | null) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isDemo: true,
      setUser: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: 'ira-auth' }
  )
)
