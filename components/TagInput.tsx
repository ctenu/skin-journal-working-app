'use client'

import { useState, useRef, KeyboardEvent } from 'react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag() {
    const v = input.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="tagbox" onClick={() => inputRef.current?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
          <button
            className="tagx"
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(tags.filter((t) => t !== tag)) }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="taginput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  )
}
