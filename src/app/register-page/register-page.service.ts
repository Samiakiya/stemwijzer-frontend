import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from '../services/api.service';
import type { RegisterDetails, RegisterResponse } from './register-page.interfaces';

const CONFLICT_STATUS = 409;
const EMAIL_IN_USE_MESSAGE = 'Dit e-mailadres is al in gebruik.';
const REGISTER_FAILED_MESSAGE = 'Registreren is niet gelukt. Probeer het opnieuw.';

@Injectable({
  providedIn: 'root',
})
export class RegisterPageService {
  private readonly api = inject(ApiService);

  public register(details: RegisterDetails): Observable<void> {
    return this.api.post<RegisterResponse>('/auth/register', details).pipe(
      map(() => undefined),
      catchError((error: unknown) => throwError(() => this.toUserFacingError(error))),
    );
  }

  private toUserFacingError(error: unknown): Error {
    if (error instanceof HttpErrorResponse && error.status === CONFLICT_STATUS) {
      return new Error(EMAIL_IN_USE_MESSAGE);
    }

    if (error instanceof Error) {
      return error;
    }

    return new Error(REGISTER_FAILED_MESSAGE);
  }
}
