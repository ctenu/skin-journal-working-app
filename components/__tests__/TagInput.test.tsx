// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import TagInput from '@/components/TagInput'

afterEach(cleanup)

function setup(tags: string[] = []) {
  const onChange = vi.fn()
  render(<TagInput tags={tags} onChange={onChange} placeholder="add item" />)
  const input = screen.getByRole('textbox')
  return { input, onChange }
}

// Regression tests: typed text used to be dropped on Save unless Enter was pressed,
// and commas split sentences into fragments
describe('TagInput', () => {
  it('adds an item on Enter', () => {
    const { input, onChange } = setup()
    fireEvent.change(input, { target: { value: 'sushi' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith(['sushi'])
  })

  it('keeps pending text when the field loses focus', () => {
    const { input, onChange } = setup(['oat milk'])
    fireEvent.change(input, { target: { value: 'oatmeal with berries' } })
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith(['oat milk', 'oatmeal with berries'])
  })

  it('does not split on commas', () => {
    const { input, onChange } = setup()
    fireEvent.change(input, { target: { value: 'rice, then spicy ramen' } })
    fireEvent.keyDown(input, { key: ',' })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(onChange).toHaveBeenCalledWith(['rice, then spicy ramen'])
  })

  it('ignores blank input and duplicates', () => {
    const { input, onChange } = setup(['sushi'])
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.blur(input)
    fireEvent.change(input, { target: { value: 'sushi' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).not.toHaveBeenCalled()
  })
})
