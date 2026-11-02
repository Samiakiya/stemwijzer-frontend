import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { QuizIconName } from '../quiz-icon/quiz-icon.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

export type QuizTab = 'overview' | 'weighting' | 'results';

interface TabItem {
  readonly id: QuizTab
  readonly label: string
  readonly icon: QuizIconName
}

// Navigatie tussen de schermen na de laatste stelling; Resultaat werkt pas als de uitslag er is.
@Component({
  selector: 'stw-quiz-bottom-nav',
  imports: [QuizIconComponent],
  templateUrl: './quiz-bottom-nav.component.html',
  styleUrl: './quiz-bottom-nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizBottomNavComponent {
  // null: het huidige scherm hoort niet bij de tabbladen, dan wordt de balk niet getoond.
  public readonly active = input.required<QuizTab | null>();

  public readonly resultsAvailable = input(false);

  public readonly selected = output<QuizTab>();

  protected readonly tabs: readonly TabItem[] = [
    { id: 'overview', label: 'Keuzes', icon: 'list' },
    { id: 'weighting', label: 'Weging', icon: 'scale' },
    { id: 'results', label: 'Resultaat', icon: 'trophy' },
  ];
}
