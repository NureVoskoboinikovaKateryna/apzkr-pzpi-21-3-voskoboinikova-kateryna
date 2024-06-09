import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-put-company-manager',
  templateUrl: './put-company-manager.component.html',
  styleUrl: './put-company-manager.component.css'
})
export class PutCompanyManagerComponent {

  companyManagerId: number = 0;
  url: string = environment.apiBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.route.params.subscribe(data => {
      this.companyManagerId = data['managerId'];
    });
  }

  saveCompanyManager(data: any) {
    this.http.put(this.url + "/CompanyManagers/" + this.companyManagerId, data).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
