const PREFIX = 'zoorum_'

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* quota / private mode */
  }
}

export function loadSession(key) {
  return sessionStorage.getItem(PREFIX + key)
}

export function saveSession(key, value) {
  sessionStorage.setItem(PREFIX + key, value)
}

export function clearSession(key) {
  sessionStorage.removeItem(PREFIX + key)
}
