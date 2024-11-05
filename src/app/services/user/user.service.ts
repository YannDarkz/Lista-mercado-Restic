import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Iuser } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = 'http://localhost:3000/users'

  constructor( private http: HttpClient) { }


  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users[0] || null) 
    );
  }

  addUser(user: Iuser): Observable<any> {
    return this.http.post(`${this.apiUrl}`, user);
  }

  saveAutorizedUser(userData: Iuser): Observable<Iuser> {
    return this.getUserByEmail(userData.email).pipe(
      switchMap(existingUser => {
        if (existingUser) {
          return of (existingUser);

        }else {
          return this.addUser(userData);
        }
      })
    );
  }
}
