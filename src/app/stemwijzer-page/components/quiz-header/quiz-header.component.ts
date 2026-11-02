import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { QuizIconComponent } from '../quiz-icon/quiz-icon.component';

// Vaste kopbalk van elk quizscherm; zonder terugknop toont hij het StemWijzer-merk.
@Component({
  selector: 'stw-quiz-header',
  imports: [QuizIconComponent],
  templateUrl: './quiz-header.component.html',
  styleUrl: './quiz-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizHeaderComponent {
  public readonly heading = input.required<string>();

  public readonly subtitle = input('ProDemos StemWijzer');

  public readonly backLabel = input<string | null>(null);

  public readonly backDisabled = input(false);

  public readonly back = output();
}
