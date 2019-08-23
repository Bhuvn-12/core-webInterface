import { Injectable } from '@angular/core';
import { AppService } from '../../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ArrlistingService {
  constructor(private http: HttpClient, private appservice: AppService) {
    this.httpUrl = this.appservice.httpUrl + '/reports/control/trialbalance';
  }
  httpUrl;
  show_arr_btn = false;
  arrData; // lvl2data
  column_list;

  // set or selected filtetr variables

  params;
  lvl2params;
  arr_detail;
  accountObj;
  // data variables and total
  total = 0;




  // set params of arr listing
  setparams(param) {
    this.params = param;
  }

  async getData(params, columns) {
    const Obj = new Object();
    Obj['params'] = params;
    Obj['columns'] = columns;
    const resp1 = await this.http.post<any>(this.httpUrl + '/level2', Obj).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp1.error) {
      return resp1.data;
    } else {
      return false;
    }
  }

  async getnext100row() {
    const resp = await this.http.get<any>(this.httpUrl + '/lvl2nextrows').toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    }
  }

  // reset all variables
  resetAll() {
    this.show_arr_btn = false;
    this.arrData = undefined;
    // set or selected filtetr variables
    this.params = undefined;
    this.lvl2params = undefined;
    this.arr_detail = undefined;
    this.accountObj = undefined;
    this.total = 0;
  }
}
