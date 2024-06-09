import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  activated: any = {}

  constructor() {
    this.activated = {
      patients: true,
      administrators: false,
      bloodTypes: false,
      companies: false,
      companyManagers: false,
      doctors: false,
      manufacturers: false,
      measurements: false,
      medicalDevices: false,
      medicalDeviceTypes: false,
      medicalRecords: false,
      notifications: false,
      specializations: false
    }
  }

  deactivate() {
    for (let key in this.activated) {
      if (this.activated[key]) {
        this.activated[key] = false;
        return;
      }
    }
  }

  activatePatients() {
    if (this.activated.patients) {
      return;
    }

    this.deactivate();
    this.activated.patients = true;
  }

  activateDoctors() {
    if (this.activated.doctors) {
      return;
    }

    this.deactivate();
    this.activated.doctors = true;
  }

  activateCompanyManagers() {
    if (this.activated.companyManagers) {
      return;
    }

    this.deactivate();
    this.activated.companyManagers = true;
  }

  activateCompanies() {
    if (this.activated.companies) {
      return;
    }

    this.deactivate();
    this.activated.companies = true;
  }

  activateMedicalDevices() {
    if (this.activated.medicalDevices) {
      return;
    }

    this.deactivate();
    this.activated.medicalDevices = true;
  }

  activateMedicalDeviceTypes() {
    if (this.activated.medicalDeviceTypes) {
      return;
    }

    this.deactivate();
    this.activated.medicalDeviceTypes = true;
  }

  activateBloodTypes() {
    if (this.activated.bloodTypes) {
      return;
    }

    this.deactivate();
    this.activated.bloodTypes = true;
  }

  activateSpecializations() {
    if (this.activated.specializations) {
      return;
    }

    this.deactivate();
    this.activated.specializations = true;
  }

  activateAdministrators() {
    if (this.activated.administrators) {
      return;
    }

    this.deactivate();
    this.activated.administrators = true;
  }

  activateManufacturers() {
    if (this.activated.manufacturers) {
      return;
    }

    this.deactivate();
    this.activated.manufacturers = true;
  }

  activateMedicalRecords() {
    if (this.activated.medicalRecords) {
      return;
    }

    this.deactivate();
    this.activated.medicalRecords = true;
  }

  activateNotifications() {
    if (this.activated.notifications) {
      return;
    }

    this.deactivate();
    this.activated.notifications = true;
  }

  activateMeasurements() {
    if (this.activated.measurements) {
      return;
    }

    this.deactivate();
    this.activated.measurements = true;
  }

}
