import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { PersonModel } from 'src/app/shared/models';
import { SQLAdapter } from '../api/sql/sql-adapter';

@Component({
  selector: 'pages-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly _currnetUserID = JSON.parse(localStorage.getItem('userId')!)
    .id;
  readonly currentUser$ = this._adapter.getUserById(this._currnetUserID);

  readonly allUsers$ = this._adapter.getAllUsers(this._currnetUserID);

  constructor(
    private readonly _router: Router,
    private readonly _adapter: SQLAdapter
  ) {}

  expnadPersonalDetails(userId: string) {
    this._router.navigate(['/details'], { fragment: String(userId) });
  }
}
