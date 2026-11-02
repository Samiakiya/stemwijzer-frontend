import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import type { Answer } from '../types/answer.interface';
import type { AnswerSubmission, AnswerSummary, MatchingResult } from '../types/matching.interface';
import type { PublicStatement } from '../types/statement.interface';
import { AnswersOverviewComponent } from './components/answers-overview/answers-overview.component';
import type { QuizTab } from './components/quiz-bottom-nav/quiz-bottom-nav.component';
import { QuizBottomNavComponent } from './components/quiz-bottom-nav/quiz-bottom-nav.component';
import { QuizHeaderComponent } from './components/quiz-header/quiz-header.component';
import { ResultsComponent } from './components/results/results.component';
import { StatementFlowComponent } from './components/statement-flow/statement-flow.component';
import { StatementWeightingComponent } from './components/statement-weighting/statement-weighting.component';
import type { AnswerState, QuizStatement, QuizView } from './quiz';
import { partyInitials } from './quiz';
import { StemwijzerPageService } from './stemwijzer-page.service';

interface HeaderConfig {
  readonly heading: string
  readonly backLabel: string | null
}

const HEADERS: Record<QuizView, HeaderConfig> = {
  question: { heading: 'Stelling Sessie', backLabel: 'Ga naar de vorige stelling' },
  parties: { heading: 'Partijvergelijking', backLabel: 'Terug naar de stelling' },
  explanation: { heading: 'Stelling Toelichting', backLabel: 'Terug naar de stelling' },
  overview: { heading: 'Overzicht Keuzes', backLabel: null },
  weighting: { heading: 'Gewogen Stellingen', backLabel: 'Terug naar het overzicht' },
  results: { heading: 'Jouw uitslag', backLabel: null },
};

function isTab(view: QuizView): view is QuizTab {
  return view === 'overview' || view === 'weighting' || view === 'results';
}

