import type { Answer } from '../types/answer.interface';
import type { StatementDetails } from '../types/statement.interface';
import type { QuizIconName } from './components/quiz-icon/quiz-icon.component';

// Wat de kiezer of een partij bij een stelling heeft gekozen, inclusief de gevallen zonder echt antwoord.
export type AnswerState = Answer | 'overgeslagen' | 'geen';

export type QuizView = 'question' | 'parties' | 'explanation' | 'overview' | 'weighting' | 'results';

// Een actieve stelling zoals de quiz die in overzichten toont; index is de positie in de vragenlijst.
export interface QuizStatement extends Pick<StatementDetails, 'title' | 'theme'> {
  readonly id: number
  readonly index: number
  readonly text: string
}

export interface AnswerOption {
  readonly value: Answer
  readonly label: string
  readonly icon: QuizIconName
}

export const ANSWER_OPTIONS: readonly AnswerOption[] = [
  { value: 'eens', label: 'Eens', icon: 'thumbUp' },
  { value: 'neutraal', label: 'Geen van beide', icon: 'equals' },
  { value: 'oneens', label: 'Oneens', icon: 'thumbDown' },
];

export const ANSWER_LABELS: Record<AnswerState, string> = {
  eens: 'Eens',
  neutraal: 'Geen van beide',
  oneens: 'Oneens',
  overgeslagen: 'Overgeslagen',
  geen: 'Nog geen standpunt',
};

export const ANSWER_ICONS: Record<AnswerState, QuizIconName> = {
  eens: 'thumbUp',
  neutraal: 'equals',
  oneens: 'thumbDown',
  overgeslagen: 'arrowRight',
  geen: 'minusCircle',
};

// Korte kop van een stelling: de titel uit het CMS, anders het thema, anders een algemene kop.
export function statementHeading(statement: Pick<StatementDetails, 'title' | 'theme'>): string {
  return statement.title ?? statement.theme ?? 'Stelling';
}

const MAX_INITIALS = 3;
const MIN_WORD_LENGTH = 2;

// Afkorting uit het CMS, of de beginletters van de partijnaam als die ontbreekt.
export function partyInitials(name: string, abbreviation: string | null): string {
  if (abbreviation !== null && abbreviation.trim() !== '') {
    return abbreviation.trim();
  }

  return name.split(' ')
    .filter(word => word.length > MIN_WORD_LENGTH)
    .slice(0, MAX_INITIALS)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}
