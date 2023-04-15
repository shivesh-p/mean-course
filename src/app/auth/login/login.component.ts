import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  isLoading: boolean = false;
  private authSub: Subscription;
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
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.authSub = this.auth.getAuthStatus().subscribe(() => {
      this.isLoading = false;
    });
  }
  login(form: NgForm) {
    // handle form submission logic here
    //console.log(form.value);
    this.isLoading = true;
    this.auth.login(form.value);
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
