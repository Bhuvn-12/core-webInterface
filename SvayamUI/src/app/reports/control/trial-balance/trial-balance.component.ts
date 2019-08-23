import { Component, OnInit, ViewEncapsulation, Input, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { ReportsService } from '../../../services/reports/reports.service';
import { AppService } from '../../../app.service';
import { TbalanceService } from '../../../services/reports/control/tbalance.service';
import { ArrlistingService } from '../../../services/reports/control/arrlisting.service';
import { JrnllistingService } from '../../../services/reports/control/jrnllisting.service';
import { FormControl } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrialBalanceComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private spinner: NgxSpinnerService, private router: Router,
     private tbalService: TbalanceService, private arrService: ArrlistingService,
     private jrnlService: JrnllistingService, private reportService: ReportsService, private appService: AppService) {

  }


  // set selected
  gaapctl = new FormControl();
  currtypectl = new FormControl();
  currcodectl = new FormControl();
  ppdctl = new FormControl();
  acct_dt_ctl = new FormControl();
  // total variable for every level
  totalOfTrialbal = 0;
  totalOfIncomestmt = 0;
  totalOfAssets = 0;
  totalOfLiability = 0;
  totalOfEquity = 0;
  totalOfBalSheet = 0;
  totalOfIncome = 0;
  totalOfExpense = 0;

  // filter varialbes declaaration
  gaapArray = [];
  currTypeArray = ['FN', 'PR', 'TX'];
  currCodeArray = ['INR', 'USD', 'HKD', 'GBP', 'CAD'];
  ppdArray = [];
  Currency_symbol;

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
  params;

  // data variable
  data;
  assetArr = [];
  liabilityArr = [];
  equityArr = [];
  incomeArr = [];
  expenseArr = [];
  reload;

  // variable to check show button or not
  show_arr_btn = false;
  show_jrnl_btn = false;
  show_trial_btn = false;
  async ngOnInit() {
    this.show_arr_btn = this.arrService.show_arr_btn;
    this.show_jrnl_btn = this.jrnlService.show_jrnl_btn;
    this.tbalService.show_trial_btn = true;
    this.show_trial_btn = true;
    this.todayDate = this.reportService.getTodayDate();
    this.org_unit_cd = this.appService.ent_cd;
    this.acct_dt = this.todayDate;
    this.params = this.tbalService.params;
    if (this.params === undefined) {
      const setwait = await this.getdefault();
      if (setwait) {
        this.refreshData();
      }
    } else if (this.tbalService.trialData === undefined) {
      this.spinner.show();
          const setwait = await this.getdefault();
          if  (setwait) {
            this.setallInstanceVariables();
            this.bindAafterBack();
            const resp = await this.tbalService.getData(this.params);
            if (resp) {
              this.data = this.tbalService.trialData;
              this.refactorData(this.data);
              this.spinner.hide();
            } else {
              this.spinner.hide();
            }
          }
    } else {
      const setwait = await this.getdefault();
      if (setwait) {
          this.setallInstanceVariables();
          this.bindAafterBack();
          this.data = this.tbalService.trialData;
          this.refactorData(this.data);
      }
    }
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
    // refreshData and request forn new data
    async refreshData() {
      this.spinner.show();
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
      const resp = await this.tbalService.getData(this.params);
      if (resp) {
        this.refactorData(resp);
        this.spinner.hide();
      } else {
        this._snackBar.open('No Data Found', 'close', {
          duration: 2000});
        this.spinner.hide();
      }
    }

  refactorData(data) {
    this.data = data;
    this.tbalService.trialData = this.data;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].lvl3_desc === 'ASSET') {
        this.assetArr.push(this.data[i]);
        this.totalOfAssets += this.data[i].balance;
        this.totalOfBalSheet += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'LIABILITY') {
        this.liabilityArr.push(this.data[i]);
        this.totalOfLiability += this.data[i].balance;
        this.totalOfBalSheet += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'EQUITY') {
        this.equityArr.push(this.data[i]);
        this.totalOfEquity += this.data[i].balance;
        this.totalOfBalSheet += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'INCOME') {
        this.incomeArr.push(this.data[i]);
        this.totalOfIncome += this.data[i].balance;
        this.totalOfIncomestmt += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'EXPENSE') {
        this.expenseArr.push(this.data[i]);
        this.totalOfExpense += this.data[i].balance;
        this.totalOfIncomestmt += this.data[i].balance;
      }
      this.totalOfTrialbal += this.data[i].balance;

    }
    this.setServiceVariable();
  }

  // set service variable after getting data
  setServiceVariable() {
    this.tbalService.trialData = this.data;
    this.tbalService.totalOfTrialbal = this.totalOfTrialbal;
    this.tbalService.totalOfIncomestmt = this.totalOfIncomestmt;
    this.tbalService.totalOfAssets = this.totalOfAssets;
    this.tbalService.totalOfLiability = this.totalOfLiability;
    this.tbalService.totalOfEquity = this.totalOfEquity;
    this.tbalService.totalOfBalSheet = this.totalOfBalSheet;
    this.tbalService.totalOfIncome = this.totalOfIncome;
    this.tbalService.totalOfExpense = this.totalOfExpense;

  }



  rowClicked(event) {
    this.arrService.arrData = this.reload;
    this.arrService.params = this.params;
    this.arrService.show_arr_btn = false;
    const obj = new Object();
    obj['acct_num'] = event.lvl4_cd;
    obj['acct_desc'] = event.lvl4_desc;
    this.arrService.accountObj = obj;
    this.router.navigate(['/reports/arr-list']);
  }

  resetAll() {
    this.tbalService.trialData = this.reload;
    this.data = this.reload;
    this.totalOfTrialbal = 0;
    this.totalOfIncomestmt = 0;
    this.totalOfAssets = 0;
    this.totalOfLiability = 0;
    this.totalOfEquity = 0;
    this.totalOfBalSheet = 0;
    this.totalOfIncome = 0;
    this.totalOfExpense = 0;
    this.assetArr.length = 0;
    this.liabilityArr.length = 0;
    this.equityArr.length = 0;
    this.expenseArr.length = 0;
    this.incomeArr.length = 0;
    // reset show button
    this.arrService.show_arr_btn = false;
    this.jrnlService.show_jrnl_btn = false;
  }



  async getdefault() {
    this.spinner.show();
    const gaapwait = await this.reportService.getGaapCurrPpd(this.appService.ent_cd);
    if (gaapwait) {
      this.gaapArray = this.reportService.gaapArray;
      this.gaapArray.push('IFRS');
      this.base_currency = this.reportService.base_currency;
      this.ppdArray = this.reportService.ppdArray;
      const setwait = await this.bindDefaultData();
      if (setwait) {
        this.spinner.hide();
        return true;
      }
    }
  }

  // default selection set value first time
  bindDefaultData() {
    const anotherList: any[] = [
      this.gaapArray[0],
      'IFRS',
    ];
    this.gaap_cd = anotherList;
    this.gaapctl.setValue(this.gaap_cd);
    this.curr_type_cd = this.currTypeArray[0];
    this.currtypectl.setValue(this.curr_type_cd);
    this.curr_cd = this.base_currency;
    this.currcodectl.setValue(this.curr_cd);
    this.Currency_symbol = this.reportService.setcurrSymbol(this.curr_cd);
    this.selectedPpd = this.ppdArray[this.ppdArray.length - 1];
    this.ppdctl.setValue(this.selectedPpd);
    this.acct_dt_ctl.setValue(this.acct_dt);
    return true;
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

  // selected value for filters
  selectGaap(event) {
    console.log(event);
    this.gaap_cd = event.value;
    this.tbalService.gaap_cd = this.gaap_cd;

  }

  selectcurrType(event) {
    this.curr_type_cd = event.value;
    this.tbalService.curr_type_cd = this.curr_type_cd;
  }
  selectcurrCode(event) {
    console.log(event);
    this.curr_cd = event.value;
    this.Currency_symbol = this.reportService.setcurrSymbol(this.curr_cd);
    this.tbalService.curr_cd = this.curr_cd;
  }
  selectproDate(event) {
    console.log(event);
    this.selectedPpd = event.value;
    this.tbalService.selectedPpd = this.selectedPpd;
  }

  selectacctDate(event) {
    console.log(event);
    this.acct_dt = event.target.value;
    this.tbalService.acct_dt = this.acct_dt;

  }

  gotoArr() {
    this.router.navigate(['/reports/arr-list']);
  }

  gotoJrnl() {
    this.router.navigate(['/reports/jrnl-list']);
  }



}
