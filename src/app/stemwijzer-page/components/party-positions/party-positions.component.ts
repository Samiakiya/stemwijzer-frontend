import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { PublicStatement } from '../../../types/statement.interface';
import type { AnswerState } from '../../quiz';
import { ANSWER_ICONS, ANSWER_LABELS, partyInitials } from '../../quiz';
import type { QuizIconName } from '../quiz-icon/quiz-icon.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

type PartyFilter = 'alles' | Exclude<AnswerState, 'overgeslagen'>;

interface FilterChip {
  readonly id: PartyFilter
  readonly label: string
  readonly count: number
}

interface PartyCard {
  readonly id: number
  readonly name: string
  readonly initials: string
  readonly color: string
  readonly textColor: string
  readonly fontSize: number
  readonly state: Exclude<AnswerState, 'overgeslagen'>
  readonly answerLabel: string
  readonly answerIcon: QuizIconName
  readonly badgeClass: string
  readonly explanation: string | null
}

const DEFAULT_PARTY_COLOR = '#0B2A86';
const LONG_INITIALS = 3;
const SMALL_FONT = 9;
const NORMAL_FONT = 12;

const DARK_TEXT_COLOR = '#0D1430';
const LIGHT_LUMINANCE = 0.55;
const HEX_RADIX = 16;
const MAX_CHANNEL = 255;
const RED_WEIGHT = 0.299;
const GREEN_WEIGHT = 0.587;
const BLUE_WEIGHT = 0.114;
const HEX_COLOR_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/iu;

function isLightColor(color: string): boolean {
  const match = HEX_COLOR_PATTERN.exec(color);

  if (match === null) {
    return false;
  }

  const [red, green, blue] = match.slice(1).map(channel => Number.parseInt(channel, HEX_RADIX) / MAX_CHANNEL);

  return RED_WEIGHT * red + GREEN_WEIGHT * green + BLUE_WEIGHT * blue > LIGHT_LUMINANCE;
}

const FILTER_LABELS: Record<PartyFilter, string> = {
  alles: 'Alles',
  eens: 'Eens',
  oneens: 'Oneens',
  neutraal: 'Geen van beide',
  geen: 'Nog geen standpunt',
};

// Scherm 2: de standpunten en uitleg van alle actieve partijen bij de huidige stelling.
@Component({
  selector: 'stw-party-positions',
  imports: [QuizIconComponent],
  templateUrl: './party-positions.component.html',
  styleUrl: './party-positions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyPositionsComponent {
  public readonly statement = input.required<PublicStatement>();

  public readonly total = input.required<number>();

  public readonly back = output();

  public readonly continued = output();

  protected readonly filter = signal<PartyFilter>('alles');

  protected readonly parties = computed<readonly PartyCard[]>(() => this.statement().partyAnswers.map((party) => {
    const state = party.answer ?? 'geen';
    const initials = partyInitials(party.partyName, party.abbreviation);

    return {
      id: party.partyId,
      name: party.partyName,
      initials,
      color: party.color ?? DEFAULT_PARTY_COLOR,
      textColor: isLightColor(party.color ?? DEFAULT_PARTY_COLOR) ? DARK_TEXT_COLOR : party.color ?? DEFAULT_PARTY_COLOR,
      fontSize: initials.length > LONG_INITIALS ? SMALL_FONT : NORMAL_FONT,
      state,
      answerLabel: ANSWER_LABELS[state],
      answerIcon: ANSWER_ICONS[state],
      badgeClass: `answer-badge answer-badge-solid answer-badge-${state}`,
      explanation: party.explanation,
    };
  }));

  protected readonly filters = computed<readonly FilterChip[]>(() => {
    const parties = this.parties();
    const ids: readonly PartyFilter[] = ['alles', 'eens', 'oneens', 'neutraal', 'geen'];

    return ids
      .map(id => ({ id, label: FILTER_LABELS[id], count: id === 'alles' ? parties.length : parties.filter(party => party.state === id).length }))
      .filter(chip => chip.id !== 'geen' || chip.count > 0);
  });

  protected readonly visibleParties = computed(() => {
    const filter = this.filter();

    return filter === 'alles' ? this.parties() : this.parties().filter(party => party.state === filter);
  });

  protected selectFilter(filter: PartyFilter): void {
    this.filter.set(filter);
  }
}
