import { create } from 'zustand';

export type TabId = 'today' | 'programme' | 'prehab' | 'nutrition' | 'progress';

interface AppState {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Programme tab
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;

  // Nutrition tab
  nutritionMode: 'trainingDay' | 'restDay' | 'dietBreak' | 'deload';
  setNutritionMode: (mode: 'trainingDay' | 'restDay' | 'dietBreak' | 'deload') => void;

  // Current programme week (user can set this)
  currentWeek: number;
  setCurrentWeek: (week: number) => void;
}

export const useStore = create<AppState>((set) => ({
  activeTab: 'today',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedWeek: 1,
  setSelectedWeek: (week) => set({ selectedWeek: week }),
  selectedDay: 0,
  setSelectedDay: (day) => set({ selectedDay: day }),

  nutritionMode: 'trainingDay',
  setNutritionMode: (mode) => set({ nutritionMode: mode }),

  currentWeek: 1,
  setCurrentWeek: (week) => set({ currentWeek: week }),
}));
