import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppService} from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class AddSourceService {
  httpUrl;
  constructor(private _http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/sources/admin';
  }

  async getSrc(ind_id) {
    const Obj = new Object();
    Obj['ent_cd'] = this.appService.ent_cd;
    Obj['ind_id'] = ind_id;
    const params = JSON.stringify(Obj);
    const resp = await this._http.get<any>(this.httpUrl + '/getIndustrysrcsystem' + params).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      console.log(resp);
      return resp.data;
    }
  }
  async getproducts(paramObj) {
    const params = JSON.stringify(paramObj);
    const resp = await this._http.get<any>(this.httpUrl + '/getproducts' + params).toPromise().then(data => {
      return data;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async getevents(param) {
    const params = JSON.stringify(param);
    const resp1 = await this._http.get<any>(this.httpUrl + '/getevents' + params).toPromise().then(data => {
      return data;
    });
    console.log(resp1);
    if (!resp1.error) {
      return resp1.data;
    } else {
      return false;
    }
  }
  async getall_customers() {
    const resp1 = await this._http.get<any>(this.httpUrl + '/getallcustomers').toPromise().then(data => {
      return data;
    });
    console.log(resp1);
    if (!resp1.error) {
      return resp1.data;
    } else {
      return false;
    }
  }
  async getaccount(param) {
    console.log(param);
    const params = JSON.stringify(param);
    const resp1 = await this._http.get<any>(this.httpUrl + '/getAllaccounts' + params).toPromise().then(data => {
      return data;
    });
    console.log(resp1);
    if (!resp1.error) {
      return resp1.data;
    } else {
      return false;
    }
  }

  async postData(dataObj) {
    const resp1 = await this._http.post<any>(this.httpUrl + '/addsrcsystem', dataObj).toPromise().then(data => {
      return data;
    });
    console.log(resp1);
    if (!resp1.error) {
      return resp1.data;
    } else {
      return false;
    }
  }
}
