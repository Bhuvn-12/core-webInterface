import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppService} from '../../../../app.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {
  httpUrl;

  
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/settings/configuration/referenceData';
   }
   async getaccountDetails(ent_cd) {
    const waitres = await this.http.get<any>(this.httpUrl + '/getaccounts' + ent_cd).toPromise().then(res => {
      return res;
    }, error => {
      return 0;
    });
    console.log(waitres);
    if (waitres !== 0 || !waitres.error) {
      return waitres.data;
    } else {
      return 0;
    }
  }
  async delete(paramObj){
    var params=JSON.stringify(paramObj)
    var reswait=await this.http.delete<any>(this.httpUrl+'/deleteaccountsref' +params).toPromise().then(res=>{
      console.log(res);
      return res;
    })
    if (!reswait.error) {
      return true;
    } else {
      return true;
    }
  }
  async editsave(data) {
    const resp = await this.http.post<any>(this.httpUrl+'/modifyaccountsref' , data).toPromise().then(res => {
      console.log(res);
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