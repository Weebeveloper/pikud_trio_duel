import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private router: Router, private _http: HttpClient) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this._http
      .get<any>(`${this.baseUrl}/verify-token`, { headers })
      .pipe(
        map((res) => true), // token is valid
        catchError((err) => {
          this.router.navigate(['/login']); // token invalid
          return of(false);
        })
      );
  }
}
