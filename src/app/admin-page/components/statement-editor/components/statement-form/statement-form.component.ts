import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../components/button/button.component';
import type { StatementFormValue } from '../../../../admin-page.interfaces';

const MIN_TEXT_LENGTH = 10;

interface StatementFormControls {
  readonly text: FormControl<string>
  readonly isActive: FormControl<boolean>
}

@Component({
  selector: 'stw-statement-form',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './statement-form.component.html',
  styleUrl: './statement-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementFormComponent {
  public readonly initialValue = input<StatementFormValue | null>(null);

  public readonly loading = input(false);

  public readonly submitForm = output<StatementFormValue>();

  public readonly cancelled = output();

  protected readonly form = new FormGroup<StatementFormControls>({
    text: new FormControl('', {
      nonNullable: true,
      validators: [
        (control: AbstractControl): ValidationErrors | null => Validators.required(control),
        Validators.minLength(MIN_TEXT_LENGTH),
      ],
    }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  public constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value !== null) {
        this.form.setValue(value);
      }
    });
  }

  protected isTextInvalid(): boolean {
    const control = this.form.controls.text;

    return control.invalid && (control.dirty || control.touched);
  }

  protected textErrorMessage(): string {
    const control = this.form.controls.text;

    if (control.hasError('required')) {
      return 'De stellingtekst is verplicht.';
    }

    if (control.hasError('minlength')) {
      return `De stellingtekst moet minimaal ${MIN_TEXT_LENGTH} tekens bevatten.`;
    }

    return '';
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();

      return;
    }

    this.submitForm.emit(this.form.getRawValue());
  }
}
