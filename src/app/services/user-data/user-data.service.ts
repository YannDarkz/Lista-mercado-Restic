import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { Iuser } from '../../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userData = new BehaviorSubject<Iuser | null>(null);  // Armazena o estado dos dados do usuário
  userData$ = this.userData.asObservable();  // Exposição dos dados como um Observable

  constructor(private authService: AuthService, private http: HttpClient) {}

  // Método para definir ou atualizar os dados do usuário
  setUserData(data: Iuser) {
    this.userData.next(data);
  }

  // Método para acessar os dados do usuário como um Observable
  getUserData(): Observable<Iuser | null> {
    return this.userData$;
  }

  getUserId() {
    return this.authService.user$.pipe(
      map((user) => user?.sub)

    )
  }
  
}
