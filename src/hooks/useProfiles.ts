import { useState, useCallback } from 'react'
import type { CalculatorInputs } from '../types/inputs'
import type { SavedProfile } from '../types/profiles'

const STORAGE_KEY = 'career-roi-profiles'

export function loadProfiles(): SavedProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveProfile(name: string, inputs: CalculatorInputs): SavedProfile {
  const profiles = loadProfiles()
  const profile: SavedProfile = {
    id: crypto.randomUUID(),
    name,
    inputs,
    savedAt: new Date().toISOString(),
  }
  profiles.push(profile)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  return profile
}

export function deleteProfile(id: string): void {
  const profiles = loadProfiles().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<SavedProfile[]>(loadProfiles)

  const save = useCallback((name: string, inputs: CalculatorInputs) => {
    const profile = saveProfile(name, inputs)
    setProfiles(loadProfiles())
    return profile
  }, [])

  const remove = useCallback((id: string) => {
    deleteProfile(id)
    setProfiles(loadProfiles())
  }, [])

  const load = useCallback((id: string): CalculatorInputs | null => {
    const profile = profiles.find((p) => p.id === id)
    return profile?.inputs ?? null
  }, [profiles])

  return { profiles, save, remove, load }
}
