import { create } from 'zustand'

interface FeedbackState {
  modalOpen: boolean
  toastMessage: string | null
  setModalOpen: (v: boolean) => void
  showToast: (msg: string) => void
  clearToast: () => void
}

export const useFeedbackStore = create<FeedbackState>()((set) => ({
  modalOpen: false,
  toastMessage: null,
  setModalOpen: (v) => set({ modalOpen: v }),
  showToast: (msg) => set({ toastMessage: msg }),
  clearToast: () => set({ toastMessage: null }),
}))
