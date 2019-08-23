import { Injectable, Output, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class RuleDefinitionService {

  httpUrl;
  ent_cd;
  clickedObj;
  action;
  dataObjArr;
  dataModel;
  drivedKeyArr = [];
  lookups = [];
  @Output() RefreshRule: EventEmitter<boolean> = new EventEmitter();

  constructor(private appService: AppService, private http: HttpClient) {
    this.httpUrl = this.appService.httpUrl + '/source';
    this.ent_cd = this.appService.ent_cd;
  }

  async invokeRuleComp() {
      this.RefreshRule.emit(true);
  }
  // get all rule set for entity
  async getRuleSet(ent_cd) {
    const resp = await this.http.get<any>(this.httpUrl + '/getrulesetinfo' +  this.appService.ent_cd).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  // get all input dataObject for entity
  async getmodels(ent_cd) {
    const resp = await this.http.get<any>(this.httpUrl + '/getmodels' +  this.appService.ent_cd).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  // get a selected ruleObject
  async getRuleSetStruct(obj) {
    const param = JSON.stringify(obj);
    const resp = await this.http.get<any>(this.httpUrl + '/getrulesetstructure' + param).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async createDrl(Obj) {
    Obj['ent_cd'] =  this.appService.ent_cd;
    const resp  = await this.http.post<any>(this.httpUrl + '/createdrl', Obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp;
    } else {
      return false;
    }
  }
  async updateDrl(Obj) {
    Obj['ent_cd'] =  this.appService.ent_cd;
     const resp  = await this.http.put<any>(this.httpUrl + '/updatedrl', Obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp;
    } else {
      return false;
    }
  }


}
