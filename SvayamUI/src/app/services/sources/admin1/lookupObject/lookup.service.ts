import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class LookupService {

  httpUrl;
  ent_cd;
  constructor(private appService: AppService, private http: HttpClient) {
    this.httpUrl = this.appService.httpUrl + '/metainfo';
    this.ent_cd = this.appService.ent_cd;
  }

  // get valid columns
  async getlookupInfo(lookupObj) {
    const str = JSON.stringify(lookupObj);
    const resp = await this.http.get<any>(this.httpUrl + '/getlookupinfo' + str).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  // get all lookup objects
  async getlookups() {
    const resp = await this.http.get<any>(this.httpUrl + '/getlookups' + this.ent_cd).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async getlookuInputs() {
    const resp = await this.http.get<any>(this.httpUrl + '/getlookupinputcols').toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async getMySQLtableCols(obj) {
    const param = JSON.stringify(obj);
    const resp = await this.http.get<any>(this.httpUrl + '/getmysqltablecols' + param).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  // insert new lookup
  async postlookupObject(Obj) {
    Obj['ent_cd'] = this.appService.ent_cd;
    const resp = await this.http.post<any>(this.httpUrl + '/createlookup' , Obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  // update lookup info
  async updatelookupObject(Obj) {
    Obj['ent_cd'] = this.appService.ent_cd;
    const resp = await this.http.put<any>(this.httpUrl + '/updatelookup' , Obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

    // update lookup info
    async deletelookupObject(Obj) {
      Obj['ent_cd'] = this.appService.ent_cd;
      const resp = await this.http.delete<any>(this.httpUrl + '/deletelookup' + Obj.lookup_id).toPromise().then(res => {
        return res;
      });
      if (!resp.error) {
        return resp.data;
      } else {
        return false;
      }
    }


}
