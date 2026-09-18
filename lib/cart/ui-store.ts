import { create } from "zustand";

/**
 * Drawer/visual-feedback state for the cart.
 *
 * Deliberately separate from `useCartStore`: that one is persisted to
 * localStorage, and "the drawer was open" is not something we want to restore
 * on the next visit.
 */
interface CartUiState {
  isDrawerOpen: boolean;
  /** Bumped on every add, so the header badge can replay its pop animation. */
  bumpKey: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  bump: () => void;
}

export const useCartUiStore = create<CartUiState>()((set) => ({
  isDrawerOpen: false,
  bumpKey: 0,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  bump: () => set((s) => ({ bumpKey: s.bumpKey + 1 })),
}));
