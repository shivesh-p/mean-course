import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error.component.html',
  styles: [],
})
export class ErrorComponent {
  errorMessage: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {
    this.errorMessage = data.message;
  }
}
