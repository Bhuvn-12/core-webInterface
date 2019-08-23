import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import {SignupService} from '../services/signup/signup.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  uemail;
  pwd;
  conpwd;
  key;
  invalidselect = true;
  is_show = false;
  submitted = false;
  passwdmatch = false;
  myGroup: FormGroup;
  isSuccess;
  constructor(private _snackBar: MatSnackBar, private signupService: SignupService , private router: Router) { }

  ngOnInit() {

    this.myGroup = new FormGroup({
      useremail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      key: new FormControl('', Validators.required)

    });
  }

  get f() {
        return this.myGroup.controls;
     }

 async onSubmit() {
    this.uemail = this.myGroup.get('useremail').value;
    this.pwd = this.myGroup.get('password').value;
    this.conpwd = this.myGroup.get('confirmPassword').value;
    if (!this.is_show) {
      this.myGroup.setValue({
        useremail: this.uemail,
        password: this.pwd,
        confirmPassword: this.conpwd,
        key: 'not',
      });
      this.key = '';
    } else {
      this.key = this.myGroup.get('key').value;
    }
    const obj = new Object();
    obj['email'] = this.uemail;
    obj['password'] = this.pwd;
    obj['key'] = this.key;
    this.submitted = true;
    if (this.myGroup.invalid) {
      return;
    } else {
      if (this.pwd === this.conpwd) {
        this.passwdmatch = false;
        this.isSuccess = await this.signupService.signupFunc(obj);
        if (this.isSuccess) {
          this._snackBar.open('SignUp Successful' , 'close', {
            duration: 2000});
          this.router.navigate(['/login']);
        } else {
          this._snackBar.open('Some Error Ocurred' , 'close', {
            duration: 2000});
        }
      } else {
        this.passwdmatch = true;
      }
    }
  }

  selectedOption(event) {
    if (event.target.value === 'Exist') {
      this.is_show = true;
    } else {
      this.is_show = false;
    }
    if (event.target.value === 'Select Account') {
      this.invalidselect = true;
    } else {
      this.invalidselect = false;
    }
  }

}
