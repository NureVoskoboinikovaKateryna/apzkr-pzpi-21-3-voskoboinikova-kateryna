import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isLoggedIn: boolean = this.authService.isLoggedIn();
  userInfo: User = new User();
  userId: number = 0;

  constructor(public authService: AuthService, private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('language') || 'ua';
    this.translate.setDefaultLang('ua');
    this.translate.use(savedLanguage);

    if (this.isLoggedIn) {
      this.userInfo = this.authService.getUserInfo()!;

      this.authService.getCurrentUser(this.userInfo.role).subscribe(data => {
        if ("patientId" in data) {
          this.userId = data.patientId;
        } else if ("doctorId" in data) {
          this.userId = data.doctorId;
        } else if ("companyManagerId" in data) {
          this.userId = data.companyManagerId;
        }
      });
    }
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem('language', language);
  }

  logout() {
    this.authService.logout();
  }

}
