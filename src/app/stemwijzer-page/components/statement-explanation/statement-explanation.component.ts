import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { PublicStatement } from '../../../types/statement.interface';
import { statementHeading } from '../../quiz';
import type { QuizIconName } from '../quiz-icon/quiz-icon.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

interface ExplanationSection {
  readonly id: string
  readonly title: string
  readonly icon: QuizIconName
  readonly itemIcon: QuizIconName
  readonly tone: 'info' | 'for' | 'against'
  readonly text: string | null
  readonly items: readonly string[]
}

// Scherm 4: de toelichting uit het CMS; lege onderdelen worden niet getoond.
@Component({
  selector: 'stw-statement-explanation',
  imports: [QuizIconComponent],
  templateUrl: './statement-explanation.component.html',
  styleUrl: './statement-explanation.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementExplanationComponent {
  public readonly statement = input.required<PublicStatement>();

  public readonly back = output();

  protected readonly heading = computed(() => statementHeading(this.statement()));

  protected readonly sections = computed<readonly ExplanationSection[]>(() => {
    const statement = this.statement();

    const sections: ExplanationSection[] = [
      { id: 'explanation', title: 'Wat houdt het in?', icon: 'info', itemIcon: 'checkCircle', tone: 'info', text: statement.explanation, items: [] },
      { id: 'consequence', title: 'Wat betekent het als dit gebeurt?', icon: 'compass', itemIcon: 'checkCircle', tone: 'info', text: statement.consequence, items: [] },
      { id: 'for', title: 'Argumenten voor', icon: 'thumbUp', itemIcon: 'checkCircle', tone: 'for', text: null, items: statement.argumentsFor },
      { id: 'against', title: 'Argumenten tegen', icon: 'thumbDown', itemIcon: 'minusCircle', tone: 'against', text: null, items: statement.argumentsAgainst },
    ];

    return sections.filter(section => section.text !== null || section.items.length > 0);
  });
}
