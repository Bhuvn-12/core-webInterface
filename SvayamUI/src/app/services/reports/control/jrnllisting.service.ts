import { Injectable } from '@angular/core';
import { AppService } from '../../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { PPD, TrialBal } from '../../../../assets/modal';


@Injectable({
  providedIn: 'root'
})
export class JrnllistingService {
  show_jrnl_btn = false;
  params;
  jrnlData; // lvl3data
  arrObj;
  accountObj;
  column_list;
  constructor(private http: HttpClient, private appservice: AppService) {
    this.httpUrl = this.appservice.httpUrl + '/reports/control/trialbalance';
   }
  httpUrl;

  async getData(params, columns) {
    const Obj = new Object();
    Obj['params'] = params;
    Obj['columns'] = columns;
    const resp = await this.http.post<any>(this.httpUrl + '/level3', Obj).toPromise().then(res => {
      console.log(res);
        return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async getnext100row() {
    const resp = await this.http.get<any>(this.httpUrl + '/lvl3nextrows').toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    }
  }

  async getcolumnList() {
    const resp = await this.http.get<any>(this.httpUrl + '/lvl3columns').toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  // reset all variable
  resetAll() {
    this.show_jrnl_btn = false;
    this.params = undefined;
    this.jrnlData = undefined; // lvl3data
    this.arrObj = undefined;
    this.accountObj = undefined;
  }
}
