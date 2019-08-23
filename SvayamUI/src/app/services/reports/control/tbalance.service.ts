import { Injectable } from '@angular/core';
import { AppService } from '../../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { PPD, TrialBal } from '../../../../assets/modal';

@Injectable({
  providedIn: 'root'
})
export class TbalanceService {
  httpUrl;
  // total variable for every level
  totalOfTrialbal = 0;
  totalOfIncomestmt = 0;
  totalOfAssets = 0;
  totalOfLiability = 0;
  totalOfEquity = 0;
  totalOfBalSheet = 0;
  totalOfIncome = 0;
  totalOfExpense = 0;

  show_trial_btn = false;
  trialData;
  filterdata;
  params;

  // set or selected filtetr variables
  gaap_cd;
  curr_type_cd;
  curr_cd;
  selectedPpd;
  base_currency;
  org_unit_cd;
  acct_dt;


  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/reports/control/trialbalance';
  }
  async getData(params) {
    const resp = await this.http.post<any>(this.httpUrl + '/level1', params).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  setparams(param) {
    this.filterdata = param;
    this.params = param;
  }

  // reset all service variable;
  resetAll() {
    this.totalOfTrialbal = 0;
    this.totalOfIncomestmt = 0;
    this.totalOfAssets = 0;
    this.totalOfLiability = 0;
    this.totalOfEquity = 0;
    this.totalOfBalSheet = 0;
    this.totalOfIncome = 0;
    this.totalOfExpense = 0;
    this.show_trial_btn = false;
    this.trialData = undefined;
    this.filterdata = undefined;
    this.params = undefined;
    this.gaap_cd = undefined;
    this.curr_type_cd = undefined;
    this.curr_cd = undefined;
    this.selectedPpd = undefined;
    this.base_currency = undefined;
    this.org_unit_cd = undefined;
    this.acct_dt = undefined;
  }

}
