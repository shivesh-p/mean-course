import { Component } from '@angular/core';
import { NgForm } from '@angular/forms/';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string;
  password: string;
  isLoading: boolean = false;
  hide = true;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'visibility',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/visibility.svg')
    );
    iconRegistry.addSvgIcon(
      'visibility_off',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/visibility_off.svg'
      )
    );
  }

  login(form: NgForm) {
    // handle form submission logic here
    console.log(form.value);
  }
}
