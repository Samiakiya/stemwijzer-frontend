import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Statement } from '../types/statement.interface';

@Injectable({
  providedIn: 'root',
})
export class StemwijzerPageService {
  private readonly http = inject(HttpClient);

  public getStatement(index: number): Observable<Statement> {
    const params = new HttpParams().set('index', index.toString());

    return this.http.get<Statement>('/statements', { params });
  }
}
