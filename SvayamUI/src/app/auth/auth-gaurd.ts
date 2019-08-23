import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { AppService } from '../app.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('Calling login');
    if (localStorage.getItem('usrDtls')) {
      return true;
    } else {
      this.router.navigate([this.loginService.getLoginUrl()]);
      return false;
    }
  }
}

@Injectable()
export class CheckAccessablity implements CanActivate {
  constructor(private appService: AppService) {

  }
  resourceMap = {
    home: 'RE1', reports: 'RE2', adjustment: 'RE3', sources: 'RE4', operations: 'RE5',
    sadaccount: 'RE6', saduser: 'RE7', sadrole: 'RE8', sadpermission: 'RE9', sconorg: 'RE11',
    sconpgroup: 'RE12', sconledger: 'RE13', sconactl: 'RE14', sconrefdata: 'RE15', sconpros: 'RE16', sconops: 'RE17',
    sconrpt: 'RE18'
  };
  compName;
  ent_cd;
  flag = false;
  resourceArr;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, ): boolean {
    // console.log('calling for component', this.compName);
    this.compName = route.data.compName;
    this.ent_cd = this.appService.ent_cd;
    this.flag = false;
    const obj = JSON.parse(localStorage.getItem('entDtls'));
    if (obj.length !== 0) {

      if (this.appService.prvs_ent_cd !== this.ent_cd) {
        this.appService.prvs_ent_cd = this.ent_cd;
        for (let i = 0; i < obj.length; i++) {
          if (obj[i].ent_cd === this.ent_cd) {
            this.resourceArr = obj[i].resource_info;
            this.appService.resourceArr = this.resourceArr;
            this.appService.prvs_ent_cd = this.ent_cd;
            localStorage.setItem('resourceArr', JSON.stringify(this.resourceArr));
            break;
          }
        }
      }
    } else {
      this.resourceArr = obj[0].resource_info;
      this.appService.resourceArr = this.resourceArr;
      this.appService.prvs_ent_cd = this.ent_cd;
    }
    this.resourceArr = this.appService.resourceArr;
    for (let j = 0; j < this.resourceArr.length; j++) {
      if (this.resourceArr[j].resource_id === this.resourceMap[this.compName]) {
        this.flag = true;
        break;
      }
    }
    return this.flag;
  }
}
