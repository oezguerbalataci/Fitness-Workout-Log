import { create } from "zustand";
import { storage } from '../storage/mmkv';

const TIMER_KEY = 'timer-state';

interface TimerState {
  startTime: number | null;
  elapsedTime: number;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  updateElapsedTime: () => void;
  checkAndRestoreTimer: () => Promise<boolean>;
}

const loadPersistedState = () => {
  try {
    const savedState = storage.getString(TIMER_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("[Timer] Error loading persisted state:", error);
  }
  return null;
};

const persistState = (state: Partial<TimerState>) => {
  try {
    const stateToSave = {
      startTime: state.startTime,
      elapsedTime: state.elapsedTime,
      isRunning: state.isRunning,
    };
    storage.set(TIMER_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error("[Timer] Error persisting state:", error);
  }
};

export const useTimerStore = create<TimerState>((set, get) => {
  // Try to load initial state
  const savedState = loadPersistedState();
  console.log("[Timer] Loaded initial state:", savedState);

  return {
    startTime: savedState?.startTime ?? null,
    elapsedTime: savedState?.elapsedTime ?? 0,
    isRunning: savedState?.isRunning ?? false,

    checkAndRestoreTimer: async () => {
      console.log("[Timer] Checking timer state...");
      const { startTime, isRunning } = get();
      
      console.log("[Timer] Current state - startTime:", startTime, "isRunning:", isRunning);
      
      if (startTime && isRunning) {
        const now = Date.now();
        const elapsed = now - startTime;
        
        console.log("[Timer] Calculated elapsed time:", elapsed);
        console.log("[Timer] Current time:", now);
        console.log("[Timer] Start time:", startTime);
        
        set({ elapsedTime: elapsed });
        return true;
      }
      return false;
    },

    startTimer: () => {
      const now = Date.now();
      console.log("[Timer] Starting timer at:", now);
      const newState = { 
        startTime: now, 
        isRunning: true, 
        elapsedTime: 0 
      };
      set(newState);
      persistState(newState);
    },

    stopTimer: () => {
      console.log("[Timer] Stopping timer...");
      const { startTime } = get();
      
      if (startTime) {
        const now = Date.now();
        const elapsed = now - startTime;
        console.log("[Timer] Final elapsed time:", elapsed);
        
        const newState = { 
          isRunning: false, 
          elapsedTime: elapsed, 
          startTime: null 
        };
        set(newState);
        persistState(newState);
      }
    },

    resetTimer: () => {
      console.log("[Timer] Resetting timer...");
      const newState = { 
        startTime: null, 
        elapsedTime: 0, 
        isRunning: false 
      };
      set(newState);
      persistState(newState);
    },

    updateElapsedTime: () => {
      const { startTime, isRunning } = get();
      if (startTime && isRunning) {
        const now = Date.now();
        const elapsed = now - startTime;
        const newState = { elapsedTime: elapsed };
        set(newState);
        persistState({ ...get(), ...newState });
      }
    },
  };
});