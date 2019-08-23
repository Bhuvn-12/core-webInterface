import { Injectable, Output, EventEmitter } from '@angular/core';
import { EntityrefreshService } from './services/entity-refresh/entityrefresh.service';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  // httpUrl = 'http://192.168.0.120:3000';
  httpUrl = 'http://103.97.185.146:8075';
  // httpUrl = 'http://192.168.0.6:3000';
  //  httpUrl = 'http://127.0.0.1:3000';


  @Output() AddEntity: EventEmitter<boolean> = new EventEmitter();
  constructor(private entityrefreshService: EntityrefreshService) {
    if (localStorage.getItem('usrDtls') !== null) {
      if (localStorage.getItem('entDtls') !== null) {
        const obj = JSON.parse(localStorage.getItem('entDtls'));
        this.ent_cd = obj[0].ent_cd;
      }
    }
  }

  // instance variables for Service
  prvs_ent_cd;
  resourceArr;
  ent_cd;
  selected_ent;
  entArr = [];
  currentpath;
  user_role;
  imgURL = './assets/img/admin-avatar.png';
  callTime = 0;

  async invokeHeader() {
    const Obj = new Object();
    const usrObj = JSON.parse(localStorage.getItem('usrDtls'));
    const email = usrObj.email;
    const resp = await this.entityrefreshService.is_getAgain(email);
    if (resp) {
      this.AddEntity.emit(true);
    }
  }
}
