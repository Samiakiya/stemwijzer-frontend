export type StatusFilter = 'all' | 'active' | 'inactive';

export interface StatementListFilters {
  readonly search: string
  readonly status: StatusFilter
}

export interface PartyListFilters {
  readonly search: string
}

export interface StatementFormValue {
  readonly text: string
  readonly isActive: boolean
}

export interface PartyFormValue {
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly isActive: boolean
}
