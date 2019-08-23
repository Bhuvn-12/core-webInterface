import { Injectable } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  httpUrl;
  tbalance;
  constructor(private appService: AppService, private http: HttpClient) {
    this.httpUrl = this.appService.httpUrl + '/home';
  }

  async getannouncements() {
    const resp = await this.http.get<any>(this.httpUrl + '/getannouncements').toPromise().then(res => {
     // console.log(res);
      return res;
    });
    if (resp.error) {
      return false;
    } else {
      return resp.data;
    }
  }
  async getTBalance(obj) {
    const params = JSON.stringify(obj);
    const resp = await this.http.get<any>(this.httpUrl + '/home_report' + params).toPromise().then(res => {
     // console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    }

  }

  async getSystemState(ent_cd) {
    const resp = await this.http.get<any>(this.httpUrl + '/getSystemDataCounts' + ent_cd).toPromise().then(res => {
     // console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    }
  }

  async getTutorils() {
    const resp = await this.http.get<any>(this.httpUrl + '/gettutorials').toPromise().then(res => {
     // console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    }
  }
}
