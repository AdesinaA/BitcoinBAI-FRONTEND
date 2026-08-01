import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Global UI state (client-side only).
 * Server data belongs in TanStack Query; this store is strictly for
 * UI concerns such as sidebar visibility, active modals, and preferences.
 */

interface UIState {
  /** Whether the primary sidebar is expanded (desktop). */
  sidebarOpen: boolean
  /** Whether the mobile navigation drawer is open. */
  mobileNavOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileNavOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: 'bai-ui-preferences',
      // Only persist the sidebar preference, not transient mobile nav state.
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
)
