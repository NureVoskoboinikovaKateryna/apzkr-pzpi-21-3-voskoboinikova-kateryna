import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-mpatients',
  templateUrl: './mpatients.component.html',
  styleUrl: './mpatients.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MpatientsComponent {

  url: string = environment.apiBaseUrl;
  workers: any;
  workersFiltered: any;
  manager: any;
  userInfo: any;
  loaded: boolean = false;
  search: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getManagerAndPatients();
  }

  getManagerAndPatients() {
    this.http.get(this.url + "/CompanyManagers/email/" + this.userInfo.email).pipe(
      switchMap((manager: any) => {
        this.manager = manager;
        return this.http.get(this.url + "/Companies/patients/" + this.manager.companyId);
      })
    ).subscribe((workers: any) => {
      this.workers = workers;
      for (let i = 0; i < this.workers.length; i++) {
        this.getMedicalRecords(this.workers[i].patientId).subscribe(data => {
          this.workers[i].mRecords = data;

          let lastRecordDate;
          for (let record of data) {
            if (!lastRecordDate) {
              lastRecordDate = record.visitDate;
              continue;
            }

            if (lastRecordDate < record.visitDate) {
              lastRecordDate = record.visitDate;
            }
          }

          const inputDate: Date = new Date(lastRecordDate);
          const formattedDate: string = `${inputDate.getDate().toString().padStart(2, '0')}/${(inputDate.getMonth() + 1).toString().padStart(2, '0')}/${inputDate.getFullYear()} ${inputDate.getHours().toString().padStart(2, '0')}:${inputDate.getMinutes().toString().padStart(2, '0')}:${inputDate.getSeconds().toString().padStart(2, '0')}`;
          this.workers[i].lastRecordDate = formattedDate;
        });

        this.getPatientFullName(this.workers[i].patientId).subscribe(data => {
          this.workers[i].fullName = data;
        });
      }

      this.workersFiltered = [...this.workers];
      this.loaded = true;
    });
  }

  searchWorker(value: string): void {
    this.workersFiltered = this.workers.filter((p: any) => p.fullName.toLowerCase().includes(value.toLowerCase()));
  }

  getMedicalRecords(patientId: number): Observable<any> {
    return this.http.get(this.url + "/MedicalRecords/patient/" + patientId);
  }

  getPatientFullName(patientId: number): Observable<any> {
    return this.http.get(this.url + '/Patients/' + patientId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
      })
    );
  }

}
