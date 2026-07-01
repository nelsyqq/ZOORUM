const SYNC_DELAY = 1500
const timers = {}

async function fetchAPI(path, options = {}) {
  try {
    const cacheBust = options.method === 'PUT' ? '' : `?_t=${Date.now()}`
    const res = await fetch(path + cacheBust, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    return null
  }
}

export async function loadAllFromCloud() {
  return fetchAPI('/api/data')
}

export function syncToCloud(key, value) {
  clearTimeout(timers[key])
  timers[key] = setTimeout(async () => {
    await fetchAPI('/api/data', {
      method: 'PUT',
      body: JSON.stringify({ [key]: value }),
    })
  }, SYNC_DELAY)
}

export function cancelSync(key) {
  clearTimeout(timers[key])
}
