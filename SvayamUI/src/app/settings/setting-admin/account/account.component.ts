import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from 'src/app/app.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AccountService } from 'src/app/services/settings/admin-settings/account/account.service';
declare var $: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,private appService: AppService, private accountService: AccountService, private router: Router,
    private sanitizer: DomSanitizer) {
    this.httpUrl = this.accountService.httpUrl;
  }
  public imagePath;
  accountInfo;
  jsonObj ;
  user_id;
  selectedFile: File = null;
  isUpload;
  accountname;
  imgURL;
  uploader;
  editable = true;
  editGroup: FormGroup;
  httpUrl;
  isEdit;
  acct_id ;
  async ngOnInit() {
    this.editGroup = new FormGroup({
      accountname: new FormControl(),
      acct_id: new FormControl(),
     

    });

    const userObj = JSON.parse(localStorage.getItem('usrDtls'));
    this.acct_id = userObj.acct_id;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'aimage' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.imgURL = this.appService.imgURL;
    this.user_id = userObj.user_id;
    this.accountInfo = await this.accountService.getAccountDetails(this.user_id);
    if (this.accountInfo) {
      this.jsonObj ={};
      console.log(this.accountInfo);
      this.jsonObj = this.accountInfo[0];
      this.getImage();
    }
    this.editGroup = new FormGroup({
      accountname: new FormControl(),
      acct_id: new FormControl()

    });

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

    obj['acct_id'] = this.acct_id;
    obj['file_name'] = this.uploader.queue[0].some.name;
    const params = JSON.stringify(obj);
    this.uploader.queue[0].url = this.httpUrl + '/uploadaccountimage' + params;
    this.uploader.queue[0].upload();
    this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
      if (!response.error) {
        const acct_id =  this.acct_id;
        const res = await this.accountService.getImage(acct_id);
        if (res) {
          const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
          this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
        }
      }
    };
  }

  async getImage() {
    const acct_id = this.acct_id;
    const res = await this.accountService.getImage(acct_id);
    if (res) {
      const unsafeImageUrl = window.URL.createObjectURL(res); // URL.createObjectURL(res);
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
    }

  }
  async edit() {
    console.log(this.editable);
    this.editable = false;
    this._snackBar.open('Now You Can Edit','close', {
      duration: 2000,})
  
  }
  async save() {
    console.log(this.editGroup);

    this.accountname = this.editGroup.get('accountname').value;
    // this.acct_id = this.editGroup.get('acct_id').value;
    const obj = new Object();
    obj['acct_name'] = this.accountname;
    obj['acct_id'] = this.acct_id;
    console.log(obj);
    this.isEdit = await this.accountService.editaccountname(obj);
    console.log( this.isEdit);
    if(this.isEdit){
     
      this._snackBar.open('Account Updated Successful', 'close', {
        duration: 2000});
      

    }
     await this.accountService.getAccountDetails(this.user_id);
  }


}
