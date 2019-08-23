import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportsService } from '../../../services/reports/reports.service';
import { AppService } from '../../../app.service';
import { RwaTbalanceService } from '../../../services/reports/complience/rwa-tbalance.service';
import { RwaArrlistingService } from '../../../services/reports/complience/rwa-arrlisting.service';
import { RwaJrnllistingService } from '../../../services/reports/complience/rwa-jrnllisting.service';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rwa-jl',
  templateUrl: './rwa-jl.component.html',
  styleUrls: ['./rwa-jl.component.css']
})
export class RwaJlComponent implements OnInit {
  // mat table datasource and display columns
  fixedcolumn = 'jrnl_ln_desc,ldgr_type_cd,alt_org_unit_cd,bus_func_cd,txn_amt_type_cd,db_cr_ind,acct_dt';
  displayedColumns: string[] = ['db_cr_ind', 'acct_dt'];
  columnsToDisplay: string[] = ['jrnl_ln_desc', 'ldgr_type_cd', 'alt_org_unit_cd', 'bus_func_cd', 'txn_amt_type_cd',
    'db_cr_ind', 'acct_dt', 'curr_symbol', 'txn_amt'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private spinner: NgxSpinnerService, private router: Router, private tbalService: RwaTbalanceService,
    private arrService: RwaArrlistingService, private jrnlService: RwaJrnllistingService, private reportService: ReportsService,
    private appService: AppService, private route: ActivatedRoute) {

  }

  // set selected
  gaapctl = new FormControl();
  currtypectl = new FormControl();
  currcodectl = new FormControl();
  ppdctl = new FormControl();
  acct_dt_ctl = new FormControl();
  acct_num_ctl = new FormControl();
  arr_num_ctl = new FormControl();
  arr_suf_ctl = new FormControl();
  arr_src_ctl = new FormControl();

  column_ctl = new FormControl();
  // filter varialbes declaaration
  gaapArray;
  accountArray;
  riskObj;
  currTypeArray = ['FN', 'PR', 'TX'];
  currCodeArray = ['INR', 'USD', 'HKD', 'GBP', 'CAD'];
  ppdArray = [];
  is_direct = true;

  // set or selected filtetr variables
  gaap_cd;
  curr_type_cd;
  curr_cd;
  selectedPpd;
  base_currency;
  org_unit_cd;
  acct_dt;
  todayDate;
  acct_numlist;
  params;
  accountObj;
  arrObj;
  arr_num;
  arr_suf;
  arr_src_cd;
  // some global variables
  ent_cd;

  // data variables for arrangement listing
  dataSource;
  data;
  tempdata = [];
  column_list = [];
  temptotal = 0;
  datasource;
  initialdata;
  nextrows;
  countget = 0;
  ping = true;
  reload;
  total = 0;

  // variable to check show button or not
  show_trial_btn = false;
  show_arr_btn = false;
  show_jrnl_btn = false;
  callnginit = 0;
  Currency_symbol;

