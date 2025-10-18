import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, tap } from 'rxjs';
import { PersonModel } from 'src/app/shared/models';
import { SQLAdapter } from '../api/sql/sql-adapter';

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

  getDistance(
    myLatitude: number,
    myLongtitude: number,
    userLatitude: number,
    userLongtitude: number
  ) {
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
}
