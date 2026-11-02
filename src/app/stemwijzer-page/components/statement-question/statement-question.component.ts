import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { Answer } from '../../../types/answer.interface';
import type { PublicStatement } from '../../../types/statement.interface';
import type { AnswerState } from '../../quiz';
import { ANSWER_OPTIONS, statementHeading } from '../../quiz';
import { QuizBarComponent } from '../quiz-bar/quiz-bar.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

const PERCENT = 100;
const MIN_PROGRESS = 2;

// Scherm 1: één stelling met de drie antwoordknoppen.
@Component({
  selector: 'stw-statement-question',
  imports: [QuizBarComponent, QuizIconComponent],
  templateUrl: './statement-question.component.html',
  styleUrl: './statement-question.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementQuestionComponent {
  public readonly statement = input.required<PublicStatement>();

  public readonly total = input.required<number>();

  public readonly currentAnswer = input<AnswerState | null>(null);

  public readonly answered = output<Answer | null>();

  public readonly showParties = output();

  public readonly showExplanation = output();

  protected readonly options = ANSWER_OPTIONS;

  protected readonly heading = computed(() => statementHeading(this.statement()));

  protected readonly position = computed(() => this.statement().index + 1);

  protected readonly progress = computed(() => Math.max(this.position() / Math.max(this.total(), 1) * PERCENT, MIN_PROGRESS));
}
