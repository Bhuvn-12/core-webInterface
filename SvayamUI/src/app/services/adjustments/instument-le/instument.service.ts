import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {AppService} from '../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class InstumentService {

  httpUrl;

  constructor(private http: HttpClient, private appservice: AppService) {
    this.httpUrl = this.appservice.httpUrl + '/adjustment/instrumentle' ;
   }
  async getdetails(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getdetails' + obj).toPromise().then(res => {
      return res;

    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;
    }  else {
      return false;
    }


  }
  async postData(dataObj) {
    const resp1 = await this.http.post<any>(this.httpUrl + '/postjournal', dataObj).toPromise().then(data => {
      return data;
    });
    console.log(resp1);
    if (resp1) {
      return resp1.data;
    }
  }

}
