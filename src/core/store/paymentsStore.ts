import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Payment {
  id: string
  taxYear: string
  amount: number
  method: 'authorize.net'
  status: 'Success' | 'Pending' | 'Failed'
  date: string
  transactionId: string
  accountLastFour?: string
  cardType?: string
}

interface PaymentsState {
  payments: Payment[]
  addPayment: (p: Payment) => void
  clearPayments: () => void
}

// Seed with a couple of demo payments
const DEMO_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    taxYear: '2024',
    amount: 2000,
    method: 'authorize.net',
    status: 'Success',
    date: 'Apr 15, 2025',
    transactionId: 'AUTH-84729301',
    accountLastFour: '4242',
    cardType: 'Visa',
  },
  {
    id: 'pay-002',
    taxYear: '2025',
    amount: 1500,
    method: 'authorize.net',
    status: 'Success',
    date: 'Jan 10, 2025',
    transactionId: 'AUTH-61820547',
    accountLastFour: '1111',
    cardType: 'Mastercard',
  },
]

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set) => ({
      payments: DEMO_PAYMENTS,
      addPayment: (p) => set((s) => ({ payments: [p, ...s.payments] })),
      clearPayments: () => set({ payments: DEMO_PAYMENTS }),
    }),
    { name: 'ira-payments' }
  )
)
