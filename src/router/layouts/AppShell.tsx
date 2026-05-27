import { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, User, Bell, LogOut,
  Sun, Moon, Menu, X, ChevronDown,
} from 'lucide-react'
import { useAuthStore } from '@/core/store/authStore'
import { useThemeStore } from '@/core/store/themeStore'
import { useFeedbackStore } from '@/core/store/feedbackStore'
import { supabase } from '@/lib/supabase'
import GlobalFeedback from '@/features/feedback/GlobalFeedback'

const CORE_LOGO = 'https://vrivhbghtffppkezvkfg.supabase.co/storage/v1/object/public/Logo%20and%20images/CORE%20logo.png'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Payments', href: '/payments', icon: ArrowLeftRight },
  { label: 'IRA Payment', href: '/ira-payment', icon: ArrowLeftRight },
  { label: 'Profile', href: '/profile', icon: User },
]

function isActive(href: string, pathname: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname.startsWith(href)
}

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const setFeedbackOpen = useFeedbackStore((s) => s.setModalOpen)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [hasNotif, setHasNotif] = useState(true)

  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const avatarLetter = (user?.email?.[0] ?? 'U').toUpperCase()

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut()
    signOut()
    navigate('/login')
  }

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
    setNotifOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!userMenuOpen) return
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [userMenuOpen])

  useEffect(() => {
    if (!notifOpen) return
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [notifOpen])

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-page)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--surface-card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src={CORE_LOGO} alt="CORE" className="h-8 w-auto max-w-[100px] object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <span className="hidden sm:block text-xs font-medium text-[var(--text-muted)] border-l border-[var(--border-default)] pl-2.5">IRA Direct Payment</span>
            </div>

            <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, location.pathname)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    data-brand-nav-active={active ? '' : undefined}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                      active ? '' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={toggle}
                className="hidden h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)] sm:flex"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => { setNotifOpen((p) => !p); if (!notifOpen) setHasNotif(false); setUserMenuOpen(false) }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)]"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {hasNotif && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-[var(--surface-card)]" style={{ backgroundColor: 'var(--brand-primary)' }} />
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full z-[60] mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] shadow-[var(--shadow-dropdown)]">
                    <div className="border-b border-[var(--border-default)] px-4 py-3">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Notifications</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-[var(--text-primary)]">IRA Contribution Reminder</p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">You have $1,500 remaining in your 2025 IRA contribution limit.</p>
                    </div>
                    <div className="border-t border-[var(--border-default)] px-4 py-3">
                      <p className="text-sm font-medium text-[var(--text-primary)]">Contribution Confirmed</p>
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Your $500 contribution was processed successfully.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen((o) => !o); setNotifOpen(false) }}
                  className="flex items-center gap-1 rounded-lg border-2 border-transparent bg-[var(--surface-card)] py-1 pl-1 pr-1.5 transition-all hover:bg-[var(--surface-elevated)]"
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: 'var(--brand-primary)' }}>
                    {avatarLetter}
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-600 dark:text-slate-300 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div role="menu" className="absolute right-0 top-full z-[60] mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)] shadow-lg">
                    <div className="px-4 py-3 border-b border-[var(--border-default)]">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.email}</p>
                    </div>
                    <div className="py-1.5">
                      <button role="menuitem" onClick={() => { setFeedbackOpen(true); setUserMenuOpen(false) }} className="flex w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-slate-200/60 dark:hover:bg-white/10">
                        Share Feedback
                      </button>
                    </div>
                    <div className="border-t border-slate-200 dark:border-gray-700">
                      <button role="menuitem" onClick={() => { setUserMenuOpen(false); void handleSignOut() }} className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-slate-200/60 dark:hover:bg-white/10">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)] md:hidden"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-[var(--border-default)] bg-[var(--surface-card)] pb-3 md:hidden">
            <div className="mx-auto max-w-7xl px-4">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href, location.pathname)
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)} data-brand-nav-active={active ? '' : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${active ? 'font-semibold' : 'text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]'}`}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
              <div className="mt-2 border-t border-[var(--border-default)] pt-2">
                <button type="button" onClick={() => { setMobileOpen(false); toggle() }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button type="button" onClick={() => { setMobileOpen(false); void handleSignOut() }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-auto bg-[var(--surface-page)]">
        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-[var(--border-default)] bg-[var(--surface-card)] px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">© 2025 CORE. IRA Direct Payment Portal.</p>
          <img src={CORE_LOGO} alt="CORE" className="h-5 w-auto opacity-40" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
      </footer>

      <GlobalFeedback />
    </div>
  )
}
