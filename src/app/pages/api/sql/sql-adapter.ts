import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PersonModel } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root', // <- makes it injectable app-wide
})
export class SQLAdapter {
  constructor(private readonly _http: HttpClient) {}

  getUserById(id: string): Observable<PersonModel> {
    const params = new HttpParams().set('id', id);

    return this._http
      .get<any>('http://localhost:3000/api/userById', { params })
      .pipe(
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

    return this._http
      .get<any[]>('http://localhost:3000/api/allUsers', { params })
      .pipe(
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
    const bytes = new Uint8Array(bufferObj.data);
    let binary = '';
    const chunkSize = 0x8000; // process large arrays in chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    return btoa(binary); // convert binary string to Base64
  }
}
