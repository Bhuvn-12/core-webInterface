import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,private router: Router, private loginService: LoginService, private formBuilder: FormBuilder) { }

  uemail;
  pwd;
  loginGroup: FormGroup;
  submitted = false;
  incorrect_details = false;
  email;
  emailForm: FormGroup;
  ngOnInit() {
    this.loginGroup = new FormGroup({
      useremail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    this.emailForm = this.formBuilder.group({
      email_Id: ['', [Validators.required]]// Validators.email_Id
    });
  }
  get f() {
    return this.loginGroup.controls;
  }

  async onSubmit() {
    this.uemail = this.loginGroup.get('useremail').value;
    this.pwd = this.loginGroup.get('password').value;
    const obj = new Object();
    obj['email'] = this.uemail;
    obj['password'] = this.pwd;
    this.submitted = true;

    if (this.loginGroup.invalid) {
      console.log(this.f);
    } else {
      console.log('validated');
      const res = await this.loginService.is_authanticated(obj);
      if (res === true) {
       

        this._snackBar.open("Login Successful","close", {
          duration: 2000,
        });
        this.router.navigate(['/home']);

      } else {
        this._snackBar.open("Error in Email or Password","close", {
          duration: 2000,
        });
        this.incorrect_details = true;

      }

    }
  }
  // logout function
  logout() {
    this.loginService.logout();
  }
  async resetpass() {
    this.submitted = true;
    if (this.emailForm.invalid) {
      return;
    } else {
      const log = new Object();
      log['email'] = this.emailForm.get('email_Id').value;
      const res = await this.loginService.resetPassword(log);
      if (res) {
        $('#modelId').modal('hide');
      }
    }
    }

    get f1() {
      return this.emailForm.controls;
    }
}
