import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminNavigationComponent } from './components/admin-navigation/admin-navigation.component';

@Component({
  selector: 'stw-admin-page',
  imports: [RouterOutlet, AdminHeaderComponent, AdminNavigationComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  protected readonly userEmail: string;

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  public constructor() {
    this.userEmail = this.authService.getSession()?.email ?? '';
  }

  protected handleLogout(): void {
    this.authService.endSession();
    void this.router.navigateByUrl('/login');
  }
}
