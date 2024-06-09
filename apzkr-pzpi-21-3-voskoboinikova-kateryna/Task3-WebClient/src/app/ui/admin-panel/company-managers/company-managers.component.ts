import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-admin-company-managers',
  templateUrl: './company-managers.component.html',
  styleUrl: './company-managers.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CompanyManagersComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  companyManagers: any;
  companyManagersFiltered: any;
  companyManagersFilteredAndSorted: any;
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
      fullName: {
        asc: false,
        desc: false
      },
      companyName: {
        asc: false,
        desc: false
      }
    };

    this.getCompanyManagers();
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
      this.companyManagersFilteredAndSorted.sort((a: any, b: any) => a.companyManagerId - b.companyManagerId);
    } else if (this.sortBy.id.desc) {
      this.companyManagersFilteredAndSorted.sort((a: any, b: any) => b.companyManagerId - a.companyManagerId);
    } else if (this.sortBy.fullName.asc) {
      this.companyManagersFilteredAndSorted.sort((a: any, b: any) => a.fullName.localeCompare(b.fullName));
    } else if (this.sortBy.fullName.desc) {
      this.companyManagersFilteredAndSorted.sort((a: any, b: any) => b.fullName.localeCompare(a.fullName));
    } else if (this.sortBy.companyName.asc) {
      this.companyManagersFilteredAndSorted.sort((a: any, b: any) => a.company.companyName.localeCompare(b.company.companyName));
    } else if (this.sortBy.companyName.desc) {
      this.companyManagersFilteredAndSorted.sort((a: any, b: any) => b.company.companyName.localeCompare(a.company.companyName));
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

  sortByFullName() {
    if (!this.sortBy.fullName.asc && !this.sortBy.fullName.desc) {
      this.deactivate();
      this.sortBy.fullName.asc = true
    } else if (this.sortBy.fullName.asc) {
      this.sortBy.fullName.asc = false;
      this.sortBy.fullName.desc = true;
    } else if (this.sortBy.fullName.desc) {
      this.sortBy.fullName.asc = true;
      this.sortBy.fullName.desc = false;
    }

    this.sort();
  }

  sortByCompanyName() {
    if (!this.sortBy.companyName.asc && !this.sortBy.companyName.desc) {
      this.deactivate();
      this.sortBy.companyName.asc = true
    } else if (this.sortBy.companyName.asc) {
      this.sortBy.companyName.asc = false;
      this.sortBy.companyName.desc = true;
    } else if (this.sortBy.companyName.desc) {
      this.sortBy.companyName.asc = true;
      this.sortBy.companyName.desc = false;
    }

    this.sort();
  }

  searchCompanyManager(event: string) {
    this.companyManagersFiltered = this.companyManagers.filter((p: any) => p.fullName.toLowerCase().includes(event.toLowerCase()));
    this.companyManagersFilteredAndSorted = [...this.companyManagersFiltered];
  }

  getCompanyManagers() {
    this.http.get(this.url + "/CompanyManagers").subscribe(data => {
      this.companyManagers = data;
      for (let i = 0; i < this.companyManagers.length; i++) {
        this.getCompanyManagerFullName(this.companyManagers[i].companyManagerId).subscribe(data => {
          this.companyManagers[i].fullName = data;
        });
      }

      this.companyManagersFilteredAndSorted = [...this.companyManagers];
      this.loaded = true;
    });
  }

  getCompanyManagerFullName(companyManagerId: number): Observable<any> {
    return this.http.get(this.url + '/CompanyManagers/' + companyManagerId).pipe(
      map((data: any) => {
        return data.applicationUser.lastName + ' ' + data.applicationUser.name + ' ' + data.applicationUser.middleName
      })
    );
  }

  deleteCompanyManager(companyManagerId: number) {
    this.http.delete(this.url + "/CompanyManagers/acc/" + companyManagerId).subscribe(res => {
      this.getCompanyManagers();
    });
  }

}
