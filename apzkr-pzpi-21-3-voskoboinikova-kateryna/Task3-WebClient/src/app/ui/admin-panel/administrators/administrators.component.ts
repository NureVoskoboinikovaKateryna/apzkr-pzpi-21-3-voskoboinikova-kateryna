import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-administrators',
  templateUrl: './administrators.component.html',
  styleUrl: './administrators.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdministratorsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  administrators: any;
  administratorsFiltered: any;
  administratorsFilteredAndSorted: any;
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
      name: {
        asc: false,
        desc: false
      }
    };

    this.getAdministrators();
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
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => a.administratorId - b.administratorId);
    } else if (this.sortBy.id.desc) {
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => b.administratorId - a.administratorId);
    } else if (this.sortBy.name.asc) {
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => a.applicationUser.name.localeCompare(b.applicationUser.name));
    } else if (this.sortBy.name.desc) {
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => b.applicationUser.name.localeCompare(a.applicationUser.name));
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

  sortByName() {
    if (!this.sortBy.name.asc && !this.sortBy.name.desc) {
      this.deactivate();
      this.sortBy.name.asc = true
    } else if (this.sortBy.name.asc) {
      this.sortBy.name.asc = false;
      this.sortBy.name.desc = true;
    } else if (this.sortBy.name.desc) {
      this.sortBy.name.asc = true;
      this.sortBy.name.desc = false;
    }

    this.sort();
  }

  searchAdministrator(event: string) {
    this.administratorsFiltered = this.administrators.filter((p: any) => p.applicationUser.name.toLowerCase().includes(event.toLowerCase()));
    this.administratorsFilteredAndSorted = [...this.administratorsFiltered];
  }

  getAdministrators() {
    this.http.get(this.url + "/Administrators").subscribe(data => {
      this.administrators = data;
      this.administratorsFilteredAndSorted = [...this.administrators];
      this.loaded = true;
    });
  }

  deleteAdministrator(administratorId: number) {
    this.http.delete(this.url + "/Administrators/acc/" + administratorId).subscribe(res => {
      this.getAdministrators();
    });
  }

}
