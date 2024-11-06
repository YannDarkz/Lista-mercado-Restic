import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RouterOutlet, Router } from '@angular/router';
import { UserService } from './services/user/user.service';

import { CommonModule } from '@angular/common';
import { AuthButtonsComponent } from './components/auth-buttons/auth-buttons.component';
import { UserDataService } from './services/user-data/user-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AuthButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, private userService: UserService, private userDataService: UserDataService) { }

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/listItems']);

        this.auth.user$.subscribe(user => {
          // console.log("uzer", user)
  
          if (user) {
            const userData = {
              userId: user.sub ? user.sub.split('|')[1] : '',
              name: user.name || 'Usuário sem nome',
              email: user.email || '',
              picture: user.picture || ''
            };
            
            

            this.userService.saveAutorizedUser(userData).subscribe(savedUser => {
              this.userDataService.setUserData(savedUser);
            });
          }
        })
      }
    });
  }
}
