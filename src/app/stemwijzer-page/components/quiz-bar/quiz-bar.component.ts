import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type QuizBarTone = 'primary' | 'medium' | 'weak' | 'agree';

const PERCENT = 100;

// Horizontale balk van 0 tot 100; de hoogte zet de ouder met CSS op <stw-quiz-bar>.
@Component({
  selector: 'stw-quiz-bar',
  templateUrl: './quiz-bar.component.html',
  styleUrl: './quiz-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizBarComponent {
  public readonly value = input.required<number>();

  public readonly tone = input<QuizBarTone>('primary');

  protected readonly width = computed(() => Math.min(Math.max(this.value(), 0), PERCENT));
}
