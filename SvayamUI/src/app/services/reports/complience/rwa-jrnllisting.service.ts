import { Injectable } from '@angular/core';
import { AppService } from '../../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { PPD, TrialBal } from '../../../../assets/modal';

@Injectable({
  providedIn: 'root'
})
export class RwaJrnllistingService {
  show_jrnl_btn = false;
  params;
  jrnlData; // lvl3data
  arrObj;
  accountObj;
  riskObj;
  total = 0;
  column_list;
  constructor(private http: HttpClient, private appservice: AppService) {
    this.httpUrl = this.appservice.httpUrl + '/reports/compliance/rwa';
   }
  httpUrl;

  async getData(params, columns) {
    const Obj = new Object();
    Obj['params'] = params;
    Obj['columns'] = columns;
    const resp = await this.http.post<any>(this.httpUrl + '/rwalevel3', Obj).toPromise().then(res => {
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
    // reset all variables
    resetAll() {
      this.params = undefined;
      this.accountObj = undefined;
      this.riskObj = undefined;
      this.show_jrnl_btn = false;
      this.jrnlData = undefined;
      this.total = 0;
    }
}
