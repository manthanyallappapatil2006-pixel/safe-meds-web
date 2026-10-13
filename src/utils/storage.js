// LocalStorage persistence helpers with error handling

export const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error loading localStorage key "${key}":`, err);
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving to localStorage key "${key}":`, err);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error removing from localStorage key "${key}":`, err);
  }
};
