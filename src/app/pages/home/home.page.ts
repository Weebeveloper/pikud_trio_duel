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

  readonly isLoading$ = combineLatest([this.currentUser$, this.allUsers$]).pipe(
    map(() => false),
    startWith(true)
  );

  readonly isUnderTrioDuel$ = this._adapter
    .fetchLastNotificationTimestamp(this._currnetUserID)
    .pipe(
      map((timestamp) => {
        const lastNotificationDate = new Date(
          String(timestamp).replace(' ', 'T')
        );

        const periodMinutes = TRIO_DUEL_TIME_PERIOD;
        const now = new Date();
        const diffMinutes =
          (now.getTime() - lastNotificationDate.getTime()) / 1000 / 60;
        const isWithinWindow = diffMinutes <= periodMinutes;

        return isWithinWindow;
      })
    );

  constructor(
    private readonly _router: Router,
    private readonly _adapter: SQLAdapter
  ) {}

  _myLocation: { latitude: number; longtitude: number } | null = null;

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

    this._setupNotificationsService();

    this.askForNotificationsPremission();
  }

  expnadPersonalDetails(userId: string) {
    this._router.navigate(['/details'], { fragment: String(userId) });
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
    }
  }

  getDistance(userLatitude: number, userLongtitude: number) {
    const R = 6371;
    const dLat = this._degreesToRadians(
      this._myLocation!.latitude - userLatitude
    );
    const dLon = this._degreesToRadians(
      this._myLocation!.longtitude - userLongtitude
    );
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this._degreesToRadians(userLatitude)) *
        Math.cos(this._degreesToRadians(this._myLocation!.latitude)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;
    return distanceKm;
  }

  private _degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private _setLocation(position: GeolocationPosition) {
    this._myLocation = {
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude,
    };
    this.hasLocationPremission$.next(true);
  }

  private async _setupNotificationsService() {
    const swRegistration = await navigator.serviceWorker.register('./sw.js');

    let sw = await navigator.serviceWorker.ready;

    let pushSubscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        'BOn4_tyuY4HYoFB5kyM_352AlN-eOnWD1WjPIfHczqvXTWCA_ByNT3c-Xkz_nXp0D47CAcKsALGT9-6btwJDbco',
    });

    await this._adapter.subscribe(pushSubscription, this._currnetUserID);
  }
}
