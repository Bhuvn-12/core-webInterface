import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaderResponse } from '@angular/common/http';
import {AppService} from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class LegalEntityService {
  httpUrl;
  constructor(private http: HttpClient , private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/settings/configuration';
  }

  async mylegalentityy(myobj) {
    const resp = await this.http.get<any>(this.httpUrl + '/Organisation/getlegalEntity' + myobj)
    .toPromise().then(res => {
      return res;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;

    } else {
      return false;
    }
  }

  async myindustry() {
    const resp = await this.http.get<any>(this.httpUrl + '/Organisation/getindustry')
    .toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;

    } else {

      return false;
    }
  }


  async mycountry() {
    const resp = await this.http.get<any>(this.httpUrl + '/Organisation/getcountry')
    .toPromise().then(res => {
      console.log(res);
      return res;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;

    } else {

      return false;
    }
  }

  async sendorganization(obj) {
    const resp = await this.http.post(this.httpUrl + '/Organisation/addLegalEntity', obj)
    .toPromise().then(res => {
      return res;
    });
    console.log(resp);
    if (resp) {
      return resp;

    } else {

      return false;
    }
  }

  async mycurrency() {
    const  resp = await this.http.get<any>(this.httpUrl + '/Organisation/getcurrency')
    .toPromise().then(res => {
      return res;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;

    } else {

      return false;
    }
  }

  async mycostcenter() {
    const  resp = await this.http.get<any>(this.httpUrl + '/Organisation/getcostCenter')
    .toPromise().then(res => {
      return res;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;

    } else {

      return false;
    }

  }

  async saveAllAdvanceDetail(obj) {
    const resp = await this.http.put(this.httpUrl + '/Organisation/updateReporting', obj)
    .toPromise().then(res => {
      return res;
    });
    console.log(resp);
    if (resp) {
      return resp;

    } else {

      return false;
    }
  }

  async deleteLegalEntity(obj) {
    console.log(obj);
    const resp = await this.http.delete(this.httpUrl +
    '/Organisation/deletelegalentity' + obj).toPromise().then(res => {
    return res;
    });
    console.log(resp);
    return resp['error'];
  }
}
