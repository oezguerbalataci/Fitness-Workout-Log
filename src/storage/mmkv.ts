import { MMKV } from 'react-native-mmkv';

// Create a single MMKV instance for the entire app
export const storage = new MMKV({
  id: 'app-storage', // Unique ID for the storage instance
});

// Zustand storage adapter
export const zustandStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
}; 