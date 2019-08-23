import { Injectable } from '@angular/core';
import {AppService} from '../../app.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  httpUrl;
  constructor(private appService: AppService, private http: HttpClient) {
    this.httpUrl = this.appService.httpUrl + '/operations';
   }

   async getPpd() {
    const resp = await this.http.get<any>(this.httpUrl + '/getallppd').toPromise().then(res => {
      // console.log(res);
    return res;
    });
    return resp;
    }
    async getCount(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getprocesscounts' + JSON.stringify(obj)).toPromise().then(res => {
    return res;
    });
    return resp;
    }
    async changeProcessState(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/changestate', obj).toPromise().then(res => {
    return res;
    });
    // console.log(resp);
    return resp;
    }
    async getStatus(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getActiveProcess' + obj).toPromise().then(res => {
    return res;
    });
    return resp;
    }
}
