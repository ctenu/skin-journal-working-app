'use client'

interface SliderFieldProps {
  id: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  lowLabel: string
  highLabel: string
}

export default function SliderField({
  id,
  value,
  onChange,
  min = 1,
  max = 5,
  lowLabel,
  highLabel,
}: SliderFieldProps) {
  return (
    <div>
      <div className="slrow">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="slval">{value}</div>
      </div>
      <div className="sllabels">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  )
}
