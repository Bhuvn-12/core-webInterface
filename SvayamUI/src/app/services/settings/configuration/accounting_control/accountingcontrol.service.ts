
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppService} from '../../../../app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AccountingcontrolService {
  httpUrl;

  
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/settings/configuration/acctcontrol';
   }
   async getaccountControl(ent_cd) {
     const waitres = await this.http.get<any>(this.httpUrl + '/getacccontrol' + ent_cd).toPromise().then(res => {
      return res;
     }, error => {
       return 0;
     });

     if (waitres !== 0 || !waitres.error) {
       return waitres.data;
     } else {
       return 0;
     }
   }
 
   async edit_account_ctrl(data) {
     const resp = await this.http.post<any>(this.httpUrl+'/' , data).toPromise().then(res => {
     }, error => {
       return false;
     });
     if (resp['error'] === false) {
         return true;
     } else {
       return false;
     }

   }
  async date_save(data) {
    const resp = await this.http.post<any>(this.httpUrl+'/updateacccontrol' , data).toPromise().then(res => {
      return res;
    }, error => {
      return false;
    });
    if (resp['error'] === false) {
      return true;
    } else {
      return false;
    }

  }

}
