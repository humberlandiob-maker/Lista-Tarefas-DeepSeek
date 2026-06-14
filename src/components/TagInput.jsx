import { useState, useRef, useEffect } from 'react'
import { X, Plus } from 'lucide-react'

export default function TagInput({ allTags, selectedIds, onChange }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const filtered = allTags.filter(
    (t) => !selectedIds.includes(t.id) && t.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(tag) {
    onChange([...selectedIds, tag.id])
    setSearch('')
    setOpen(false)
  }

  function remove(tagId) {
    onChange(selectedIds.filter((id) => id !== tagId))
  }

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Tags</label>
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-600 dark:bg-gray-700 min-h-[2.5rem] cursor-text focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all"
        onClick={() => ref.current?.querySelector('input')?.focus()}
      >
        {selectedIds.map((id) => {
          const tag = allTags.find((t) => t.id === id)
          if (!tag) return null
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(id) }}
                className="hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )
        })}
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={selectedIds.length === 0 ? 'Adicionar tag...' : ''}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-slate-800 dark:text-gray-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-lg py-1 max-h-48 overflow-y-auto">
          {filtered.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => select(tag)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <span className="flex-1">{tag.name}</span>
              <Plus className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
