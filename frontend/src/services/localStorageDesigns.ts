import { STORAGE_KEY, type SavedDesign } from '../types/persistence'

function isValidSavedDesign(value: unknown): value is SavedDesign {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.nodes) &&
    Array.isArray(candidate.edges)
  )
}

export function readAll(): SavedDesign[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(isValidSavedDesign)
  } catch {
    return []
  }
}

export function writeAll(designs: SavedDesign[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(designs))
    return true
  } catch {
    return false
  }
}

export function isStorageAvailable(): boolean {
  const probeKey = `${STORAGE_KEY}:__probe__`
  try {
    window.localStorage.setItem(probeKey, '1')
    window.localStorage.removeItem(probeKey)
    return true
  } catch {
    return false
  }
}
