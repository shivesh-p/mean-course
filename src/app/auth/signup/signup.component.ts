import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  isLoading: boolean = false;
  hide = true;
  private authSub: Subscription;
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
  signUp(form: NgForm) {
    this.isLoading = true;
    // handle form submission logic here
    console.log(form.value);
    this.auth.signUp(form.value);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
