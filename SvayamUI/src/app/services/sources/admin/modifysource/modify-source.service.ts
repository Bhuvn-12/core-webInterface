import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class ModifySourceService {

  httpUrl = '';
  constructor(private _http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/sources/admin';
   }

  async getSrc(param) {
    const resp = await this._http.get<any>(this.httpUrl + '/getsrcinfo' + param).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (resp) {
      console.log(resp);
      return resp.data;
    } else {
      return false;
    }
  }
  async getproducts(paramObj) {
    console.log(paramObj);
    const param = JSON.stringify(paramObj);
    console.log(param);
    const resp = await this._http.get<any>(this.httpUrl + '/getprodinfo' + param).toPromise().then(data => {
      return data;
    });
    console.log(resp);
    if (resp) {
      return resp.data;
    }
  }
  async getevents(a) {
    const param = JSON.stringify(a);
    console.log(param);
    const resp1 = await this._http.get<any>(this.httpUrl + '/geteventinfo' + param).toPromise().then(data => {
      return data;
    });
    console.log(resp1);
    if (!resp1.error) {
      return resp1.data;
    } else {
      return false;
    }
  }
  async getall_customers(param) {
    console.log(param);
    const resp = await this._http.get<any>(this.httpUrl + '/getcustomers' + param).toPromise().then(data => {
      return data;
    });
    console.log(!resp.error);
    if (resp) {
      return resp.data;
    } else {
      return false;
    }
  }
  async getaccount(a) {
    const param = JSON.stringify(a);
    console.log(param);
    const resp = await this._http.get<any>(this.httpUrl + '/getaccinfo' + param).toPromise().then(data => {
      return data;
    });
    console.log(resp);
    if (resp) {
      return resp.data;
    } else {
      return false;
    }
  }

  async deleteData(dataObj) {
    const resp = await this._http.post<any>(this.appService.httpUrl + '/test/modifysrcdeletemysql' , dataObj).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {

    }
  }

  async addEdit(dataObj) {
    const resp = await this._http.post<any>(this.appService.httpUrl + '/test/modifysrcaddupdate' , dataObj).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {

    }
  }
}
