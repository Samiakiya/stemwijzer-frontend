import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandMarkComponent } from '../components/brand-mark/brand-mark.component';
import { SecurityNoticeComponent } from '../components/security-notice/security-notice.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import type { RegisterDetails } from './register-page.interfaces';
import { RegisterPageService } from './register-page.service';

@Component({
  selector: 'stw-register-page',
  imports: [BrandMarkComponent, SecurityNoticeComponent, RegisterFormComponent, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  protected readonly loading = signal(false);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly registerSucceeded = signal(false);

  protected readonly currentYear = new Date().getFullYear();

  private readonly registerPageService = inject(RegisterPageService);

  protected handleRegister(details: RegisterDetails): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.registerPageService.register(details).subscribe({
      next: () => {
        this.loading.set(false);
        this.registerSucceeded.set(true);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(error instanceof Error ? error.message : null);
      },
    });
  }
}
