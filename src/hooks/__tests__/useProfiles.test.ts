// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'

// Polyfill localStorage for node environment
const storage = new Map<string, string>()
const localStoragePolyfill = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => { storage.set(key, value) },
  removeItem: (key: string) => { storage.delete(key) },
  clear: () => { storage.clear() },
  get length() { return storage.size },
  key: (index: number) => [...storage.keys()][index] ?? null,
}
Object.defineProperty(globalThis, 'localStorage', { value: localStoragePolyfill, writable: true })

import { loadProfiles, saveProfile, deleteProfile } from '../useProfiles'
import { DEFAULT_INPUTS } from '../../calculations/defaults'

beforeEach(() => {
  localStorage.clear()
})

describe('profile persistence', () => {
  it('returns empty array when no profiles saved', () => {
    expect(loadProfiles()).toEqual([])
  })

  it('saves and loads a profile', () => {
    saveProfile('Test Profile', DEFAULT_INPUTS)
    const profiles = loadProfiles()
    expect(profiles).toHaveLength(1)
    expect(profiles[0].name).toBe('Test Profile')
    expect(profiles[0].inputs).toEqual(DEFAULT_INPUTS)
  })

  it('deletes a profile', () => {
    saveProfile('To Delete', DEFAULT_INPUTS)
    const profiles = loadProfiles()
    deleteProfile(profiles[0].id)
    expect(loadProfiles()).toHaveLength(0)
  })
})
