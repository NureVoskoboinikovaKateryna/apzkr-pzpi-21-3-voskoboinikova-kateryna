import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditingProfileValues } from './edit-manager-profile/edit-manager-profile.model';

@Component({
  selector: 'app-manager-profile',
  templateUrl: './manager-profile.component.html',
  styleUrl: './manager-profile.component.css'
})
export class ManagerProfileComponent {

  url: string = environment.apiBaseUrl;
  user: any;
  userLoaded: boolean = false;
  statsLoaded: boolean = false;
  stats: any = {};
  managerId: number = 0;
  userEmail: string = "";
  onlyView: boolean = false;
  editingProfile: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.managerId = data['managerId'];
      this.userEmail = this.authService.getUserInfo()?.email!;
      this.getUser();
    });
  }

  saveManager(data: EditingProfileValues) {
    this.http.put(this.url + "/CompanyManagers/" + this.user.companyManagerId, data).subscribe(res => {
      this.getUser();
      this.cancelEditing();
    });
  }

  cancelEditing() {
    this.editingProfile = false;
  }

  fillStats() {
    this.http.get(this.url + "/Companies/patients/" + this.user.companyId).subscribe((data: any) => {
      this.stats.workersQuantity = data.length;
      this.statsLoaded = true;
    });
  }

  getUser() {
    this.authService.getCurrentUserById("manager", this.managerId).subscribe(data => {
      this.user = data;
      let userRole = this.authService.getUserInfo()!.role;
      if (!(userRole == "Адміністратор" || this.user.applicationUser.email == this.userEmail)) {
        this.onlyView = true;
      }

      this.user.fullName = this.user.applicationUser.lastName
        + ' ' + this.user.applicationUser.name
        + ' ' + this.user.applicationUser.middleName;

      this.fillStats();
      this.userLoaded = true;
    });
  }

  logout() {
    this.authService.logout();
  }

}
