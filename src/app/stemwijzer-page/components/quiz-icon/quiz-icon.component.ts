import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type QuizIconName
  = | 'arrowLeft'
    | 'arrowRight'
    | 'chat'
    | 'check'
    | 'checkCircle'
    | 'chevronDown'
    | 'chevronRight'
    | 'chevronUp'
    | 'compass'
    | 'equals'
    | 'info'
    | 'list'
    | 'minusCircle'
    | 'plus'
    | 'refresh'
    | 'scale'
    | 'sparkle'
    | 'star'
    | 'thumbDown'
    | 'thumbUp'
    | 'trophy';

// Lijniconen op een raster van 24 bij 24; elk icoon is één of meer paden met currentColor.
const ICON_PATHS: Record<QuizIconName, readonly string[]> = {
  arrowLeft: ['M19 12H5', 'M11 18l-6-6 6-6'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
  chat: ['M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z', 'M20 9h0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3h-4'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  checkCircle: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M8 12.5l2.7 2.7L16.5 9.5'],
  chevronDown: ['M6 9l6 6 6-6'],
  chevronRight: ['M9 6l6 6-6 6'],
  chevronUp: ['M6 15l6-6 6 6'],
  compass: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M15.5 8.5l-2 5-5 2 2-5 5-2Z'],
  equals: ['M5 9h14', 'M5 15h14'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M12 11v5', 'M12 8h.01'],
  list: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4 6l1 1 2-2', 'M4 12l1 1 2-2', 'M4 18l1 1 2-2'],
  minusCircle: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M8 12h8'],
  plus: ['M12 5v14', 'M5 12h14'],
  refresh: ['M20 11a8 8 0 1 0-2.3 5.7', 'M20 5v6h-6'],
  scale: ['M12 4v16', 'M7 20h10', 'M5 8h14', 'M5 8l-3 6a3 3 0 0 0 6 0L5 8Z', 'M19 8l-3 6a3 3 0 0 0 6 0l-3-6Z'],
  sparkle: ['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z', 'M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z'],
  star: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.5Z'],
  thumbDown: ['M7 4h9.5a2 2 0 0 1 2 1.6l1.4 7A2 2 0 0 1 18 15h-5l.8 3.6A1.8 1.8 0 0 1 12 21l-5-6V4Z', 'M7 4H4v11h3'],
  thumbUp: ['M7 20h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 18 9h-5l.8-3.6A1.8 1.8 0 0 0 12 3L7 9v11Z', 'M7 20H4V9h3'],
  trophy: ['M8 4h8v5a4 4 0 0 1-8 0V4Z', 'M8 6H5a3 3 0 0 0 3 4', 'M16 6h3a3 3 0 0 1-3 4', 'M12 13v4', 'M8 20h8'],
};

@Component({
  selector: 'stw-quiz-icon',
  templateUrl: './quiz-icon.component.html',
  styleUrl: './quiz-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizIconComponent {
  public readonly name = input.required<QuizIconName>();

  protected readonly paths = computed(() => ICON_PATHS[this.name()]);
}
