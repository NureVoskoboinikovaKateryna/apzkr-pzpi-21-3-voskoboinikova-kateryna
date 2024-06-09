import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { EditingProfileValues } from './edit-patient-profile/edit-patient-profile.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrl: './patient-profile.component.css'
})
export class PatientProfileComponent implements OnInit {

  url: string = environment.apiBaseUrl;
  user: any;
  userLoaded: boolean = false;
  statsLoaded: boolean = false;
  editingProfile: boolean = false;
  userEmail: string = "";
  patientId: number = 0;
  onlyView: boolean = false;
  allowedToEditAndDelete = false;
  stats: any = {};
  showModal: boolean = false;
  role_admin: string = "Адміністратор";
  role_manager: string = "Менеджер";

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.patientId = params['patientId'];
      this.userEmail = this.authService.getUserInfo()?.email!;
      this.getUser();
    });
  }

  savePatient(data: EditingProfileValues) {
    this.http.put(this.url + "/Patients/" + this.user.patientId, data).subscribe(res => {
      this.getUser();
      this.editingProfile = false;
    });
  }

  cancelEditing() {
    this.editingProfile = false;
  }

  getUser() {
    this.authService.getCurrentUserById("patient", this.patientId).subscribe(data => {
      this.user = data;
      let userRole = this.authService.getUserInfo()!.role;

      this.authService.getCurrentUser(userRole).subscribe(data => {
        if (userRole == this.role_admin) {
          this.onlyView = true;
          this.allowedToEditAndDelete = true;
        } else if (userRole == this.role_manager && this.user.companyId == data.companyId) {
          this.onlyView = true;
          this.allowedToEditAndDelete = true;
        } else if (userRole == "Пацієнт" && this.user.applicationUser.email != this.userEmail) {
          this.router.navigate(['home']);
        } else if (userRole != "Пацієнт") {
          this.onlyView = true;
        }
      });

      this.user.fullName = this.user.applicationUser.lastName
        + ' ' + this.user.applicationUser.name
        + ' ' + this.user.applicationUser.middleName;

      this.user.genderL = this.user.gender == 'F' ? "ж" : "ч";

      this.http.get(this.url + "/Companies/" + this.user.companyId).subscribe((data: any) => {
        this.user.companyName = data.companyName;
        this.userLoaded = true;

        this.fillStats();
      });
    });
  }

  openModalDialog() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmDelete() {
    this.http.delete(this.url + "/Patients/acc/" + this.patientId).subscribe(res => {
      this.router.navigate(['/home']);
    });
  }

  fillStats() {
    this.http.get(this.url + "/Measurements/patient/" + this.user.patientId).subscribe((data: any) => {
      this.stats.measurements = data;

      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate);
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

      this.stats.measurementsLastMonth = data.filter((m: any) => {
        const mDate = new Date(m.measurementDate);
        return mDate >= lastMonthDate && mDate <= currentDate;
      }).length;

      this.stats.temp = 0;
      this.stats.weight = 0;
      this.stats.pulse = 0;

      this.stats.minTemp = 0;
      this.stats.minWeight = 0;
      this.stats.minPulse = 0;

      this.stats.maxTemp = 0;
      this.stats.maxWeight = 0;
      this.stats.maxPulse = 0;

      let countTemp: number = 0;
      let countWeight: number = 0;
      let countPulse: number = 0;
      for (let i = 0; i < data.length; i++) {
        let value = data[i].measurementValue;

        if (data[i].medicalDevice.medicalDeviceType.name == "Термометр") {
          if (!this.stats.minTemp || this.stats.minTemp > value) {
            this.stats.minTemp = value;
          }

          if (!this.stats.maxTemp || this.stats.minTemp < value) {
            this.stats.maxTemp = value;
          }

          this.stats.temp += value;
          countTemp++;
          continue;
        }

        if (data[i].medicalDevice.medicalDeviceType.name == "Ваги") {
          if (!this.stats.minWeight || this.stats.minWeight > value) {
            this.stats.minWeight = value;
          }
          if (!this.stats.maxWeight || this.stats.maxWeight < value) {
            this.stats.maxWeight = value;
          }

          this.stats.weight += value;
          countWeight++;
          continue;
        }

        if (data[i].medicalDevice.medicalDeviceType.name == "Пульсометр") {
          if (!this.stats.minPulse || this.stats.minPulse > value) {
            this.stats.minPulse = value;
          }
          if (!this.stats.maxPulse || this.stats.maxPulse < value) {
            this.stats.maxPulse = value;
          }

          this.stats.pulse += value;
          countPulse++;
          continue;
        }
      }

      this.stats.temp /= countTemp;
      this.stats.weight /= countWeight;
      this.stats.pulse /= countPulse;

      let heightM: number = this.user.height / 100;
      let BMI: number = this.stats.weight / (heightM * heightM);
      this.stats.BMI = BMI.toFixed(2);
      if (BMI < 18.5) {
        this.stats.BMIdesc = "{{ 'ADMIN.BMI1' | translate }}";
      } else if (18.5 <= BMI && BMI < 24.9) {
        this.stats.BMIdesc = "Нормальна маса тіла (ІМТ 18.5–24.9)";
      } else if (25 < BMI && BMI < 29.9) {
        this.stats.BMIdesc = "Надмірна вага (ІМТ 25–29.9)";
      } else if (30 < BMI && BMI < 34.9) {
        this.stats.BMIdesc = "Помірне ожиріння (ІМТ 30–34.9)";
      } else if (35 < BMI && BMI < 39.9) {
        this.stats.BMIdesc = "Серйозне ожиріння (ІМТ 35–39.9)";
      } else {
        this.stats.BMIdesc = "Морбідне ожиріння (ІМТ > 40)";
      }

      this.stats.tempNormal = 36.6;
      this.stats.weightNormal = (this.user.height - 100) * 1.15;
      this.stats.pulseNormal = 75;

      this.stats.temp = this.stats.temp.toFixed(2);
      this.stats.weight = this.stats.weight.toFixed(2);
      this.stats.pulse = this.stats.pulse.toFixed(2);

      this.stats.minTemp = this.stats.minTemp.toFixed(2);
      this.stats.minWeight = this.stats.minWeight.toFixed(2);
      this.stats.minPulse = this.stats.minPulse.toFixed(2);

      this.stats.maxTemp = this.stats.maxTemp.toFixed(2);
      this.stats.maxWeight = this.stats.maxWeight.toFixed(2);
      this.stats.maxPulse = this.stats.maxPulse.toFixed(2);

      this.stats.weightNormal = this.stats.weightNormal.toFixed(1);

      this.statsLoaded = true;
    });
  }

  logout() {
    this.authService.logout();
  }

}
