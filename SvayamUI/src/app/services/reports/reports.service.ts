import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../app.service';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/reports';
  }
  httpUrl;
  acc_numlist = [];
  gaapArray = [];
  currTypeArray = [];
  cuurCodeArray = [];
  base_currency;
  ppdArray;

  curr_cd;

  async getAccount(ent_cd) {
    const resp = await this.http.get<any>(this.httpUrl + '/reporting_accounts' + ent_cd).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      this.acc_numlist = resp.data;
      return resp.data;
    } else {
      return false;
    }

  }

  async getGaapCurrPpd(ent_cd) {
    // ent_cd = 'R101';
    const resp = await this.http.get<any>(this.httpUrl + '/reporting_fields' + ent_cd).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      this.gaapArray = resp.data.gaap;
      this.base_currency = resp.data.base_currency;
      this.ppdArray = resp.data.ppd;
      return resp.data;
    } else {
      return false;
    }

  }

  // get today date for restrict user select max today date
  getTodayDate() {
    const today = new Date();
    const mm = today.getMonth() + 1;
    let day;
    let mon;
    if (mm < 10) {
      mon = '0' + mm;
    } else {
      mon = mm;
    }
    if (today.getDate() < 10) {
      day = '0' + today.getDate();
    } else {
      day = today.getDate();
    }
    const todaydate = today.getFullYear() + '-' + mon + '-' + day;
    return todaydate;

  }

  setcurrSymbol(currcd) {
    this.curr_cd = currcd;
    if (this.curr_cd === 'USD') {
      return '$';
    }
    if (this.curr_cd === 'INR') {
      return '₹';
    }
    if (this.curr_cd === 'GBP') {
      return '£';
    }
    if (this.curr_cd === 'HKD') {
      return 'HK$';
    }
    if (this.curr_cd === 'CAD') {
      return 'C$';
    }

  }

  async getArrCols() {
    const resp = await this.http.get<any>(this.httpUrl + '/getarrcols').toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async getSjeCols() {
    const resp = await this.http.get<any>(this.httpUrl + '/getsjecols').toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

}
