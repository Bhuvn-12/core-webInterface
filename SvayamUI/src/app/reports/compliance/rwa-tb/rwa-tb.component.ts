import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from '../../../services/reports/reports.service';
import { AppService } from '../../../app.service';
import { RwaTbalanceService } from '../../../services/reports/complience/rwa-tbalance.service';
import { RwaArrlistingService } from '../../../services/reports/complience/rwa-arrlisting.service';
import { RwaJrnllistingService } from '../../../services/reports/complience/rwa-jrnllisting.service';
import { FormControl } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-rwa-tb',
  templateUrl: './rwa-tb.component.html',
  styleUrls: ['./rwa-tb.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RwaTbComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private router: Router, private tbalService: RwaTbalanceService,
    private arrService: RwaArrlistingService, private jrnlService: RwaJrnllistingService, private reportService: ReportsService,
    private appService: AppService) { }

  // set selected
  gaapctl = new FormControl();
  currtypectl = new FormControl();
  currcodectl = new FormControl();
  ppdctl = new FormControl();
  acct_dt_ctl = new FormControl();

  // set or selected filtetr variables
  gaap_cd;
  curr_type_cd;
  curr_cd;
  selectedPpd;
  base_currency;
  org_unit_cd;
  acct_dt;
  todayDate;
  // params for filter
  params ;
  Currency_symbol;

  // data variable
  data;
  assetArr = [];
  capitalArr = [];
  rwaArr = [];
  reload;
  percentage = 0;
  totalOfCapital = 0;
  totalOfRwa = 0;

  // variable to check show button or not
  show_arr_btn = false;
  show_jrnl_btn = false;
  show_trial_btn = false;

  // filter varialbes declaaration
  gaapArray;
  currTypeArray = ['FN', 'PR', 'TX'];
  currCodeArray = ['INR', 'USD', 'HKD', 'GBP', 'CAD'];
  ppdArray = [];

  async ngOnInit() {
    this.show_arr_btn = this.arrService.show_arr_btn;
    this.show_jrnl_btn = this.jrnlService.show_jrnl_btn;
    this.tbalService.show_trial_btn = true;
    this.show_trial_btn = true;
    this.todayDate = this.reportService.getTodayDate();
    this.org_unit_cd = this.appService.ent_cd;
    // this.appService.ent_cd;
    this.acct_dt = this.todayDate;
    this.params = this.tbalService.params;
    // console.log(this.params);
    if (this.params === undefined) {
      // console.log('inside no prams');
      const setwait = await this.getdefault();
      if (setwait) {
        // console.log('request for data');
        const respdata = await this.getData();
        if (respdata) {
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }
    } else if (this.tbalService.capitalArr.length === 0 || this.tbalService.rwaArr.length === 0) {
      const setwait = await this.getdefault();
      if (setwait) {
        this.setallInstanceVariables();
        const resp = await this.getData();
        if (resp) {
          this.bindAafterBack();
          this.spinner.hide();
        }
      } else {
        this.spinner.hide();
      }
    } else {
      const setwait = await this.getdefault();
      if (setwait) {
        this.setallInstanceVariables();
        this.bindAafterBack();
        this.rwaArr = this.tbalService.rwaArr;
        this.capitalArr = this.tbalService.capitalArr;
        this.refactorData();
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    }
  }

  async getData() {
      this.params = {};
      this.params['gaap_cd'] = this.gaap_cd;
      this.params['tgt_curr_cd'] = this.curr_cd;
      this.params['tgt_curr_type_cd'] = this.curr_type_cd;
      this.params['org_unit_cd'] = this.org_unit_cd;
      this.params['acct_dt'] = this.acct_dt; // this.acct_dt;
      this.params['ppd'] = this.selectedPpd;
      this.tbalService.setparams(this.params);
      this.spinner.show();
    const resp = await this.tbalService.getCapital(this.params);
    if (resp) {
      this.capitalArr = resp;
      // console.log(this.capitalArr);
      this.tbalService.capitalArr = this.capitalArr;
    }
      const resprwa = await this.tbalService.getRwa(this.params);
      if (resprwa) {
        this.rwaArr = resprwa;
        this.tbalService.rwaArr = this.rwaArr;
    }
    this.refactorData();
    this.spinner.hide();
    return true;
  }
  // refreshData and request forn new data
  async refreshData() {
    this.tbalService.show_trial_btn = true;
    this.resetAll();
    this.params = {};
    this.params['gaap_cd'] = this.gaap_cd;
    this.params['tgt_curr_cd'] = this.curr_cd;
    this.params['tgt_curr_type_cd'] = this.curr_type_cd;
    this.params['org_unit_cd'] = this.org_unit_cd;
    this.params['acct_dt'] = this.acct_dt;
    this.params['ppd'] = this.selectedPpd;
    this.tbalService.setparams(this.params);
    // get data request
    this.getData();
  }

  // refactor data after getting
  refactorData() {
    this.tbalService.capitalArr = this.capitalArr;
    this.tbalService.rwaArr = this.rwaArr;
    this.percentage = 0;
    this.totalOfCapital = 0;
    this.totalOfRwa = 0;
    for (let i = 0; i < this.rwaArr.length; i++) {
      this.totalOfRwa += (this.rwaArr[i].risk_weight * this.rwaArr[i].balance * this.rwaArr[i].credit_conversion_factor);
    }
    for (let i = 0; i < this.capitalArr.length; i++) {
      this.totalOfCapital += this.capitalArr[i].balance;
    }
    this.percentage = (this.totalOfCapital * 100) / this.totalOfRwa;
    this.setServiceVariable();
  }
  // set service variable after getting data
  setServiceVariable() {
    this.tbalService.capitalArr = this.capitalArr;
    this.tbalService.assetArr = this.assetArr;
    this.tbalService.percentage = this.percentage;
    this.tbalService.totalOfCapital = this.totalOfCapital;
    this.tbalService.totalOfRwa = this.totalOfRwa;
    this.tbalService.rwaArr = this.rwaArr;

  }

  // reset all variables
  resetAll() {
    this.percentage = 0;
    this.totalOfCapital = 0;
    this.totalOfRwa = 0;
    this.tbalService.trialData = this.reload;
    this.data = this.reload;
    this.assetArr = [];
    this.capitalArr = [];

    // reset show button
    // this.arrService.show_arr_btn = false;
    // this.jrnlService.show_jrnl_btn = false;
  }
  //  get defaults
  async getdefault() {
    this.spinner.show();
    const gaapwait = await this.reportService.getGaapCurrPpd(this.appService.ent_cd);
    if (gaapwait) {
      this.gaapArray = this.reportService.gaapArray;
      this.gaapArray.push('IFRS');
      this.base_currency = this.reportService.base_currency;
      this.gaapArray = this.reportService.gaapArray;
      this.ppdArray = this.reportService.ppdArray;
      this.bindDefaultData();
      this.spinner.hide();
      return true;
    }
  }

  // default selection set value first time
  bindDefaultData() {
    const anotherList: any[] = [
      this.gaapArray[0],
      'IFRS',
      // this.gaapArray[1]
    ];
    this.gaap_cd = anotherList;
    // console.log(this.gaap_cd);
    this.gaapctl.setValue(this.gaap_cd);
    this.curr_type_cd = this.currTypeArray[0];
    this.currtypectl.setValue(this.curr_type_cd);
    this.curr_cd = this.base_currency;
    this.Currency_symbol = this.reportService.setcurrSymbol(this.curr_cd);
    this.currcodectl.setValue(this.curr_cd);
    this.selectedPpd = this.ppdArray[this.ppdArray.length - 1];
    this.ppdctl.setValue(this.selectedPpd);
    this.acct_dt_ctl.setValue(this.acct_dt);
    // this.acct_dt_ctl.setValue(this.todayDate);
  }

  // selection set value after first time
  bindAafterBack() {
    this.gaapctl.setValue(this.params.gaap_cd);
    this.ppdctl.setValue(this.params.ppd);
    this.currtypectl.setValue(this.params.tgt_curr_type_cd);
    this.currcodectl.setValue(this.params.tgt_curr_cd);
    this.Currency_symbol = this.reportService.setcurrSymbol(this.params.tgt_curr_cd);
    this.acct_dt_ctl.setValue(this.params.acct_dt);
  }

  // set all instance variables
  setallInstanceVariables() {
    this.selectedPpd = this.params.ppd;
    this.curr_cd = this.params.tgt_curr_cd;
    this.curr_type_cd = this.params.tgt_curr_type_cd;
    this.gaap_cd = this.params.gaap_cd;
    this.acct_dt = this.params.acct_dt;
    return true;
  }
  // row clicked
  rowClicked(event) {
    this.arrService.arrData = this.reload;
    this.arrService.params = this.params;
    this.arrService.show_arr_btn = false;
    const obj = new Object();
    if (event.lr_sub_cat === undefined) {
      obj['lr_sub_cat'] = '';
      obj['lr_explosure_type'] = event.lr_exposure_type;
      obj['risk_weight'] = event.risk_weight;
      obj['credit_conversion_factor'] = event.credit_conversion_factor;
      this.arrService.riskObj = obj;
      this.router.navigate(['reports/rwa-al']);
    } else {
      obj['lr_sub_cat'] = event.lr_sub_cat;
      obj['lr_explosure_type'] = event.lr_exposure_type;
      obj['risk_weight'] = event.risk_weight;
      obj['credit_conversion_factor'] = event.credit_conversion_factor;
      this.arrService.riskObj = obj;
      this.router.navigate(['reports/rwa-al']);

    }
  }

  // selected value for filters
  selectGaap(event) {
    // console.log(event);
    this.gaap_cd = event.value;
  }

  selectcurrType(event) {
    // console.log(event);
    this.curr_type_cd = event.value;
  }
  selectcurrCode(event) {
    // console.log(event);
    this.curr_cd = event.value;
    this.Currency_symbol = this.reportService.setcurrSymbol(this.curr_cd);
  }
  selectproDate(event) {
    // console.log(event);
    this.selectedPpd = event.value;
  }

  selectacctDate(event) {
    // console.log(event);
    this.acct_dt = event.target.value;

  }

  gotoArr() {
    this.router.navigate(['/reports/rwa-al']);
  }

  gotoJrnl() {
    this.router.navigate(['/reports/rwa-jl']);
  }
}
