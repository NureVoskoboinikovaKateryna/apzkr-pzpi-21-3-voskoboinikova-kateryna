import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.css'
})
export class MeasurementsComponent {

  url: string = environment.apiBaseUrl;
  measurements: any;
  patient: any;
  userInfo: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userInfo = this.authService.getUserInfo();
    this.getPatientAndMeasurements();
  }

  getPatientAndMeasurements() {
    this.http.get(this.url + "/Patients/email/" + this.userInfo.email).pipe(
      switchMap((patient: any) => {
        this.patient = patient;
        return this.http.get(this.url + "/Measurements/patient/" + this.patient.patientId);
      })
    ).subscribe((measurements: any) => {
      this.measurements = measurements;
      for (let i = 0; i < this.measurements.length; i++) {
        this.getMedicalDeviceName(measurements[i].medicalDevice.medicalDeviceTypeId).subscribe(name => {
          this.measurements[i].deviceName = name;
        });
      }
    });
  }

  getMedicalDeviceName(medicalDeviceTypeId: number): Observable<any> {
    return this.http.get(this.url + '/MedicalDeviceTypes/' + medicalDeviceTypeId).pipe(
      map((data: any) => data.name)
    );
  }

}
