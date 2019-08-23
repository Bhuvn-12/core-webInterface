import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LayoutService } from '../../services/layouts/layout.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from '../../app.service';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[app-sidebar]',
  templateUrl: './app-sidebar.component.html'
})
// tslint:disable-next-line: component-class-suffix
export class AppSidebar implements OnInit {
  resourceMap = {
    home: 'RE1', reports: 'RE2', adjustment: 'RE3', sources: 'RE4', operations: 'RE5',
    sadaccount: 'RE6', saduser: 'RE7', sadrole: 'RE8', sadpermission: 'RE9', sconorg: 'RE11',
    sconpgroup: 'RE12', sconledger: 'RE13', sconactl: 'RE14', sconrefdata: 'RE15', sconpros: 'RE16', sconops: 'RE17',
    sconrpt: 'RE18'
  };
  showLinkMap = {
    home: true, reports: true, adjustment: false, sources: false, operations: false,
    sadaccount: false, saduser: false, sadrole: false, sadpermission: false, sconorg: false,
    sconpgroup: false, sconledger: false, sconactl: false, sconrefdata: false, sconpros: false, sconops: false,
    sconrpt: false
  };
  imgURL;
  user_fname;
  user_lname;
  // tslint:disable-next-line: use-life-cycle-interface
  constructor(private layoutService: LayoutService,
    private sanitizer: DomSanitizer, private appService: AppService, private profileService: ProfileService) {
  }
  async ngOnInit() {
    // const resourceArr = JSON.parse(localStorage.getItem('resourceArr'));
    // console.log(resourceArr);
    this.imgURL = this.appService.imgURL;
    const usrObj = JSON.parse(localStorage.getItem('usrDtls'));
    await this.getUserInfo(usrObj);
    const resp = await this.layoutService.getUserImage(usrObj.user_id);
    if (resp) {
      const unsafeImageUrl = window.URL.createObjectURL(resp); // URL.createObjectURL(res);
      this.imgURL = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      this.layoutService.imgURL = this.imgURL;
      this.appService.imgURL = this.imgURL;
    }

    /*     for (let i = 0; i < resourceArr.length; i++) {
           if (resourceArr[i].resource_id === this.resourceMap.reports) {
            this.showLinkMap.reports = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.adjustment) {
            this.showLinkMap.adjustment = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sources) {
            this.showLinkMap.sources = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.operations) {
            this.showLinkMap.operations = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sadaccount) {
            this.showLinkMap.sadaccount = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.saduser) {
            this.showLinkMap.saduser = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sadrole) {
            this.showLinkMap.sadrole = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sadpermission) {
            this.showLinkMap.sadpermission = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconorg) {
            this.showLinkMap.sconorg = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconpgroup) {
            this.showLinkMap.sconpgroup = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconledger) {
            this.showLinkMap.sconledger = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconactl) {
            this.showLinkMap.sconactl = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconrefdata) {
            this.showLinkMap.sconrefdata = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconpros) {
            this.showLinkMap.sconpros = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconops) {
            this.showLinkMap.sconops = true;
          }
          if (resourceArr[i].resource_id === this.resourceMap.sconrpt) {
            this.showLinkMap.sconrpt = true;
          }
        } */

  }
  async getUserInfo(usrObj) {
    // const usrObj = JSON.parse(localStorage.getItem('usrDtls'));
    const resp = await this.profileService.getUserDetails(usrObj.user_id);
    if (resp) {
      this.user_fname = resp[0].f_name;
      this.user_lname = resp[0].l_name;
      return true;
    }
  }
}
