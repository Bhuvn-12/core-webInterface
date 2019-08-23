import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {AppService} from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  httpUrl;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/settings/admin/account';
  }
  async getAccountDetails(id) {
    const waitres = await this.http.get<any>(this.httpUrl + '/getaccountInfo' + id).toPromise().then(res => {
      return res;
    }, error => {
      return 0;
    });
   // console.log(waitres);
    if (waitres !== 0 || !waitres.error) {
      return waitres.data;
    } else {
      return 0;
    }
  }
  async getImage(acct_id) {
    const obj = new Object();
    obj['acct_id'] = acct_id;
    const resp = await this.http.post(this.httpUrl + '/getaccountimage', obj, { responseType: 'blob' }).toPromise().then(res => {
     // console.log('calling');
     // console.log(res);
      return res;
    });
    if (resp) {
      return resp;
    }
  }
  async editaccountname(data) {
   console.log('testing',data);
    const resp = await this.http.post<any>(this.httpUrl + '/updateaccountinfo', data).toPromise().then(res => {
      console.log(res);
            return res;
    }, error => {
      return 0;
    });
    console.log(resp);
    if (resp['error'] === false) {
      return true;
    } else {
      return false;
    }

  }
}
