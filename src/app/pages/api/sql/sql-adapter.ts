import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from, map, mergeMap, Observable, of, tap } from 'rxjs';
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
        const blob = new Blob([new Uint8Array(res.image.data)], {
          type: res.image.type || 'image/jpeg',
        });
        const imageUrl = URL.createObjectURL(blob);

        const user: PersonModel = {
          id: res.id,
          name: res.name,
          location: { latitude: res.latitude, longtitude: res.longtitude },
          phoneNumber: res.phone_number,
          backgroundColor: res.background_color,
          image: imageUrl,
        };

        return user;
      })
    );
  }

  getAllUsers(excludedId: string): Observable<PersonModel[]> {
    const params = new HttpParams().set('excludedId', excludedId);

    return this._http.get<any[]>(`${this.baseUrl}/allUsers`, { params }).pipe(
      mergeMap((users) => {
        const userObservables = users.map((u) => {
          const blob = new Blob([new Uint8Array(u.image.data)], {
            type: u.image.type || 'image/jpeg',
          });
          const imageUrl = URL.createObjectURL(blob);

          const user: PersonModel = {
            id: u.id,
            name: u.name,
            location: { latitude: u.latitude, longtitude: u.longtitude },
            phoneNumber: u.phone_number,
            backgroundColor: u.background_color,
            image: imageUrl,
          };

          return from(Promise.resolve(user));
        });

        return forkJoin(userObservables);
      })
    );
  }
}
