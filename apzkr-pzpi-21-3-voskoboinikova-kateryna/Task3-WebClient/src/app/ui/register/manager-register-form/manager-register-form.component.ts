import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RegisterData } from './manager-register-form.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-register-form',
  templateUrl: './manager-register-form.component.html',
  styleUrl: './manager-register-form.component.css'
})
export class ManagerRegisterFormComponent {
  @Output() onSubmitEvent = new EventEmitter<any>();
  @Input() createView: any;

  url: string = environment.apiBaseUrl;
  registrationData: RegisterData = new RegisterData();
  companies: any;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.getCompanies();
  }

  getCompanies(): any {
    this.http.get(this.url + "/Companies").subscribe(data => {
      this.companies = data;
    });
  }

  onSubmit() {
    if (!this.registrationData.email ||
      !this.registrationData.lastName ||
      !this.registrationData.middleName ||
      !this.registrationData.name ||
      !this.registrationData.password ||
      !this.registrationData.confirmPassword ||
      !this.registrationData.phoneNumber ||
      !this.registrationData.companyId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    if (this.registrationData.password != this.registrationData.confirmPassword) {
      this.toastr.error("Паролі не співпадають", "Помилка");
      return;
    }

    this.onSubmitEvent.emit(this.registrationData);
  }
}
