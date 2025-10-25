import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  combineLatest,
  map,
  ReplaySubject,
  startWith,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { SQLAdapter } from '../api/sql/sql-adapter';
import { PersonModel } from 'src/app/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TRIO_DUEL_TIME_PERIOD } from 'src/app/shared/global.vars';

@Component({
  selector: 'pages-person_details',
  templateUrl: './person_details.page.html',
  styleUrls: ['./person_details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailsPageComponent implements OnInit, OnDestroy {
  private _map!: any;

  private readonly _currentUserId$ = new ReplaySubject<string>(1);
  readonly currentUser$ = this._currentUserId$.pipe(
    switchMap((id) => this._adapter.getUserById(id))
  );

  private readonly _refresh$ = new Subject<void>();

  readonly isUnderTrioDuel$ = combineLatest([
    this._currentUserId$,
    this._refresh$.pipe(startWith(void 0)),
  ]).pipe(
    switchMap(([id, _]) => this._adapter.fetchLastNotificationTimestamp(id)),
    map((timestampString) => {
      const now = new Date();
      const timestamp = new Date(timestampString);

      const diffMs = now.getTime() - timestamp.getTime();
      const diffHours = diffMs / (1000 * 60 * TRIO_DUEL_TIME_PERIOD);

      const isInTrioDuel = diffHours <= 1;
      return isInTrioDuel;
    })
  );

  readonly isLoading$ = this.currentUser$.pipe(
    map(() => false),
    startWith(true)
  );

  private readonly _initMap$ = this.currentUser$;
  private _initMapSubscription$!: Subscription;

  ngOnInit(): void {
    this._route.fragment.subscribe((fragment) => {
      this._currentUserId$.next(fragment!);
    });

    this._initMapSubscription$ = this._initMap$.subscribe((user) =>
      this._initMap(user.location)
    );
  }

  ngOnDestroy(): void {
    this._initMapSubscription$?.unsubscribe();
  }

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _adapter: SQLAdapter,
    private readonly _snackbar: MatSnackBar
  ) {}

  returnToHome() {
    this._router.navigate(['../'], { relativeTo: this._route });
  }

  call(phoneNumber: string) {
    window.location.href = `tel:${phoneNumber}`;
  }

  message(phoneNumber: string) {
    window.location.href = `https://wa.me/${phoneNumber}`;
  }

  enableCallTrigger = false;

  sliderDragged(event: any) {
    const value = (event.target as HTMLInputElement).valueAsNumber;

    if (value === 100) this.enableCallTrigger = true;
    else this.enableCallTrigger = false;
  }

  async trioDuel(user: PersonModel) {
    try {
      await navigator.serviceWorker.ready;

      const connectedUserId = JSON.parse(localStorage.getItem('userId')!).id;
      await this._adapter.sendNotification({
        senderUserId: connectedUserId,
        targetUserId: user.id,
        title: 'Hello!',
        message: 'You are successfully subscribed!',
      });
      this._snackbar.open('!ההודעה נשלחה בהצלחה', '', {
        duration: 3000,
        panelClass: ['center-snackbar'],
      });
      this._refresh$.next();
    } catch (err) {
      console.error('servie worker registration failed:', err);
      this._snackbar.open('ההודעה נכשלה... נסה שוב', '', {
        duration: 3000,
        panelClass: ['center-snackbar'],
      });
    }
  }

  private _initMap(location: { latitude: number; longtitude: number }) {
    const coordinates = [location.latitude, location.longtitude];

    this._map = L.map('map', {
      center: [coordinates[0], coordinates[1]],
      zoom: 18,
      zoomControl: false,
      minZoom: 12,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this._map
    );
    this._map.attributionControl.remove();

    const circleCenter: L.LatLngExpression = [coordinates[0], coordinates[1]];
    const markCircle = L.circle(circleCenter, {
      color: '#FF8C00',
      fillColor: '#FFA500',
      fillOpacity: 0.2,
      radius: 30,
    }).addTo(this._map);

    markCircle.bindPopup('Trio Duel Target');
  }
}
