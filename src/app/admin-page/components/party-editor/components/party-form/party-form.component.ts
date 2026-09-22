import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../components/button/button.component';
import type { PartyFormValue } from '../../../../admin-page.interfaces';

const MAX_NAME_LENGTH = 100;

interface PartyFormControls {
  readonly name: FormControl<string>
  readonly description: FormControl<string>
  readonly imageUrl: FormControl<string>
  readonly isActive: FormControl<boolean>
}

function toNullIfEmpty(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === '' ? null : trimmed;
}

@Component({
  selector: 'stw-party-form',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './party-form.component.html',
  styleUrl: './party-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartyFormComponent {
  public readonly initialValue = input<PartyFormValue | null>(null);

  public readonly loading = input(false);

  public readonly submitForm = output<PartyFormValue>();

  public readonly cancelled = output();

  protected readonly form = new FormGroup<PartyFormControls>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        (control: AbstractControl): ValidationErrors | null => Validators.required(control),
        Validators.maxLength(MAX_NAME_LENGTH),
      ],
    }),
    description: new FormControl('', { nonNullable: true }),
    imageUrl: new FormControl('', { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  public constructor() {
    effect(() => {
      const value = this.initialValue();

      if (value !== null) {
        this.form.setValue({
          name: value.name,
          description: value.description ?? '',
          imageUrl: value.imageUrl ?? '',
          isActive: value.isActive,
        });
      }
    });
  }

  protected isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();

      return;
    }

    const raw = this.form.getRawValue();

    this.submitForm.emit({
      name: raw.name.trim(),
      description: toNullIfEmpty(raw.description),
      imageUrl: toNullIfEmpty(raw.imageUrl),
      isActive: raw.isActive,
    });
  }
}
