import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RouterOutlet, Router } from '@angular/router';
import { UserService } from './services/user/user.service';


// import { ListItemsComponent } from './components/list-items/list-items.component';
// import { BuyItemComponent } from './components/buy-item/buy-item.component';
import { CommonModule } from '@angular/common';
import { AuthButtonsComponent } from './components/auth-buttons/auth-buttons.component';
import { UserDataService } from './services/user-data/user-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  CommonModule, AuthButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router, private userService: UserService, private userDataService: UserDataService) {}

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/listItems']);

        this.auth.user$.subscribe(user => {
          
          if(user) {
            const userData = {
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

  removeTextNotify = ''
  addTextNotify = '';
  
  notifyAddItem(): void {
    this.addTextNotify = 'adcionado com sucesso! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },2000)
  }

  notifyEditItem(): void {
    this.addTextNotify = 'Editado com sucesso! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },2000)
  }

  notifyRemoveItem(): void {
    this.addTextNotify = 'Removido com sucesso! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },1000)
  }

  notifyAddBuyItem(): void {
    this.addTextNotify = 'adcionado No carrinho! ✅'
    setTimeout(() => {
      this.addTextNotify = ''
    },1500)
  }

}
