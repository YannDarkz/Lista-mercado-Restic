import { Component } from '@angular/core';
import { AuthButtonsComponent } from '../auth-buttons/auth-buttons.component';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AuthButtonsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
