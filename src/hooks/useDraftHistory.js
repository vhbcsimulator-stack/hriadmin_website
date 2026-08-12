import { useCallback, useMemo, useState } from 'react'

// How many steps back the editor can walk. Each entry is a full clone of the
// page's content document, so this is a memory ceiling as much as a UX one.
const HISTORY_LIMIT = 50

// Undo/redo stack for the editor's draft. The shape is the classic
// past/present/future triple: `set` pushes the outgoing value onto `past` and
// clears `future` (a new edit invalidates anything that was undone), while undo
// and redo shuffle values between the three.
//
// Granularity follows the editor's commits, not keystrokes: EditableText only
// calls onChange when its Save button is pressed, so one undo step is one
// committed field edit, one added item or one deleted item.
export default function useDraftHistory() {
  const [{ past, present, future }, setHistory] = useState({
    past: [],
    present: null,
    future: [],
  })

  // Accepts a value or an updater, matching the useState API the shell's
  // update/addItem/removeItem helpers already use.
  const set = useCallback((updater) => {
    setHistory((state) => {
      const next = typeof updater === 'function' ? updater(state.present) : updater
      // A no-op edit (re-saving a field without changing it) shouldn't cost an
      // undo step.
      if (next === state.present) return state
      return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: next,
        future: [],
      }
    })
  }, [])

  // Replaces the draft and drops the history — for seeding from the server and
  // for discarding back to the last saved state. Neither is an undoable edit.
  const reset = useCallback((value) => {
    setHistory({ past: [], present: value, future: [] })
  }, [])

  const undo = useCallback(() => {
    setHistory((state) => {
      if (state.past.length === 0) return state
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((state) => {
      if (state.future.length === 0) return state
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      }
    })
  }, [])

  return useMemo(() => ({
    content: present,
    setContent: set,
    resetContent: reset,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  }), [present, set, reset, undo, redo, past.length, future.length])
}
