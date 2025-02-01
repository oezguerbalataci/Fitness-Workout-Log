import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));

export function useAuth() {
  const { isAuthenticated, signIn, signOut } = useAuthStore();

  return {
    isAuthenticated,
    signIn,
    signOut,
  };
} 