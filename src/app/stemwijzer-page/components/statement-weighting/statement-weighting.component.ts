import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { QuizStatement } from '../../quiz';
import { statementHeading } from '../../quiz';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

// Scherm 6: de kiezer kiest stellingen die dubbel meetellen in de uitslag.
@Component({
  selector: 'stw-statement-weighting',
  imports: [QuizIconComponent],
  templateUrl: './statement-weighting.component.html',
  styleUrl: './statement-weighting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementWeightingComponent {
  public readonly statements = input.required<readonly QuizStatement[]>();

  public readonly important = input.required<ReadonlySet<number>>();

  public readonly submitting = input(false);

  public readonly errorMessage = input<string | null>(null);

  public readonly toggled = output<number>();

  public readonly submitted = output();

  public readonly skipped = output();

  protected readonly rows = computed(() => this.statements().map(statement => ({
    id: statement.id,
    heading: statementHeading(statement),
    text: statement.text,
    selected: this.important().has(statement.id),
  })));

  protected readonly selectedCount = computed(() => this.rows().filter(row => row.selected).length);
}
