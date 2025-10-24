import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockAdapter } from '../api/mock/mock-adapter';
import { AuthService } from 'src/app/shared/authorization/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'pages-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPageComponent implements OnInit {
  readonly errorMessage$ = new BehaviorSubject<string>('');
  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  readonly filters = this._fb.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _http: HttpClient,
    private readonly _fb: FormBuilder
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      // Optionally check with backend if token is valid
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this._http
        .get('http://localhost:3000/api/verify-token', { headers })
        .subscribe({
          next: (res: any) => {
            // Token is valid, redirect to dashboard
            this._router.navigate(['/home']);
          },
          error: (err) => {
            // Token invalid, do nothing, stay on login page
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          },
        });
    }
  }

  onSubmit() {
    this.isLoading$.next(true);

    this._authService
      .login(
        this.filters.controls.name.value!.trim().toLocaleLowerCase(),
        this.filters.controls.password.value!.trim()
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('userId', JSON.stringify(res.userId));
          localStorage.setItem('token', res.token);

          this._router.navigateByUrl('home');
        },
        error: (err) => {
          this.errorMessage$.next('Invalid email or password');
          this.isLoading$.next(false);
        },
      });
  }
}
