import type { Answer } from './answer.interface';

export interface PartyAnswer {
  readonly partyId: number
  readonly partyName: string
  readonly answer: Answer | null
}

export interface Statement {
  readonly index: number
  readonly id: number
  readonly text: string
  readonly partyAnswers: readonly PartyAnswer[]
}
