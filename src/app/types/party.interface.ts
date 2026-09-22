export interface Party {
  readonly id: number
  readonly name: string
  readonly description: string | null
  readonly imageUrl: string | null
  readonly isActive: boolean
  readonly createdAt: string
  readonly updatedAt: string
}
