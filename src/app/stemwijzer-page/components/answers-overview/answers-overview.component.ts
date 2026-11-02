import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { AnswerState, QuizStatement } from '../../quiz';
import { ANSWER_ICONS, ANSWER_LABELS, statementHeading } from '../../quiz';
import type { QuizIconName } from '../quiz-icon/quiz-icon.component';
import { QuizBarComponent } from '../quiz-bar/quiz-bar.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

type OverviewFilter = 'alles' | 'eens' | 'oneens' | 'geen';

interface OverviewRow {
  readonly id: number
  readonly index: number
  readonly heading: string
  readonly theme: string | null
  readonly state: AnswerState
  readonly label: string
  readonly icon: QuizIconName
  readonly badgeClass: string
}

const INITIAL_VISIBLE = 6;
const PERCENT = 100;

const FILTERS: readonly { readonly id: OverviewFilter, readonly label: string, readonly dot: string }[] = [
  { id: 'alles', label: 'Alles', dot: '' },
  { id: 'eens', label: 'Eens', dot: 'dot-eens' },
  { id: 'oneens', label: 'Oneens', dot: 'dot-oneens' },
  { id: 'geen', label: 'Geen', dot: 'dot-geen' },
];

function matchesFilter(state: AnswerState, filter: OverviewFilter): boolean {
  if (filter === 'alles') {
    return true;
  }

  if (filter === 'geen') {
    return state === 'neutraal' || state === 'overgeslagen' || state === 'geen';
  }

  return state === filter;
}

// Scherm 5: alle gegeven antwoorden, met de mogelijkheid er één aan te passen.
@Component({
  selector: 'stw-answers-overview',
  imports: [QuizBarComponent, QuizIconComponent],
  templateUrl: './answers-overview.component.html',
  styleUrl: './answers-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnswersOverviewComponent {
  public readonly statements = input.required<readonly QuizStatement[]>();

  public readonly answers = input.required<ReadonlyMap<number, AnswerState>>();

  public readonly edit = output<number>();

  public readonly toResults = output();

  public readonly restart = output();

  protected readonly filter = signal<OverviewFilter>('alles');

  protected readonly expanded = signal(false);

  protected readonly rows = computed<readonly OverviewRow[]>(() => this.statements().map((statement) => {
    const state = this.answers().get(statement.id) ?? 'geen';

    return {
      id: statement.id,
      index: statement.index,
      heading: statementHeading(statement),
      theme: statement.title === null ? null : statement.theme,
      state,
      label: state === 'geen' ? 'Nog niet beantwoord' : ANSWER_LABELS[state],
      icon: ANSWER_ICONS[state],
      badgeClass: `answer-badge answer-badge-${state}`,
    };
  }));

  protected readonly answeredCount = computed(() => this.rows().filter(row => row.state !== 'geen').length);

  protected readonly complete = computed(() => this.answeredCount() === this.rows().length && this.rows().length > 0);

  protected readonly progress = computed(() => (this.rows().length === 0 ? 0 : this.answeredCount() / this.rows().length * PERCENT));

  protected readonly filters = computed(() => FILTERS.map(item => ({
    ...item,
    count: this.rows().filter(row => matchesFilter(row.state, item.id)).length,
  })));

  protected readonly filteredRows = computed(() => this.rows().filter(row => matchesFilter(row.state, this.filter())));

  protected readonly visibleRows = computed(() => (this.expanded() ? this.filteredRows() : this.filteredRows().slice(0, INITIAL_VISIBLE)));

  protected readonly hiddenCount = computed(() => this.filteredRows().length - this.visibleRows().length);

  protected selectFilter(filter: OverviewFilter): void {
    this.filter.set(filter);
  }

  protected toggleExpanded(): void {
    this.expanded.update(expanded => !expanded);
  }

  protected toggleLabel(): string {
    return this.expanded() ? 'Toon minder stellingen' : `Toon overige ${String(this.hiddenCount())} stellingen`;
  }
}
