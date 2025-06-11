import { create } from 'zustand';

type ColorMode = 'foreground' | 'background';

interface MapStore {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

export const useMapStore = create<MapStore>()((set) => ({
  colorMode: 'foreground',
  setColorMode: (mode: ColorMode) => set({ colorMode: mode }),
})); 