import { create } from 'zustand';

interface PageIndexState {
  pageIndex: number;
  increasePageIndex: () => void;
  decreasePageIndex: () => void;
}

export const useStore = create<PageIndexState>((set) => ({
  pageIndex: 1,
  increasePageIndex: () => set({ pageIndex: 2 }),
  decreasePageIndex: () => set({ pageIndex: 1 }),
}));