  // columnlist
  columntemp;
  selected_columns = [];
  async ngOnInit() {
    this.getcolumns();
    this.data = this.jrnlService.jrnlData;
    this.show_arr_btn = this.arrService.show_arr_btn;
    this.show_trial_btn = this.tbalService.show_trial_btn;
    this.jrnlService.show_jrnl_btn = true;
    this.show_jrnl_btn = true;
    this.params = this.jrnlService.params;
    this.ent_cd = this.appService.ent_cd;
    this.org_unit_cd = this.ent_cd;
    if (this.jrnlService.params === undefined) {
      this.acct_dt = this.reportService.getTodayDate();
      const resp = await this.reportService.getAccount(this.org_unit_cd);
      if (resp) {
        this.acct_numlist = resp;
        await this.getdefault(this.is_direct);
      }
    } else if (this.data === undefined) {
      const is_data = false;
      this.accountObj = this.jrnlService.accountObj;
      this.riskObj = this.jrnlService.riskObj;
      this.arrObj = this.jrnlService.arrObj;
      this.params = this.jrnlService.params;
      const setresp = await this.setallInstanceVariables(is_data);
      if (setresp) {
        this.is_direct = false;
        this.arrService.params = this.params;
        const respacc = await this.reportService.getAccount(this.ent_cd);
        if (respacc) {
          this.acct_numlist = respacc;
          await this.getdefault(this.is_direct);
          const resp = await this.getdata(this.fixedcolumn);
          if (resp) {
            this.setdatasource();
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        }
      }
    } else {
      const is_data = true;
      this.is_direct = false;
      this.accountObj = this.jrnlService.accountObj;
      this.riskObj = this.jrnlService.riskObj;
      this.arrObj = this.jrnlService.arrObj;
      this.params = this.jrnlService.params;
      const respacc = await this.reportService.getAccount(this.ent_cd);
      if (respacc) {
        this.acct_numlist = respacc;
        this.getdefault(this.is_direct);
        const setresp = await this.setallInstanceVariables(is_data);
        if (setresp) {
          this.params = this.arrService.params;
          this.displayedColumns = ['db_cr_ind', 'acct_dt'];
          this.columnsToDisplay = ['jrnl_ln_desc', 'ldgr_type_cd', 'alt_org_unit_cd', 'bus_func_cd', 'txn_amt_type_cd',
  'db_cr_ind', 'acct_dt', 'curr_symbol', 'txn_amt'];
          this.setdatasource();
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }
    }
    // tslint:disable-next-line: no-shadowed-variable
    /*   this.paginator.page.subscribe(MatPaginator => {
        const len = (MatPaginator.pageIndex + 1) * MatPaginator.pageSize;
        if (MatPaginator.length <= len) {
          this.next100row();
        }
      }); */
  }

  // set all instance variables
  setallInstanceVariables(is_data) {
    this.arr_num = this.params.arr_num;
    this.arr_suf = this.params.arr_suf;
    this.arr_src_cd = this.params.arr_src_cd;
    this.selectedPpd = this.params.ppd;
    this.curr_cd = this.params.tgt_curr_cd;
    this.curr_type_cd = this.params.tgt_curr_type_cd;
    this.gaap_cd = this.params.gaap_cd;
    this.acct_dt = this.params.acct_dt;

    return true;
  }
  // refresh data
  async refreshData() {
    this.ping = true;
    this.jrnlService.jrnlData = this.reload;
    this.data = this.reload;
    this.datasource = this.reload;
    this.tempdata.length = 0;

    this.arr_num = this.arr_num_ctl.value;
    this.arr_suf = this.arr_suf_ctl.value;
    this.arr_src_cd = this.arr_src_ctl.value;
    this.params = {};
    if (this.riskObj === undefined) {
      this.params['lr_sub_cat'] = '';
      this.params['lr_explosure_type'] = '';
      this.params['risk_weight'] = '';
      this.params['credit_conversion_factor'] = '';
    } else {
      this.params['lr_sub_cat'] = this.riskObj.lr_sub_cat;
      this.params['lr_explosure_type'] = this.riskObj.lr_explosure_type;
      this.params['risk_weight'] = this.riskObj['risk_weight'];
      this.params['credit_conversion_factor'] = this.riskObj['credit_conversion_factor'];
    }
    this.params['gaap_cd'] = this.gaap_cd;
    this.params['tgt_curr_cd'] = this.curr_cd;
    this.params['tgt_curr_type_cd'] = this.curr_type_cd;
    this.params['org_unit_cd'] = this.org_unit_cd;
    this.params['acct_num'] = this.accountObj.acct_num;
    this.params['ppd'] = this.selectedPpd;
    this.params['acct_dt'] = this.acct_dt;
    this.params['arr_num'] = this.arr_num;
    this.params['arr_suf'] = this.arr_suf;
    this.params['arr_src_cd'] = this.arr_src_cd;
    this.jrnlService.params = this.params;
    // console.log(this.params);
    this.jrnlService.accountObj = this.accountObj;
    const waitres = await this.getdata(this.fixedcolumn);
    if (waitres) {
      this.jrnlService.jrnlData = this.data;
      this.setdatasource();
      this.spinner.hide();
    } else {
      this.spinner.hide();
    }
  }

  // request for data
  async getdata(fixedcolumn) {
    this.spinner.show();
    const columns = fixedcolumn;
    this.total = 0;
    const resp = await this.jrnlService.getData(this.params, columns);
    if (resp) {
      this.refactorData(resp);
      return true;
    } else {
      return false;
    }
  }


  // refactor data after getting
  refactorData(resp) {
    this.data = resp;
    this.tempdata = Array.from(this.data);
    for (let i = 0; i < this.data.length; i++) {
      this.total = this.total + this.data[i].txn_amt;
    }
    this.arrService.total = this.total;
    if (this.countget === 0) {
      this.initialdata = this.data;
      this.countget++;
    }
  }

  // get default valaue from database
  async getdefault(is_direct) {
    this.spinner.show();
    this.org_unit_cd = this.appService.ent_cd;
    const gaapwait = await this.reportService.getGaapCurrPpd(this.org_unit_cd);
    if (gaapwait) {
      this.gaapArray = this.reportService.gaapArray;
      this.gaapArray.push('IFRS');
      this.base_currency = this.reportService.base_currency;
      this.gaapArray = this.reportService.gaapArray;
      this.ppdArray = this.reportService.ppdArray;
      if (is_direct) {
        this.bindDefaultData();
        this.spinner.hide();
        return true;
      } else {
        this.bindAafterBack();
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
      // this.gaapArray[1]
    ];
    this.gaap_cd = anotherList;
    this.gaapctl.setValue(this.gaap_cd);
    this.curr_type_cd = this.currTypeArray[0];
    this.currtypectl.setValue(this.curr_type_cd);
    this.curr_cd = this.base_currency;
    this.Currency_symbol = this.reportService.setcurrSymbol(this.curr_cd);
    this.currcodectl.setValue(this.curr_cd);
    this.selectedPpd = this.ppdArray[this.ppdArray.length - 1];
    this.ppdctl.setValue(this.selectedPpd);
    this.acct_dt_ctl.setValue(this.acct_dt);
    this.acct_num_ctl.setValue(this.acct_numlist[0]);
    this.accountObj = this.acct_numlist[0];
  }

  // default selection set value first time
  bindAafterBack() {
    // console.log(this.arrObj);
    this.gaapctl.setValue(this.params.gaap_cd);
    this.currtypectl.setValue(this.params.tgt_curr_type_cd);
    this.currcodectl.setValue(this.params.tgt_curr_cd);
    this.Currency_symbol = this.reportService.setcurrSymbol(this.params.tgt_curr_cd);
    this.ppdctl.setValue(this.params.ppd);
    this.acct_dt_ctl.setValue(this.params.acct_dt);
    let index = 0;
    if (this.accountObj !== undefined) {
      for (let i = 0; i < this.acct_numlist.length; i++) {
        if (this.acct_numlist[i].acct_num === this.accountObj.acct_num) {
          index = i;
          break;
        }
      }
      this.acct_num_ctl.setValue(this.acct_numlist[index]);
    }
    this.arr_num_ctl.setValue(this.params.arr_num);
    this.arr_suf_ctl.setValue(this.params.arr_suf);
    this.arr_src_ctl.setValue(this.params.arr_src_cd);
  }

  // selected value for filters
  selectGaap(event) {
    this.gaap_cd = event.value;
  }

  // select currency type
  selectcurrType(event) {
    this.curr_type_cd = event.value;
  }

  // select currency code
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
  selectacctNum(event) {
    // console.log(event);
    this.accountObj = event.value;
  }



  async next100row() {
    const resp = await this.arrService.getnext100row();
    this.updateDataSource(resp);
  }

  // update data table source after geting 100 more rows
  updateDataSource(resp) {
    const data = resp;
    if (data.length === 0) {
      // console.log('No more data');
      return 1;
    } else {
      this.ping = true;
      this.nextrows = data;
      let index = 0;
      const prvslen = this.data.length;
      for (let i = this.data.length; i < this.nextrows.length + prvslen; i++) {
        this.data[i] = this.nextrows[index];
        this.tempdata[i] = this.nextrows[index];
        this.total = this.total + this.nextrows[index].txn_amt;
        index++;
      }
      this.setdatasource();
      return 1;
    }
  }
  // dataource of table
  setdatasource() {
    // console.log(this.data);
    this.datasource = new MatTableDataSource(this.data);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  // go to back on arrangement
  gotoArr() {
    this.router.navigate(['/reports/rwa-al']);
  }
  // go to back on trial
  gotoTrial() {
    this.router.navigate(['/reports/rwa-tb']);
  }

  onPageChange(event) {
    let totalpage = event.length / event.pageSize;
    totalpage = Math.ceil(totalpage);
    const mypos = event.pageIndex + 1;
    if (mypos === totalpage) {
      if (this.ping) {
        this.next100row();
      } else {
      }
    }
  }
  // mat filter options function
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  // get columns request
  async getcolumns() {
    const resc = await this.reportService.getSjeCols();
    if (resc) {
      this.columntemp = resc;
      let index = 0;
      for (let i = 0; i < this.columntemp.length; i++) {
        if (this.columntemp[i].col_short_name === 'jrnl_ln_desc' || this.columntemp[i].col_short_name === 'ldgr_type_cd'
          || this.columntemp[i].col_short_name === 'alt_org_unit_cd' || this.columntemp[i].col_short_name === 'txn_amt'
          || this.columntemp[i].col_short_name === 'acct_dt' || this.columntemp[i].col_short_name === 'txn_amt_type_cd'
          || this.columntemp[i].col_short_name === 'bus_func_cd' || this.columntemp[i].col_short_name === 'db_cr_ind') {
        } else {
          this.column_list[index] = this.columntemp[i].col_short_name;
          index++;
        }
      }
      this.column_list.sort();
      // console.log(this.column_list);
      this.setColumn();
      this.jrnlService.column_list = this.column_list;
      return 1;
    } else {
      return 0;
    }
  }



  // selection change of column list
  selectColumns(event) {
    this.selected_columns = [];
    this.selected_columns = event.value;
  }

  async checkAndCall() {
    let check = 0;
    for (let i = 0; i < this.selected_columns.length; i++) {
      for (let j = 0; j < this.displayedColumns.length; j++) {
        if (this.displayedColumns[j] === this.selected_columns[i]) {
          check = check + 1;
          break;
        }
      }
    }
    if (check < this.selected_columns.length) {
      let str = this.fixedcolumn;
      for (let i = 0; i < this.selected_columns.length; i++) {
        str = str + ',' + this.selected_columns[i];
      }
      const resp = await this.getdata(str);
      if (resp) {
        this.displayedColumns = ['db_cr_ind', 'acct_dt'];
        this.columnsToDisplay = [];
        this.columnsToDisplay = ['jrnl_ln_desc', 'ldgr_type_cd', 'alt_org_unit_cd', 'bus_func_cd', 'txn_amt_type_cd',
          'db_cr_ind', 'acct_dt'];
        for (let i = 0; i < this.selected_columns.length; i++) {
          this.columnsToDisplay.push(this.selected_columns[i]);
          this.displayedColumns.push(this.selected_columns[i]);
        }
        this.columnsToDisplay.push('curr_symbol');
        this.columnsToDisplay.push('txn_amt');
        this.setdatasource();
        this.spinner.hide();
      }
    } else {
      let str = this.fixedcolumn;
      for (let i = 0; i < this.selected_columns.length; i++) {
        str = str + ',' + this.selected_columns[i];
      }
      this.displayedColumns = ['db_cr_ind', 'acct_dt'];
      this.columnsToDisplay = [];
      this.columnsToDisplay = ['jrnl_ln_desc', 'ldgr_type_cd', 'alt_org_unit_cd', 'bus_func_cd', 'txn_amt_type_cd',
        'db_cr_ind', 'acct_dt'];
      for (let i = 0; i < this.selected_columns.length; i++) {
        this.columnsToDisplay.push(this.selected_columns[i]);
        this.displayedColumns.push(this.selected_columns[i]);
      }
      this.columnsToDisplay.push('curr_symbol');
      this.columnsToDisplay.push('txn_amt');
    }
  }

  setColumn() {
    const anotherList: any[] = [
      this.displayedColumns[0],
      this.displayedColumns[1],
    ];
    this.column_ctl.setValue(anotherList);
  }
}
