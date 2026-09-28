import { create } from "zustand";
import { persist } from "zustand/middleware";

type ScheduleGenerationStore = {
  activeJob: any;
  isStatusOpen: boolean;
  setActiveJob: (job: any | ((current: any) => any)) => void;
  mergeActiveJob: (updates: Record<string, any>) => void;
  openStatus: () => void;
  closeStatus: () => void;
  setStatusOpen: (isStatusOpen: boolean) => void;
  clearActiveJob: () => void;
};

export const useScheduleGenerationStore = create<ScheduleGenerationStore>()(
  persist(
    (set) => ({
      activeJob: null,
      isStatusOpen: false,
      setActiveJob: (job) =>
        set((state) => ({
          activeJob: typeof job === "function" ? job(state.activeJob) : job,
        })),
      mergeActiveJob: (updates) =>
        set((state) => ({
          activeJob: {
            ...(state.activeJob || {}),
            ...updates,
          },
        })),
      openStatus: () => set({ isStatusOpen: true }),
      closeStatus: () => set({ isStatusOpen: false }),
      setStatusOpen: (isStatusOpen) => set({ isStatusOpen }),
      clearActiveJob: () => set({ activeJob: null, isStatusOpen: false }),
    }),
    {
      name: "timetableg-schedule-generation",
      partialize: (state) => ({
        activeJob: state.activeJob,
      }),
    },
  ),
);
