import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
}

interface AuthActions {
  _setUser: (user: User | null) => void
  _setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  loading: true,

  _setUser: (user) => set({ user }),
  _setLoading: (loading) => set({ loading }),
}))
