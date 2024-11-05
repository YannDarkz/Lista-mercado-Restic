import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-buttons.component.html',
  styleUrl: './auth-buttons.component.scss'
})
export class AuthButtonsComponent {
auth: AuthService

  constructor(private authS: AuthService){
    this.auth = authS
  }

  
  

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      logoutParams:{ returnTo: document.location.origin}
     });
  }
}

