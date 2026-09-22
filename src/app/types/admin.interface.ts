export const STATEMENT_CATEGORIES = [
  'Klimaat & Energie',
  'Wonen & Bouwen',
  'Gezondheidszorg',
  'Migratie & Asiel',
  'Financiën & Economie',
  'Onderwijs',
  'Veiligheid & Justitie',
  'Bestuur & Democratie',
] as const;

export type StatementCategory = typeof STATEMENT_CATEGORIES[number];

export interface AdminStatement {
  readonly id: string
  readonly number: number
  readonly text: string
  readonly category: StatementCategory
}

export interface DashboardMetrics {
  readonly activeStatementCount: number
  readonly registeredPartyCount: number
}

export interface PaginatedResult<T> {
  readonly items: readonly T[]
  readonly total: number
  readonly page: number
  readonly pageSize: number
}
