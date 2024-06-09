import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dnotifications',
  templateUrl: './dnotifications.component.html',
  styleUrl: './dnotifications.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DnotificationsComponent {

  url: string = environment.apiBaseUrl;
  notifications: any;
  doctor: any;
  userInfo: any;
  loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.userInfo = this.authService.getUserInfo();
    this.getDoctorAndNotifications();
  }

  getDoctorAndNotifications() {
    this.http.get(this.url + "/Doctors/email/" + this.userInfo.email).pipe(
      switchMap((doctor: any) => {
        this.doctor = doctor;
        return this.http.get(this.url + "/Notifications/doctor/" + this.doctor.doctorId);
      })
    ).subscribe((notifications: any) => {
      this.notifications = notifications;
      for (let i = 0; i < this.notifications.length; i++) {
        this.getReceiver(notifications[i].patientId).subscribe(data => {
          this.notifications[i].receiver = data;
        });
      }

      this.loaded = true;
    });
  }

  getReceiver(receiverId: number): Observable<any> {
    return this.http.get(this.url + '/Patients/' + receiverId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
      })
    );
  }

  createNotification() {
    this.router.navigate(['/add-dnotification']);
  }

  editNotification(notificationId: number) {
    this.router.navigate(['/edit-dnotification', notificationId]);
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
