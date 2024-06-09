import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrl: './medical-records.component.css'
})
export class MedicalRecordsComponent {

  url: string = environment.apiBaseUrl;
  medicalRecords: any;
  patient: any;
  userInfo: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userInfo = this.authService.getUserInfo();
    this.getPatientAndMedicalRecords();
  }

  getPatientAndMedicalRecords() {
    this.http.get(this.url + "/Patients/email/" + this.userInfo.email).pipe(
      switchMap((patient: any) => {
        this.patient = patient;
        return this.http.get(this.url + "/MedicalRecords/patient/" + this.patient.patientId);
      })
    ).subscribe((medicalRecords: any) => {
      this.medicalRecords = medicalRecords;
      for (let i = 0; i < this.medicalRecords.length; i++) {
        this.getDoctorFullName(medicalRecords[i].doctorId).subscribe(name => {
          this.medicalRecords[i].doctorFullName = name;
        });
      }
    });
  }

  getDoctorFullName(doctorId: number): Observable<any> {
    return this.http.get(this.url + '/Doctors/' + doctorId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
      })
    );
  }

}
