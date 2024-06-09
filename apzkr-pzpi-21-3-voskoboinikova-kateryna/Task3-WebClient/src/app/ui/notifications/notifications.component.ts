import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, switchMap, of } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationsComponent {

  url: string = environment.apiBaseUrl;
  notifications: any;
  patient: any;
  userInfo: any;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userInfo = this.authService.getUserInfo();
    this.getPatientAndNotifications();
  }

  getPatientAndNotifications() {
    this.http.get(this.url + "/Patients/email/" + this.userInfo.email).pipe(
      switchMap((patient: any) => {
        this.patient = patient;
        return this.http.get(this.url + "/Notifications/patient/" + this.patient.patientId);
      })
    ).subscribe((notifications: any) => {
      this.notifications = notifications;
      for (let i = 0; i < this.notifications.length; i++) {
        this.getSender(notifications[i].senderId).subscribe(data => {
          this.notifications[i].sender = data;
        });
      }
    });
  }

  getSender(senderId: number): Observable<any> {
    if (!senderId) {
      return of('Система');
    } else {
      return this.http.get(this.url + '/Doctors/' + senderId).pipe(
        map((data: any) => {
          return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
        })
      );
    }
  }

  deleteNotification(notificationId: number) {
    this.http.delete(this.url + "/Notifications/" + notificationId).subscribe(res => {
      for (let i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].notificationId == notificationId) {
          this.notifications.splice(i, 1);
          break;
        }
      }
    });
  }

}
