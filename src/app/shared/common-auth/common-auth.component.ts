import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-common-auth',
  templateUrl: './common-auth.component.html',
  styleUrls: ['./common-auth.component.css'],
})
export class CommonAuthComponent implements OnInit {
  form: FormGroup;
  hide = true;
  isLogin = true;
  selectedTabIndex = 0;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.isLogin) {
      // Handle login form submission
      console.log('Logging in...');
    } else {
      // Handle signup form submission
      console.log('Signing up...');
    }
  }
  onTabClick(event: any) {
    //console.log('Selected tab index: ' + event.index);
    if (event.index == 0) {
      this.isLogin = true;
    } else if (event.index == 1) {
      this.isLogin = false;
    }
    this.switchForm(true);
  }

  switchForm(isTabClick: boolean = false) {
    debugger;
    if (!isTabClick) {
      this.selectedTabIndex = this.selectedTabIndex === 0 ? 1 : 0;
      this.isLogin = !this.isLogin;
    }
    if (this.isLogin) {
      this.form.removeControl('name');
      this.form.removeControl('confirmPassword');
    } else {
      this.form.addControl('name', this.fb.control('', Validators.required));
      this.form.addControl(
        'confirmPassword',
        this.fb.control('', [
          Validators.required,
          matchOtherValidator('password'),
        ])
      );
    }
  }

  getErrorMessage(controlName: string) {
    const control = this.form.get(controlName);
    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('email')) {
      return 'Please enter a valid email address';
    } else if (control.hasError('minlength')) {
      let len = control.errors?.['minlength']?.requiredLength;
      return `Password must be at least ${len} characters`;
    } else if (
      controlName === 'confirmPassword' &&
      control.hasError('passwordMismatch')
    ) {
      return 'Passwords do not match';
    }
    return '';
  }
}

// custom validator to check if two form controls match
export const passwordMatchValidator: ValidatorFn = (
  control: FormGroup
): { [key: string]: boolean } | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

export function matchOtherValidator(otherControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    const otherControl = control.parent.get(otherControlName);

    if (!otherControl) {
      return null;
    }

    return control.value === otherControl.value
      ? null
      : { passwordMismatch: true };
  };
}
