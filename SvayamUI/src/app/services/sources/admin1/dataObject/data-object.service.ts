import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';

@Injectable({
  providedIn: 'root'
})
export class DataObjectService {

  httpUrl;
  ent_cd;
  constructor(private appService: AppService, private http: HttpClient) {
    this.httpUrl = this.appService.httpUrl + '/metainfo';
    this.ent_cd = this.appService.ent_cd;
  }

  async getDataObject(ent_cd) {
    const resp = await this.http.get<any>(this.httpUrl + '/getmodelinfo' + this.appService.ent_cd).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async saveDataObject(ent_cd, dataObj) {
    const Obj = new Object();
    Obj['model_name'] = dataObj;
    Obj['ent_cd'] = this.appService.ent_cd;
    const resp = await this.http.post<any>(this.httpUrl + '/createmodel', Obj).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async updateColumn(ent_cd, dataObj) {
    const resp = await this.http.put<any>(this.httpUrl + '/updatemodelinfo', dataObj).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async deleteColumn(ent_cd, dataObj) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deletemodelinfo' + dataObj.id).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async insertColumn(ent_cd, dataObj) {
    let Obj = new Object();
    Obj = dataObj;
    Obj['ent_cd'] =this.appService.ent_cd ;
    const resp = await this.http.post<any>(this.httpUrl + '/insertmodelinfo', Obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async downloadDrl(Obj) {
    Obj['ent_cd'] = this.appService.ent_cd;
    const resp = await this.http.get(this.httpUrl + '/downloadRuleFile' + Obj.rule_set_id,
     { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    } else {
      return false;
    }
  }
}
