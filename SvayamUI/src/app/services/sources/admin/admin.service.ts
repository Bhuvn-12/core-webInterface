import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {AppService} from '../../../app.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  httpUrl;
  ind_id;
  editsrcObj;
  constructor(private http: HttpClient, private appService: AppService ) {
    this.httpUrl = this.appService.httpUrl  +  '/sources/admin';
  }

  async mysourcesystem(myobj) {
    const resp = await this.http.get<any>(this.httpUrl  +  '/getSrcSystem'  +  myobj).toPromise().then(res => {
      this.ind_id = res.data[0].ind_id;
      return res;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;
    } else {
      console.log(resp.data);
      return false;
    }
  }
  async getRuleFiles(myobj) {
    const resp = await this.http.get<any>(this.httpUrl + '/getruleInformation' + myobj).toPromise().then(res => {
      return res;
    });
    console.log(resp);
    if (!resp.error) {
      return resp.data;

    }  else {
      console.log(resp.data);
      return false;
    }
  }

  async makeCurFile(myobj) {
    const resp = await this.http.put<any>(this.httpUrl + '/ActivateRuleFile', myobj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp;
    } else {
      return false;
    }

  }

  async downloadFile(myobj) {
    const resp = await this.http.post(this.httpUrl + '/downloadrulefile', myobj, {responseType: 'blob'}).toPromise().then(res => {
      return res;
    });
    console.log(resp);
    return resp;

  }

  async deleteSource(ss_id) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deletesrcsystem' + ss_id).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
}
