export interface Entry {
  id?: number
  created_at?: string
  date: string
  foods: string[]
  stress: number
  sleep: number
  skincare: string[]
  exposures: string[]
  exercise: string
  meds: string[]
  symptoms: string[]
  severity: number
  notes: string
  photo: string | null
  user_id?: string | null
}
