import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockAdapter } from '../api/mock/mock-adapter';
import { AuthService } from 'src/app/shared/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'pages-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _http: HttpClient
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
    this._authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Full user details:', res.user);
        console.log('Token:', res.token);

        localStorage.setItem('userId', JSON.stringify(res.userId));
        localStorage.setItem('token', res.token);

        this._router.navigateByUrl('home');
        alert('Login successful!');
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }
}
