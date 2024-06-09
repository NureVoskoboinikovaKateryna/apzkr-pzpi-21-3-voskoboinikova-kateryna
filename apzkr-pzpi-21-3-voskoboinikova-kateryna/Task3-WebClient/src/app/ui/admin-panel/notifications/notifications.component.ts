import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-notifications',
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
export class AdminNotificationsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  notifications: any;
  notificationsFiltered: any;
  notificationsFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      id: {
        asc: true,
        desc: false
      },
      patient: {
        asc: false,
        desc: false
      },
      sender: {
        asc: false,
        desc: false
      },
      date: {
        asc: false,
        desc: false
      }
    };

    this.getNotifications();
  }

  deactivate() {
    for (let key1 in this.sortBy) {
      for (let key2 in this.sortBy[key1]) {
        if (this.sortBy[key1][key2]) {
          this.sortBy[key1][key2] = false;
          return;
        }
      }
    }
  }

  sort() {
    if (this.sortBy.id.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => a.notificationId - b.notificationId);
    } else if (this.sortBy.id.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => b.notificationId - a.notificationId);
    } else if (this.sortBy.patient.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => a.patientFullName.localeCompare(b.patientFullName));
    } else if (this.sortBy.patient.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => b.patientFullName.localeCompare(a.patientFullName));
    } else if (this.sortBy.sender.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => a.sender.localeCompare(b.sender));
    } else if (this.sortBy.sender.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => b.sender.localeCompare(a.sender));
    } else if (this.sortBy.date.asc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return (dateA < dateB) ? -1 : (dateA > dateB) ? 1 : 0;
      });
    } else if (this.sortBy.date.desc) {
      this.notificationsFilteredAndSorted.sort((a: any, b: any) => {
        const dateA: Date = new Date(a.date);
        const dateB: Date = new Date(b.date);
        return (dateB < dateA) ? -1 : (dateB > dateA) ? 1 : 0;
      });
    }
  }

  sortById() {
    if (!this.sortBy.id.asc && !this.sortBy.id.desc) {
      this.deactivate();
      this.sortBy.id.asc = true
    } else if (this.sortBy.id.asc) {
      this.sortBy.id.asc = false;
      this.sortBy.id.desc = true;
    } else if (this.sortBy.id.desc) {
      this.sortBy.id.asc = true;
      this.sortBy.id.desc = false;
    }

    this.sort();
  }

  sortByPatient() {
    if (!this.sortBy.patient.asc && !this.sortBy.patient.desc) {
      this.deactivate();
      this.sortBy.patient.asc = true
    } else if (this.sortBy.patient.asc) {
      this.sortBy.patient.asc = false;
      this.sortBy.patient.desc = true;
    } else if (this.sortBy.patient.desc) {
      this.sortBy.patient.asc = true;
      this.sortBy.patient.desc = false;
    }

    this.sort();
  }

  sortBySender() {
    if (!this.sortBy.sender.asc && !this.sortBy.sender.desc) {
      this.deactivate();
      this.sortBy.sender.asc = true
    } else if (this.sortBy.sender.asc) {
      this.sortBy.sender.asc = false;
      this.sortBy.sender.desc = true;
    } else if (this.sortBy.sender.desc) {
      this.sortBy.sender.asc = true;
      this.sortBy.sender.desc = false;
    }

    this.sort();
  }

  sortByDate() {
    if (!this.sortBy.date.asc && !this.sortBy.date.desc) {
      this.deactivate();
      this.sortBy.date.asc = true
    } else if (this.sortBy.date.asc) {
      this.sortBy.date.asc = false;
      this.sortBy.date.desc = true;
    } else if (this.sortBy.date.desc) {
      this.sortBy.date.asc = true;
      this.sortBy.date.desc = false;
    }

    this.sort();
  }

  searchNotification(event: string) {
    this.notificationsFiltered = this.notifications.filter((p: any) => p.patientFullName.toLowerCase().includes(event.toLowerCase()));
    this.notificationsFilteredAndSorted = [...this.notificationsFiltered];
  }

  getNotifications() {
    this.http.get(this.url + "/Notifications").subscribe((data: any) => {
      this.notifications = data;

      for (let i = 0; i < data.length; i++) {
        this.http.get(this.url + "/Patients/" + data[i].patientId).subscribe((data: any) => {
          this.notifications[i].patientFullName = data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
        });

        if (data[i].senderId) {
          this.http.get(this.url + "/Doctors/" + data[i].senderId).subscribe((data: any) => {
            this.notifications[i].sender = data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName;
          });
        } else {
          this.notifications[i].sender = "Система";
        }
      }

      this.notificationsFilteredAndSorted = [...this.notifications];
      this.loaded = true;
    });
  }

  deleteNotification(notificationId: number) {
    this.http.delete(this.url + "/Notifications/" + notificationId).subscribe(res => {
      this.getNotifications();
    });
  }

}
