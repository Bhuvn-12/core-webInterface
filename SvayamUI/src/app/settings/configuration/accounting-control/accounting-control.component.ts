import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
/* import { MomentDateAdapter } from '@angular/material-moment-adapter'; */
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AppService } from 'src/app/app.service';
import { AccountingcontrolService } from 'src/app/services/settings/configuration/accounting_control/accountingcontrol.service';
import * as moment from 'moment';
@Component({
  selector: 'app-accounting-control',
  templateUrl: './accounting-control.component.html',
  styleUrls: ['./accounting-control.component.css'],
})
export class AccountingControlComponent implements OnInit {

  minDate = new Date(2018, 0, 1);
  maxDate = new Date(2030, 0, 1);
  date1 = new FormControl();
  date2 = new FormControl();
  constructor(private appService: AppService, private accountcontrolService: AccountingcontrolService) {
    this.httpUrl = this.accountcontrolService.httpUrl;
  }
  st_year;
  st_mon;
  end_year;
  end_mon;
  editable = true;
  accountGroup: FormGroup;
  accountdtl;
  httpUrl;
  fiscal_year;
  fiscal_month;
  fiscal_period;
  isSave;
  ent_cd;
  ppd;
  timeDiff: any;
  async ngOnInit() {
    this.accountGroup = new FormGroup({
      fiscalyear: new FormControl(),
      fiscalmonth: new FormControl(),
      fiscalperiod: new FormControl(),

    });
    this.getDetails();

  }

  async getDetails(){
    this.accountdtl = await this.accountcontrolService.getaccountControl(this.appService.ent_cd);
    if (this.accountdtl) {
      this.accountdtl = this.accountdtl[0];
      this.st_year = this.accountdtl['fp_start_year'];
      this.st_mon  = this.accountdtl['fp_start_month'];
      this.end_year = this.accountdtl['fp_end_year'];
      this.end_mon = this.accountdtl['fp_end_month'];
      this.ppd = this.accountdtl['ppd'];
      var startdate =  new Date( this.st_year ,  this.st_mon-1 ,1);
      var enddate =  new Date( this.end_year ,  this.end_mon ,0);
      this.date1.setValue(startdate);
      this.date2.setValue(enddate);
      this.calculateperiod(startdate);

    }
  }
  calculateperiod(startDate) {
    var ppdDate = new Date(this.ppd);
    this.fiscal_year = ppdDate.getFullYear();
    this.fiscal_month = ("0" + (ppdDate.getMonth()+1)).slice(-2);
    var timeDiff = Math.abs(ppdDate.getTime()  - startDate.getTime())
    var daysDiff = Math.floor(( timeDiff) / (1000 * 60 * 60 * 24));
    this.fiscal_period = daysDiff;
  }
  async edit() {
    // this.editable = false;
  }
  async save() {
/*     console.log(this.accountGroup);
    this.fiscal_year = this.accountGroup.get('fiscalyear').value;
    this.fiscal_month = this.accountGroup.get('fiscalmonth').value;
    this.fiscal_period = this.accountGroup.get('fiscalperoid').value;

    const obj = new Object();
    obj['fiscalyear'] = this.fiscal_year;
    obj['fiscalmonth'] = this.fiscal_month;
    obj['fiscalperiod'] = this.fiscal_period;

    console.log(obj);
    this.isSave = await this.accountcontrolService.edit_account_ctrl(obj); */
  }

  async datesave() {
    this.dateFormate();
    const obj = new Object();
    obj['st_year'] = this.st_year ;
    obj['st_mon'] = this.st_mon;  
    obj['end_year'] = this.end_year;
    obj['end_mon'] = this.end_mon;
    obj['ent_cd'] = this.appService.ent_cd;
    console.log(obj);
    const resp  = await this.accountcontrolService.date_save(obj);
    if(resp) {
      this.getDetails();
    }
  }
 dateFormate() {
    var start_date = new Date(this.date1.value);
    this.st_mon = start_date.getMonth()+1 // ("0" + (start_date.getMonth()+1)).slice(-2);
    this.st_year  = start_date.getFullYear();
    var end_date = new Date(this.date2.value);
    this.end_mon = end_date.getMonth()+1; //("0" + (end_date.getMonth()+1)).slice(-2);
    this.end_year  = end_date.getFullYear();
 }
}





