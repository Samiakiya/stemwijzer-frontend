import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import type { AnswerSummary, MatchingResult, PartyMatch } from '../../../types/matching.interface';
import type { Party } from '../../../types/party.interface';
import { StemwijzerPageService } from '../../stemwijzer-page.service';
import { PartyDetailComponent } from '../party-detail/party-detail.component';
import type { QuizBarTone } from '../quiz-bar/quiz-bar.component';
import { QuizBarComponent } from '../quiz-bar/quiz-bar.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';
import { ResultsSpectrumComponent } from '../results-spectrum/results-spectrum.component';

const STRONG_MATCH = 60;
const WEAK_MATCH = 45;

interface MatchRow {
  readonly match: PartyMatch
  readonly percentage: number
  readonly tone: QuizBarTone
}

// Scherm 3: beste match, overige partijen en het spectrum.
@Component({
  selector: 'stw-results',
  imports: [PartyDetailComponent, QuizBarComponent, QuizIconComponent, ResultsSpectrumComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  public readonly matchingResult = input.required<MatchingResult>();

  public readonly answerSummary = input.required<AnswerSummary>();

  public readonly partyLabels = input<ReadonlyMap<number, string>>(new Map());

  public readonly restart = output();

  public readonly showOverview = output();

  protected readonly bestMatch = computed(() => {
    const match = this.matchingResult().matches.at(0);

    return match === undefined ? null : { match, percentage: this.percentage(match) };
  });

  protected readonly otherMatches = computed<readonly MatchRow[]>(() => this.matchingResult().matches.slice(1).map((match) => {
    const percentage = this.percentage(match);
    let tone: QuizBarTone = 'weak';

    if (percentage >= STRONG_MATCH) {
      tone = 'primary';
    }
    else if (percentage >= WEAK_MATCH) {
      tone = 'medium';
    }

    return { match, percentage, tone };
  }));

  protected readonly selectedParty = signal<Party | null>(null);

  protected readonly partyLoading = signal(false);

  protected readonly partyError = signal<string | null>(null);

  private readonly service = inject(StemwijzerPageService);

  protected openPartyDetail(partyId: number): void {
    this.partyLoading.set(true);
    this.partyError.set(null);

    this.service.getParty(partyId).subscribe({
      next: (party) => {
        this.partyLoading.set(false);
        this.selectedParty.set(party);
      },
      error: () => {
        this.partyLoading.set(false);
        this.partyError.set('De partij-informatie kon niet worden geladen. Probeer het opnieuw.');
      },
    });
  }

  protected closePartyDetail(): void {
    this.selectedParty.set(null);
  }

  private percentage(match: PartyMatch): number {
    return Math.round(match.matchPercentage ?? 0);
  }
}
