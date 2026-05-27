import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/core/store/authStore'
import {
  ArrowRight, TrendingUp, DollarSign, Calendar, Shield,
  Clock, CheckCircle, AlertCircle, ChevronRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const chartData = [
  { month: 'Jan', balance: 28000 },
  { month: 'Feb', balance: 29200 },
  { month: 'Mar', balance: 30100 },
  { month: 'Apr', balance: 31400 },
  { month: 'May', balance: 32800 },
  { month: 'Jun', balance: 34506 },
]

const RECENT_ACTIVITY = [
  { id: 1, type: 'contribution', label: 'IRA Contribution', amount: '+$500.00', date: 'May 22, 2025', status: 'completed', icon: CheckCircle, color: 'text-emerald-500' },
  { id: 2, type: 'contribution', label: 'IRA Contribution', amount: '+$500.00', date: 'Apr 22, 2025', status: 'completed', icon: CheckCircle, color: 'text-emerald-500' },
  { id: 3, type: 'pending', label: 'Scheduled Contribution', amount: '$500.00', date: 'Jun 22, 2025', status: 'pending', icon: Clock, color: 'text-amber-500' },
  { id: 4, type: 'alert', label: 'Contribution Limit Update', amount: '', date: 'Jan 1, 2025', status: 'info', icon: AlertCircle, color: 'text-blue-500' },
]

const QUICK_STATS = [
  { label: '2025 Contribution Limit', value: '$7,000', sub: '$1,500 remaining', color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40' },
  { label: 'YTD Contributions', value: '$5,500', sub: '↑ $500 this month', color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40' },
  { label: 'Total Balance', value: '$34,506', sub: '↑ 6.2% YTD', color: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40' },
  { label: 'Next Contribution', value: 'Jun 22', sub: '$500 scheduled', color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const firstName = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Hello, {firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Here's your IRA overview for 2025.</p>
        </div>
        <button
          onClick={() => navigate('/ira-payment')}
          className="btn-brand flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shrink-0"
        >
          <DollarSign className="h-4 w-4" />
          Make IRA Payment
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-4 ${stat.color}`}>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">IRA Balance History</h2>
              <p className="text-xs text-[var(--text-muted)]">Traditional IRA · 2025</p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full text-xs font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              +6.2%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-blue)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Balance']}
                contentStyle={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: '0.75rem', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="balance" stroke="var(--chart-blue)" strokeWidth={2} fill="url(#balanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* IRA Payment CTA Card */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
              <DollarSign className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text-primary)]">IRA Direct Payment</h2>
              <p className="text-xs text-[var(--text-muted)]">Make a contribution</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 mb-4">
            <div className="rounded-xl bg-[var(--surface-elevated)] p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--text-secondary)]">2025 Limit</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">$7,000</span>
              </div>
              <div className="h-2 bg-[var(--border-default)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '78.5%', background: 'var(--color-primary)' }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[var(--text-muted)]">$5,500 contributed</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>$1,500 left</span>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { icon: Shield, label: 'Secure bank transfer', color: 'text-emerald-500' },
                { icon: Calendar, label: 'Schedule recurring contributions', color: 'text-blue-500' },
                { icon: Clock, label: 'Process in 1-3 business days', color: 'text-purple-500' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <span className="text-xs text-[var(--text-secondary)]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/ira-payment')}
            className="btn-brand w-full rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            Start IRA Payment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Recent Activity</h2>
          <button
            onClick={() => navigate('/ira-payment')}
            className="flex items-center gap-1 text-sm font-semibold hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-primary)' }}
          >
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="divide-y divide-[var(--border-default)]">
          {RECENT_ACTIVITY.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--surface-elevated)] transition-colors">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-[var(--surface-elevated)]`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.date}</p>
              </div>
              {item.amount && (
                <span className={`text-sm font-semibold ${item.type === 'contribution' ? 'text-emerald-500' : 'text-[var(--text-secondary)]'}`}>
                  {item.amount}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                item.status === 'pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400' :
                'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
