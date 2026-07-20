import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AchievementState } from './types';

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set) => ({
      unlockedIds: [],
      points: 0,
      unlockAchievement: (id, pointsToAdd) =>
        set((state) => {
          if (state.unlockedIds.includes(id)) return state;
          return {
            unlockedIds: [...state.unlockedIds, id],
            points: state.points + pointsToAdd,
          };
        }),
    }),
    {
      name: 'type100-achievements',
    }
  )
);
