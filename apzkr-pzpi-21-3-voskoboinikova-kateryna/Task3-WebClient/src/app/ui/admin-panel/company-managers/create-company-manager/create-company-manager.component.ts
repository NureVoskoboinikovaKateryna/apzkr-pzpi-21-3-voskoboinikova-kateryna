import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-create-company-manager',
  templateUrl: './create-company-manager.component.html',
  styleUrl: './create-company-manager.component.css'
})
export class CreateCompanyManagerComponent {

  createView: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  registerCompanyManager(event: any) {
    this.authService.registerManagerAdmin(event);
  }

}
