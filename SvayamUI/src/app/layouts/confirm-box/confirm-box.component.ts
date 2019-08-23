import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmBoxComponent>, @Inject(MAT_DIALOG_DATA) public message: string) {
  }
    onNoClick(): void {
    this.dialogRef.close();
  }

}
