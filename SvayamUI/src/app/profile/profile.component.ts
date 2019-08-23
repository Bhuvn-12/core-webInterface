import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import {AppService} from '../app.service';
import { ProfileService } from '../services/profile/profile.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private router: Router,
     private profileService: ProfileService, private sanitizer: DomSanitizer,
    private appService: AppService, private route: ActivatedRoute) {
    this.httpUrl = this.profileService.httpUrl;
    this.route.params.subscribe(param => {
      console.log(param);
    });
  }
  profileInfo;
  jsonObj: any;
  pwd;
  conpwd;
  profileGroup: FormGroup;
  editGroup: FormGroup;

  submitted = false;
  submit = false;
  passwdmatch = false;
  isChange;
  firstname;
  lastname;
  eml;
  phn;
  desg;
  address1;
  address2;
  count;
  sta;
  cde;
  user_id;
  oldpass;
  isEdit;
  selectedFile: File = null;
  isUpload;
  public imagePath;
  imgURL;
  uploader;

  httpUrl;
  async ngOnInit() {
    const userObj = JSON.parse(localStorage.getItem('usrDtls'));
    this.user_id = userObj.user_id;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'pimage' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.imgURL = this.appService.imgURL;

    this.profileInfo = await this.profileService.getUserDetails(this.user_id);
    console.log(this.profileInfo);
    if (this.profileInfo) {
      this.jsonObj = this.profileInfo[0];
    }
    this.profileGroup = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });

    this.editGroup = new FormGroup({
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      des: new FormControl('', [Validators.required]),
      add1: new FormControl('', [Validators.required]),
      add2: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
    });
      const res = await this.profileService.getImage(this.user_id);
    if (res) {
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    }
  }
  get f() {
    return this.profileGroup.controls;
  }
  get P() {
    return this.editGroup.controls;
  }
  async onSubmit() {
    this.submitted = true;
    this.pwd = this.profileGroup.get('password').value;
    this.conpwd = this.profileGroup.get('confirmPassword').value;
    this.oldpass = this.profileGroup.get('oldPassword').value;
    const obj = new Object();
    obj['newPassword'] = this.pwd;
    obj['oldPassword'] = this.oldpass;
    obj['user_id'] = this.user_id;

    // stop here if form is invalid
    if (this.profileGroup.invalid) {
      console.log(this.f.password.errors);
      return;
    } else {
      console.log(this.pwd, this.conpwd);
      if (this.pwd === this.conpwd) {
        console.log('inside if pass');
        this.passwdmatch = false;
        this.isChange = await this.profileService.changepassword(obj);
        if (this.isChange) {
          this._snackBar.open('Password Updated Successful', 'close', {
            duration: 2000});
          $('#modelId').modal('hide');

        }
      } else {
        console.log('inside not match');
        this.passwdmatch = true;
      }

    }



  }
  async Save() {
    this.submit = true;

    this.firstname = this.editGroup.get('fname').value;
    this.lastname = this.editGroup.get('lname').value;
    this.eml = this.editGroup.get('email').value;
    this.phn = this.editGroup.get('phone').value;
    this.desg = this.editGroup.get('des').value;
    this.address1 = this.editGroup.get('add1').value;
    this.address2 = this.editGroup.get('add2').value;
    this.count = this.editGroup.get('country').value;
    this.sta = this.editGroup.get('state').value;
    this.cde = this.editGroup.get('code').value;

    const obj = new Object();
    obj['firstname'] = this.firstname;
    obj['lastname'] = this.lastname;
    obj['email'] = this.eml;
    obj['phone_number'] = this.phn;
    obj['desgination'] = this.desg;
    obj['address1'] = this.address1;
    obj['address2'] = this.address2;
    obj['country'] = this.count;
    obj['state'] = this.sta;
    obj['code'] = this.cde;
    obj['user_id'] = this.user_id;
    if (this.editGroup.invalid) {
      return;
    } else {
      this.isEdit = await this.profileService.updateprofile(obj);
      if (this.isEdit) {
        this._snackBar.open('Profile Update Successful', 'close', {
          duration: 2000});
        $('#modelId1').modal('hide');

      }
    }
  }

  onFileUpload(event, files) {
    this.selectedFile = <File>event.target.files[0];
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  async Upload() {
    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    const obj = new Object();
    obj['user_id'] = this.user_id;
    obj['file_name'] = this.uploader.queue[0].some.name;
    const params = JSON.stringify(obj);
    this.uploader.queue[0].url = this.httpUrl + '/uploadimage' + params;
    this.uploader.queue[0].upload();
    this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
      if (!response.error) {
        const res = await this.profileService.getImage(this.user_id);
        if (res) {
          const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
          this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        }
      }
    };
  }

  // async getImage() {
  //   const res = await this.profileService.getImage('1');
  //   if (res) {
  //     const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
  //     this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
  //   }

  // }

}
