import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PersonModel } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root', // <- makes it injectable app-wide
})
export class MockAdapter {
  getUsers(currentUser: string): Observable<PersonModel[]> {
    return of([
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '2',
      //   backgroundColor: '#63a972',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '3',
      //   backgroundColor: '#c78585',
      // }),
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '4',
      //   backgroundColor: '#a585c7',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '5',
      //   backgroundColor: '#a585c7',
      // }),
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '6',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '7',
      // }),
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '8',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '9',
      // }),
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '10',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '11',
      // }),
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '12',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '13',
      // }),
      // new PersonModel({
      //   name: 'Jhon Black',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '14',
      // }),
      // new PersonModel({
      //   name: 'Jhon White',
      //   location: 'New York',
      //   image: 'https://via.placeholder.com/150',
      //   phoneNumber: '0506477366',
      //   id: '15',
      // }),
    ]);
  }

  getUserById(userId: string): Observable<PersonModel> {
    return of(
      new PersonModel({
        name: 'Jhon Black',
        location: { latitude: '', longtitude: '' },
        image: 'https://via.placeholder.com/150',
        id: '2',
        phoneNumber: '0506477366',
        backgroundColor: '#63a972',
      })
    );
  }
}
