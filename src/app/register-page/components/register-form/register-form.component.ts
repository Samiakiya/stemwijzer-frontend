import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../components/button/button.component';
import { PasswordToggleComponent } from '../../../components/password-toggle/password-toggle.component';
import type { RegisterDetails } from '../../register-page.interfaces';

const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;

interface RegisterFormControls {
  readonly fullName: FormControl<string>
  readonly email: FormControl<string>
  readonly password: FormControl<string>
  readonly confirmPassword: FormControl<string>
}

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  if (!(group instanceof FormGroup)) {
    return null;
  }

  const passwordValue: unknown = group.get('password')?.value;
  const confirmPasswordValue: unknown = group.get('confirmPassword')?.value;

  if (typeof confirmPasswordValue === 'string' && confirmPasswordValue !== '' && confirmPasswordValue !== passwordValue) {
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'stw-register-form',
  imports: [ReactiveFormsModule, ButtonComponent, PasswordToggleComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  public readonly loading = input(false);

  public readonly submitRegister = output<RegisterDetails>();

  protected readonly passwordVisible = signal(false);

  protected readonly confirmPasswordVisible = signal(false);

  protected readonly form = new FormGroup<RegisterFormControls>({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [
        (control: AbstractControl): ValidationErrors | null => Validators.required(control),
        Validators.minLength(MIN_NAME_LENGTH),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        (control: AbstractControl): ValidationErrors | null => Validators.required(control),
        (control: AbstractControl): ValidationErrors | null => Validators.email(control),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        (control: AbstractControl): ValidationErrors | null => Validators.required(control),
        Validators.minLength(MIN_PASSWORD_LENGTH),
      ],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [(control: AbstractControl): ValidationErrors | null => Validators.required(control)],
    }),
  }, { validators: [passwordsMatchValidator] });

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible.update(visible => !visible);
  }

  protected isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  protected fullNameErrorMessage(): string {
    const control = this.form.controls.fullName;

    if (control.hasError('required')) {
      return 'Naam is verplicht.';
    }

    if (control.hasError('minlength')) {
      return `Naam moet minimaal ${MIN_NAME_LENGTH} tekens bevatten.`;
    }

    return '';
  }

  protected emailErrorMessage(): string {
    const control = this.form.controls.email;

    if (control.hasError('required')) {
      return 'E-mailadres is verplicht.';
    }

    if (control.hasError('email')) {
      return 'Vul een geldig e-mailadres in.';
    }

    return '';
  }

  protected passwordErrorMessage(): string {
    const control = this.form.controls.password;

    if (control.hasError('required')) {
      return 'Wachtwoord is verplicht.';
    }

    if (control.hasError('minlength')) {
      return `Wachtwoord moet minimaal ${MIN_PASSWORD_LENGTH} tekens bevatten.`;
    }

    return '';
  }

  protected confirmPasswordErrorMessage(): string {
    const control = this.form.controls.confirmPassword;

    if (control.hasError('required')) {
      return 'Bevestig je wachtwoord.';
    }

    if (this.form.hasError('passwordMismatch')) {
      return 'Wachtwoorden komen niet overeen.';
    }

    return '';
  }

  protected isConfirmPasswordInvalid(): boolean {
    const control = this.form.controls.confirmPassword;
    const touchedOrDirty = control.dirty || control.touched;

    return touchedOrDirty && (control.invalid || this.form.hasError('passwordMismatch'));
  }

  protected handleSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();

      return;
    }

    const { fullName, email, password } = this.form.getRawValue();

    this.submitRegister.emit({ fullName, email, password });
  }
}
