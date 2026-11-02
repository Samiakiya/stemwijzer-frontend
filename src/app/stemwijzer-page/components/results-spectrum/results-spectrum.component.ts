import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { PartyMatch, SpectrumPosition } from '../../../types/matching.interface';
import { partyInitials } from '../../quiz';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

interface SpectrumPoint {
  readonly id: number
  readonly label: string
  readonly name: string
  readonly x: number
  readonly y: number
}

const SPECTRUM_MIN = 12;
const SPECTRUM_MAX = 88;
const HALF = 2;
const SPECTRUM_CENTER = (SPECTRUM_MIN + SPECTRUM_MAX) / HALF;
const SPECTRUM_HALF_RANGE = (SPECTRUM_MAX - SPECTRUM_MIN) / HALF;
const CENTER_MARGIN = 0.1;

function toCoordinate(position: number): number {
  return Math.min(Math.max(SPECTRUM_CENTER + position * SPECTRUM_HALF_RANGE, SPECTRUM_MIN), SPECTRUM_MAX);
}

function economicLabel(position: number): string {
  if (Math.abs(position) < CENTER_MARGIN) {
    return 'het economische midden';
  }

  return position < 0 ? 'economisch links' : 'economisch rechts';
}

function culturalLabel(position: number): string {
  if (Math.abs(position) < CENTER_MARGIN) {
    return 'het culturele midden';
  }

  return position < 0 ? 'progressief' : 'conservatief';
}

// Spectrumkaart: links-rechts (economisch) en progressief-conservatief (cultureel), uit de antwoorden berekend.
@Component({
  selector: 'stw-results-spectrum',
  imports: [QuizIconComponent],
  templateUrl: './results-spectrum.component.html',
  styleUrl: './results-spectrum.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsSpectrumComponent {
  public readonly matches = input.required<readonly PartyMatch[]>();

  public readonly userPosition = input.required<SpectrumPosition>();

  public readonly partyLabels = input<ReadonlyMap<number, string>>(new Map());

  protected readonly points = computed<readonly SpectrumPoint[]>(() => this.matches().map(match => ({
    id: match.partyId,
    label: this.partyLabels().get(match.partyId) ?? partyInitials(match.partyName, null),
    name: match.partyName,
    x: toCoordinate(match.economicPosition),
    y: toCoordinate(match.culturalPosition),
  })));

  protected readonly user = computed(() => ({
    x: toCoordinate(this.userPosition().economicPosition),
    y: toCoordinate(this.userPosition().culturalPosition),
  }));

  protected readonly quadrant = computed(() => {
    const { economicPosition, culturalPosition } = this.userPosition();

    return `Je staat ${economicLabel(economicPosition)} en ${culturalLabel(culturalPosition)}.`;
  });

  // De partij die op de kaart het dichtst bij de kiezer staat; los van het matchpercentage.
  protected readonly nearestParty = computed(() => {
    const user = this.userPosition();
    let nearest: PartyMatch | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const match of this.matches()) {
      const distance = Math.hypot(match.economicPosition - user.economicPosition, match.culturalPosition - user.culturalPosition);

      if (distance < nearestDistance) {
        nearest = match;
        nearestDistance = distance;
      }
    }

    return nearest?.partyName ?? null;
  });
}
