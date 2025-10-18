import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReplaySubject, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { SQLAdapter } from '../api/sql/sql-adapter';
import { PersonModel } from 'src/app/shared/models';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'pages-person_details',
  templateUrl: './person_details.page.html',
  styleUrls: ['./person_details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailsPageComponent implements OnInit {
  private _map!: any;

  readonly KEY =
    'BOn4_tyuY4HYoFB5kyM_352AlN-eOnWD1WjPIfHczqvXTWCA_ByNT3c-Xkz_nXp0D47CAcKsALGT9-6btwJDbco';

  private readonly _currentUserId$ = new ReplaySubject<string>(1);
  readonly currentUser$ = this._currentUserId$.pipe(
    switchMap((id) => this._adapter.getUserById(id)),
    tap((user) => this._initMap(user.location))
  );

  ngOnInit(): void {
    this._route.fragment.subscribe((fragment) => {
      this._currentUserId$.next(fragment!);
    });
  }

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _adapter: SQLAdapter // private readonly _swPush: SwPush
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

  trioDuel(user: PersonModel) {
    this.subscribeToNotifications();
  }

  subscribeToNotifications() {
    // this._swPush
    //   .requestSubscription({
    //     serverPublicKey: this.KEY,
    //   })
    //   .then((sub) => {
    //     return this._adapter.subscribe(sub);
    //   })
    //   .then(() => alert('subscribed for push notifications!'))
    //   .catch((err) => console.log('subscription failed', err));

    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        new Notification('Example notification');
      }
    });
  }

  //? register sw, register push, send push
  async send() {
    // console.log('CLIENT: registering service worker');
    // const register = await navigator.serviceWorker.register('worker.js', {
    //   scope: '/',
    // });
    // console.log('CLIENT: service worker registered!');
    // console.log('registering push...');
    // const subscription = await register.pushManager.subscribe({
    //   userVisibleOnly: true,
    //   applicationServerKey: this._urlBase64ToUint8Array(this.KEY),
    // });
    // console.log('push registered!');
    // console.log('sending push notification...');
    // await fetch('/subscribe') {
    //   m
    // }
  }

  // private _urlBase64ToUint8Array(base64String: any) {
  //   const padding = '='.repeat(((4 - base64String.length) & 4) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/\-/g, '+')
  //     .replace(/_/g, '/');

  //   const rawData = window.atob(base64);
  //   const outputedArray = new Uint8Array(rawData.length);

  //   for (let i = 0; i < rawData.length; i++) {
  //     outputedArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputedArray;
  // }

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
