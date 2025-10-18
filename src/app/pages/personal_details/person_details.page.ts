import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReplaySubject, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { SQLAdapter } from '../api/sql/sql-adapter';

@Component({
  selector: 'pages-person_details',
  templateUrl: './person_details.page.html',
  styleUrls: ['./person_details.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailsPageComponent implements OnInit {
  private _map!: any;

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
    private readonly _adapter: SQLAdapter
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
