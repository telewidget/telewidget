import { useState, useCallback } from "react";

/**
 * A hook that syncs state with window.localStorage.
 *
 * @param key - The localStorage key.
 * @param initialValue - The initial value if no value is found in localStorage.
 * @returns [storedValue, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {   
  // Use a state to store the value.
  // Initializer function ensures we only read from localStorage once.
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(prev) : value;

      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }

      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue];
}
