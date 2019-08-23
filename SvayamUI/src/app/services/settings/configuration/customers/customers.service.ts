import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppService} from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  httpUrl;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/settings/configuration/referenceData';
   }
   async getcustomerDetails(ent_cd) {
    const waitres = await this.http.get<any>(this.httpUrl + '/getcustomers' + ent_cd).toPromise().then(res => {
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
  async delete(paramObj) {
    const params = JSON.stringify(paramObj);
    console.log(paramObj);
    const reswait = await this.http.delete<any>(this.httpUrl + '/deletecustomersref' + params).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!reswait.error) {
      return reswait.data;
    } else {
      return false;
    }
  }
  async editsave(data) {
    const resp = await this.http.post<any>(this.httpUrl + '/modifycustomersref', data).toPromise().then(res => {
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
