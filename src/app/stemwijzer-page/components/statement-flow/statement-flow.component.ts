import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { Answer } from '../../../types/answer.interface';
import type { PublicStatement } from '../../../types/statement.interface';
import type { AnswerState, QuizView } from '../../quiz';
import { PartyPositionsComponent } from '../party-positions/party-positions.component';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';
import { StatementExplanationComponent } from '../statement-explanation/statement-explanation.component';
import { StatementQuestionComponent } from '../statement-question/statement-question.component';

// De schermen rond één stelling: de vraag, wat partijen vinden en de toelichting, plus laden en fouten.
@Component({
  selector: 'stw-statement-flow',
  imports: [PartyPositionsComponent, QuizIconComponent, StatementExplanationComponent, StatementQuestionComponent],
  templateUrl: './statement-flow.component.html',
  styleUrl: './statement-flow.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementFlowComponent {
  public readonly view = input.required<QuizView>();

  public readonly statement = input<PublicStatement | null>(null);

  public readonly total = input.required<number>();

  public readonly currentAnswer = input<AnswerState | null>(null);

  public readonly errorMessage = input<string | null>(null);

  public readonly answered = output<Answer | null>();

  public readonly viewChanged = output<QuizView>();

  public readonly retry = output();
}
