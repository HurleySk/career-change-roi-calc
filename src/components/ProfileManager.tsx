import { useState, useCallback } from 'react'
import type { CalculatorInputs } from '../types/inputs'
import type { SavedProfile } from '../types/profiles'

interface ProfileManagerProps {
  profiles: SavedProfile[]
  currentInputs: CalculatorInputs
  onSave: (name: string, inputs: CalculatorInputs) => void
  onLoad: (id: string) => CalculatorInputs | null
  onDelete: (id: string) => void
  onApply: (inputs: CalculatorInputs) => void
}

export function ProfileManager({
  profiles,
  currentInputs,
  onSave,
  onLoad,
  onDelete,
  onApply,
}: ProfileManagerProps) {
  const [selectedId, setSelectedId] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSaveStart = useCallback(() => {
    setIsSaving(true)
    setSaveName('')
    setConfirmDelete(false)
  }, [])

  const handleSaveConfirm = useCallback(() => {
    if (!saveName.trim()) return
    onSave(saveName.trim(), currentInputs)
    setIsSaving(false)
    setSaveName('')
  }, [saveName, currentInputs, onSave])

  const handleSaveCancel = useCallback(() => {
    setIsSaving(false)
    setSaveName('')
  }, [])

  const handleLoad = useCallback(() => {
    if (!selectedId) return
    const inputs = onLoad(selectedId)
    if (inputs) {
      onApply(inputs)
    }
  }, [selectedId, onLoad, onApply])

  const handleDeleteRequest = useCallback(() => {
    if (!selectedId) return
    setConfirmDelete(true)
  }, [selectedId])

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedId) return
    onDelete(selectedId)
    setSelectedId('')
    setConfirmDelete(false)
  }, [selectedId, onDelete])

  const handleDeleteCancel = useCallback(() => {
    setConfirmDelete(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSaveConfirm()
      if (e.key === 'Escape') handleSaveCancel()
    },
    [handleSaveConfirm, handleSaveCancel],
  )

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/40 bg-slate-800/30 backdrop-blur-sm px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 mr-1">
        &#9776; Profiles
      </span>

      {/* Dropdown */}
      <select
        aria-label="Saved profiles"
        value={selectedId}
        onChange={(e) => {
          setSelectedId(e.target.value)
          setConfirmDelete(false)
        }}
        className="rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-300 outline-none transition-colors focus:border-cyan-500/50 min-w-[160px] cursor-pointer"
      >
        <option value="">Select a profile...</option>
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Load Button */}
      <button
        type="button"
        onClick={handleLoad}
        disabled={!selectedId}
        className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-slate-700/60 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        &#8681; Load
      </button>

      {/* Save Button / Inline Form */}
      {isSaving ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Profile name..."
            autoFocus
            className="rounded-lg border border-cyan-500/40 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-200 outline-none placeholder-slate-600 w-[160px]"
          />
          <button
            type="button"
            onClick={handleSaveConfirm}
            disabled={!saveName.trim()}
            className="rounded-lg bg-cyan-600/80 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-cyan-500/80 disabled:opacity-40"
          >
            &#10003;
          </button>
          <button
            type="button"
            onClick={handleSaveCancel}
            className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            &#10005;
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSaveStart}
          className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-medium text-cyan-400 transition-all duration-200 hover:bg-cyan-900/40 hover:text-cyan-300"
        >
          &#9998; Save
        </button>
      )}

      {/* Delete Button / Confirm */}
      {confirmDelete ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-400">Delete?</span>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="rounded-lg bg-red-600/80 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500/80"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={handleDeleteCancel}
            className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            No
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleDeleteRequest}
          disabled={!selectedId}
          className="rounded-lg border border-red-500/20 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-400/80 transition-all duration-200 hover:bg-red-900/30 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          &#128465; Delete
        </button>
      )}
    </div>
  )
}
