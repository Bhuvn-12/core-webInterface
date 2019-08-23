import { Injectable } from '@angular/core';
import { AppService } from '../../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RwaTbalanceService {
  show_trial_btn = false;
  trialData;
  percentage = 0;
  totalOfCapital = 0;
  totalOfRwa = 0;
  assetArr = [];
  capitalArr = [];
  rwaArr = [];
  params;
  httpUrl;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/reports/compliance/rwa';
   }
  setparams(params) {
    this.params = params;
  }

  async getCapital(params) {
    const resp = await this.http.post<any>(this.httpUrl + '/capitallevel1', params).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async getRwa(params) {
    const resp = await this.http.post<any>(this.httpUrl + '/risklevel1', params).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  // reset all variables
  resetAll() {

    this.show_trial_btn = false;
    this.trialData = undefined;
    this.percentage = 0;
    this.totalOfCapital = 0;
    this.totalOfRwa = 0;
    this.assetArr = [];
    this.capitalArr = [];
    this.rwaArr = [];
    this.params = undefined;
  }
}
