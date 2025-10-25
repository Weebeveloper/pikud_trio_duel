import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { SQLAdapter } from '../api/sql/sql-adapter';

@Component({
  selector: 'pages-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPageComponent {
  readonly isLoading$ = new BehaviorSubject<boolean>(true);

  readonly allNotifications$ = this._adapter
    .notificationHistory()
    .pipe(tap(() => this.isLoading$.next(false)));

  constructor(
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _adapter: SQLAdapter
  ) {}

  returnToHome() {
    this._router.navigate(['../'], { relativeTo: this._route });
  }
}
