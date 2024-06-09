import { Component } from '@angular/core';
import { LoginData } from './login.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData: LoginData = new LoginData()

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.login(this.loginData);
  }

}
