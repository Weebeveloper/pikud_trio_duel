import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { PersonModel } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SQLAdapter {
  private baseUrl = `${environment.apiUrl}/api`;

  constructor(private readonly _http: HttpClient) {}

  getUserById(id: string): Observable<PersonModel> {
    const params = new HttpParams().set('id', id);

    return this._http.get<any>(`${this.baseUrl}/userById`, { params }).pipe(
      map((res) => {
        const user: PersonModel = {
          id: res.id,
          name: res.name,
          location: { latitude: res.latitude, longtitude: res.longtitude },
          phoneNumber: res.phone_number,
          backgroundColor: res.background_color,
          image: `data:image/jpeg;base64,${this._bufferToBase64(res.image)}`,
        };
        return user;
      })
    );
  }

  getAllUsers(id: string): Observable<PersonModel[]> {
    const params = new HttpParams().set('excludedId', id);

    return this._http.get<any[]>(`${this.baseUrl}/allUsers`, { params }).pipe(
      map((users) =>
        users.map((u) => {
          const user: PersonModel = {
            id: u.id,
            name: u.name,
            location: { latitude: u.latitude, longtitude: u.longtitude },
            phoneNumber: u.phone_number,
            backgroundColor: u.background_color,
            image: `data:image/jpeg;base64,${this._bufferToBase64(u.image)}`,
          };

          return user;
        })
      )
    );
  }

  private _bufferToBase64(bufferObj: { type: string; data: number[] }): string {
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(bufferObj.data))
    );
    return base64String;
  }
}
