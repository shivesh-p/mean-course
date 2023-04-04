import { Component } from '@angular/core';
import { NgForm } from '@angular/forms/';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent {
  email: string;
  password: string;
  isLoading: boolean = false;
  hide = true;
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private auth: AuthService
  ) {
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

  signUp(form: NgForm) {
    // handle form submission logic here
    console.log(form.value);
    this.auth.signUp(form.value);
  }
}
