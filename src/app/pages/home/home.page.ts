import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';
import { SQLAdapter } from '../api/sql/sql-adapter';
import { TRIO_DUEL_TIME_PERIOD } from 'src/app/shared/global.vars';

@Component({
  selector: 'pages-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly _currnetUserID = JSON.parse(localStorage.getItem('userId')!)
    .id;
  readonly currentUser$ = this._adapter.getUserById(this._currnetUserID);

  readonly allUsers$ = this._adapter.getAllUsers(this._currnetUserID);

  readonly hasLocationPremission$ = new BehaviorSubject<boolean>(true);
  readonly hasNotificationsPremission$ = new BehaviorSubject<boolean>(true);
  private readonly _myLocation$ = new BehaviorSubject<{
    latitude: number;
    longtitude: number;
  } | null>(null);

  readonly isLoading$ = combineLatest([
    this.currentUser$,
    this.allUsers$,
    this._myLocation$,
  ]).pipe(
    map(() => false),
    startWith(true)
  );

  readonly isUnderTrioDuel$ = this._adapter
    .fetchLastNotificationTimestamp(this._currnetUserID)
    .pipe(
      map((timestampString) => {
        const now = new Date();
        const timestamp = new Date(timestampString);

        const diffMs = now.getTime() - timestamp.getTime();
        const diffHours = diffMs / (1000 * 60 * TRIO_DUEL_TIME_PERIOD);

        const isInTrioDuel = diffHours <= 1;
        return isInTrioDuel;
      })
    );

  constructor(
    private readonly _router: Router,
    private readonly _adapter: SQLAdapter
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._setLocation(position);
      },
      (err) => this.hasLocationPremission$.next(false),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    this.askForNotificationsPremission();
  }

  expnadPersonalDetails(userId: string) {
    this._router.navigate(['/details'], { fragment: String(userId) });
  }

  navigateToHistory() {
    this._router.navigate(['/history']);
  }

  redirectToEnableLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._setLocation(position);
      },
      (err) => this.hasLocationPremission$.next(false),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  async askForNotificationsPremission() {
    const notificationPremission = await Notification.requestPermission();
    if (notificationPremission !== 'granted')
      this.hasNotificationsPremission$.next(false);
    else {
      this.hasNotificationsPremission$.next(true);
      this._setupNotificationsService();
    }
  }

  getDistance(userLatitude: number, userLongtitude: number) {
    if (this._myLocation$.value) {
      const R = 6371;
      const dLat = this._degreesToRadians(
        this._myLocation$.value!.latitude - userLatitude
      );
      const dLon = this._degreesToRadians(
        this._myLocation$.value!.longtitude - userLongtitude
      );
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(this._degreesToRadians(userLatitude)) *
          Math.cos(this._degreesToRadians(this._myLocation$.value!.latitude)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;
      return distanceKm;
    }
    return 0;
  }

  private _degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private _setLocation(position: GeolocationPosition) {
    this._myLocation$.next({
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude,
    });
    this.hasLocationPremission$.next(true);
  }

  private async _setupNotificationsService() {
    await navigator.serviceWorker.register('./sw.js');

    let sw = await navigator.serviceWorker.ready;

    let pushSubscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        'BOn4_tyuY4HYoFB5kyM_352AlN-eOnWD1WjPIfHczqvXTWCA_ByNT3c-Xkz_nXp0D47CAcKsALGT9-6btwJDbco',
    });

    await this._adapter.subscribe(pushSubscription, this._currnetUserID);
  }
}