// Houdt de antwoorden van de kiezer alleen in het geheugen bij; er wordt niets opgeslagen.
@Component({
  selector: 'stw-stemwijzer-page',
  imports: [AnswersOverviewComponent, QuizBottomNavComponent, QuizHeaderComponent, ResultsComponent, StatementFlowComponent, StatementWeightingComponent],
  templateUrl: './stemwijzer-page.component.html',
  styleUrl: './stemwijzer-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StemwijzerPageComponent implements OnInit {
  protected readonly view = signal<QuizView>('question');

  protected readonly statements = signal<readonly QuizStatement[]>([]);

  protected readonly currentIndex = signal(0);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly answers = signal<ReadonlyMap<number, AnswerState>>(new Map());

  protected readonly important = signal<ReadonlySet<number>>(new Set());

  protected readonly matchingResult = signal<MatchingResult | null>(null);

  protected readonly submitting = signal(false);

  protected readonly matchingError = signal<string | null>(null);

  protected readonly total = computed(() => Math.max(this.statements().length, 1));

  protected readonly current = computed(() => this.loaded().get(this.currentIndex()) ?? null);

  protected readonly currentAnswer = computed(() => {
    const statement = this.current();

    return statement === null ? null : this.answers().get(statement.id) ?? null;
  });

  protected readonly header = computed(() => HEADERS[this.view()]);

  protected readonly backDisabled = computed(() => this.view() === 'question' && this.currentIndex() === 0 && !this.returnToOverview());

  protected readonly activeTab = computed<QuizTab | null>(() => {
    const view = this.view();

    return isTab(view) ? view : null;
  });

  protected readonly answerSummary = computed<AnswerSummary>(() => {
    const states = [...this.answers().values()];

    return {
      agree: states.filter(state => state === 'eens').length,
      neutral: states.filter(state => state === 'neutraal').length,
      disagree: states.filter(state => state === 'oneens').length,
      skipped: states.filter(state => state === 'overgeslagen').length,
      total: this.total(),
    };
  });

  // Afkortingen uit de geladen stellingen, voor de labels in het spectrum.
  protected readonly partyLabels = computed(() => {
    const labels = new Map<number, string>();

    for (const statement of this.loaded().values()) {
      for (const party of statement.partyAnswers) {
        labels.set(party.partyId, partyInitials(party.partyName, party.abbreviation));
      }
    }

    return labels;
  });

  private readonly loaded = signal<ReadonlyMap<number, PublicStatement>>(new Map());

  // Na het aanpassen van één antwoord vanuit het overzicht gaat de kiezer daarheen terug.
  private readonly returnToOverview = signal(false);

  private readonly service = inject(StemwijzerPageService);

  public ngOnInit(): void {
    this.service.getAllStatements().subscribe({
      next: (statements) => {
        this.statements.set(statements
          .filter(statement => statement.isActive)
          .sort((left, right) => left.id - right.id)
          .map((statement, index) => ({ id: statement.id, index, text: statement.text, title: statement.title, theme: statement.theme })));
      },
    });
    this.showStatement(0);
  }

  protected handleBack(): void {
    const view = this.view();

    if (view === 'parties' || view === 'explanation') {
      this.view.set('question');
    }
    else if (view === 'weighting') {
      this.view.set('overview');
    }
    else if (this.returnToOverview()) {
      this.returnToOverview.set(false);
      this.view.set('overview');
    }
    else if (this.currentIndex() > 0) {
      this.showStatement(this.currentIndex() - 1);
    }
  }

  protected changeView(view: QuizView): void {
    this.view.set(view);
    window.scrollTo({ top: 0 });
  }

  protected recordAnswer(answer: Answer | null): void {
    const statement = this.current();

    if (statement === null) {
      return;
    }

    this.answers.update(answers => new Map(answers).set(statement.id, answer ?? 'overgeslagen'));
    this.matchingResult.set(null);

    const nextIndex = this.currentIndex() + 1;

    if (this.returnToOverview() || nextIndex >= this.total()) {
      this.returnToOverview.set(false);
      this.changeView('overview');

      return;
    }

    this.showStatement(nextIndex);
  }

  protected editStatement(index: number): void {
    this.returnToOverview.set(true);
    this.showStatement(index);
  }

  protected retry(): void {
    this.showStatement(this.currentIndex());
  }

  protected selectTab(tab: QuizTab): void {
    this.changeView(tab);
  }

  protected toggleImportant(statementId: number): void {
    this.important.update((important) => {
      const next = new Set(important);

      if (!next.delete(statementId)) {
        next.add(statementId);
      }

      return next;
    });
    this.matchingResult.set(null);
  }

  protected skipWeighting(): void {
    this.important.set(new Set());
    this.submitMatching();
  }

  protected submitMatching(): void {
    const answers = this.answers();
    const important = this.important();

    const submission: AnswerSubmission[] = this.statements().map(statement => ({
      statementId: statement.id,
      answer: this.toSubmittedAnswer(answers.get(statement.id)),
      important: important.has(statement.id),
    }));

    this.submitting.set(true);
    this.matchingError.set(null);

    this.service.getMatchingResults(submission).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.matchingResult.set(result);
        this.changeView('results');
      },
      error: () => {
        this.submitting.set(false);
        this.matchingError.set('De uitslag kon niet worden berekend. Controleer de verbinding en probeer het opnieuw.');
      },
    });
  }

  protected restart(): void {
    this.answers.set(new Map());
    this.important.set(new Set());
    this.matchingResult.set(null);
    this.matchingError.set(null);
    this.returnToOverview.set(false);
    this.showStatement(0);
  }

  private showStatement(index: number): void {
    this.errorMessage.set(null);
    this.currentIndex.set(index);
    this.changeView('question');

    if (this.loaded().has(index)) {
      this.prefetch(index + 1);

      return;
    }

    this.service.getStatement(index).subscribe({
      next: (statement) => {
        this.loaded.update(loaded => new Map(loaded).set(index, statement));
        this.prefetch(index + 1);
      },
      error: () => {
        if (this.currentIndex() === index) {
          this.errorMessage.set('De stelling kon niet worden geladen. Controleer de verbinding en probeer het opnieuw.');
        }
      },
    });
  }

  // Haalt de volgende stelling alvast op, zodat die direct verschijnt na het antwoorden.
  private prefetch(index: number): void {
    if (index >= this.statements().length || this.loaded().has(index)) {
      return;
    }

    this.service.getStatement(index).subscribe({
      next: (statement) => {
        this.loaded.update(loaded => new Map(loaded).set(index, statement));
      },
    });
  }

  private toSubmittedAnswer(state: AnswerState | undefined): Answer {
    return state === 'eens' || state === 'oneens' ? state : 'neutraal';
  }
}
