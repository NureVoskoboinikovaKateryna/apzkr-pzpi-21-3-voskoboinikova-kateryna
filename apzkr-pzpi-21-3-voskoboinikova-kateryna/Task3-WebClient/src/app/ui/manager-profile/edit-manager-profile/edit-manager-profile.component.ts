import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EditingProfileValues } from './edit-manager-profile.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-manager-profile',
  templateUrl: './edit-manager-profile.component.html',
  styleUrl: './edit-manager-profile.component.css'
})
export class EditManagerProfileComponent {

  @Input() user: any;
  @Input() companyManagerId: any;
  @Output() onSaveEvent = new EventEmitter<any>();
  @Output() onCancelEvent = new EventEmitter<any>();

  url: string = environment.apiBaseUrl;
  companies: any;
  changes: EditingProfileValues = new EditingProfileValues();
  changesBefore: EditingProfileValues = new EditingProfileValues();
  loaded: boolean = false;

  constructor(private http: HttpClient) {
    this.getCompanies();
  }

  ngOnInit() {
    if (this.companyManagerId) {
      this.getCompanyManager();
    } else {
      this.setValues()
    }

    this.changesBefore = { ...this.changes };
  }

  setValues() {
    this.changes.companyId = this.user.company.companyId;
    this.changes.email = this.user.applicationUser.email;
    this.changes.lastName = this.user.applicationUser.lastName;
    this.changes.name = this.user.applicationUser.name;
    this.changes.middleName = this.user.applicationUser.middleName;
    this.changes.phoneNumber = this.user.applicationUser.phoneNumber;
  }

  getCompanyManager() {
    this.http.get(this.url + "/CompanyManagers/" + this.companyManagerId).subscribe(data => {
      this.user = data;
      this.setValues();
    });
  }

  compDicts(dict1: any, dict2: any): boolean {
    return JSON.stringify(dict1) == JSON.stringify(dict2);
  }

  saveChanges() {
    if (this.compDicts(this.changes, this.changesBefore)) {
      this.cancelChanges();
      return;
    }

    this.onSaveEvent.emit(this.changes);
  }

  cancelChanges() {
    this.onCancelEvent.emit();
  }

  getCompanies(): any {
    this.http.get(this.url + "/Companies").subscribe(data => {
      this.companies = data;
      this.loaded = true;
    });
  }

}
