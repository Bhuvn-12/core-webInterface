import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportsService } from '../../../services/reports/reports.service';
import { AppService } from '../../../app.service';
import { TbalanceService } from '../../../services/reports/control/tbalance.service';
import { ArrlistingService } from '../../../services/reports/control/arrlisting.service';
import { JrnllistingService } from '../../../services/reports/control/jrnllisting.service';
import { FormControl } from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-arrangement-listing',
  templateUrl: './arrangement-listing.component.html',
  styleUrls: ['./arrangement-listing.component.css']
})
export class ArrangementListingComponent implements OnInit {

  // data table sources  array of MatDataTable
  fixedcolumn = 'arr_num,arr_suf ,arr_src_cd,active_dt,arr_org_cont_mat_dt,indctry_inst_rate_ex_date';
  displayedColumns: string[] = ['active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date'];
  columnsToDisplay: string[] = ['arr_num', 'arr_suf', 'arr_src_cd', 'active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date',
  'curr_symbol', 'balance'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _snackBar: MatSnackBar, private spinner: NgxSpinnerService, private router: Router,
     private tbalService: TbalanceService,
    private arrService: ArrlistingService, private jrnlService: JrnllistingService, private reportService: ReportsService,
    private appService: AppService, ) {


  }

  // set selected
  gaapctl = new FormControl();
  currtypectl = new FormControl();
  currcodectl = new FormControl();
  ppdctl = new FormControl();
  acct_dt_ctl = new FormControl();
  acct_num_ctl = new FormControl();

  column_ctl = new FormControl();

  // filter varialbes declaaration
  gaapArray;
  accountArray;
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

  // some global variables
  ent_cd;

  // data variables for arrangement listing
  data;
  tempdata = [];
  column_list = [];
  myMap = new Map();
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
    this.data = this.arrService.arrData;
    this.show_jrnl_btn = this.jrnlService.show_jrnl_btn;
    this.show_trial_btn = this.tbalService.show_trial_btn;
    this.show_arr_btn = true;
    this.arrService.show_arr_btn = true;
    this.ent_cd = this.appService.ent_cd;
    this.org_unit_cd = this.ent_cd;
    if (this.arrService.params === undefined) {
      this.acct_dt = this.reportService.getTodayDate();
      const resp = await this.reportService.getAccount(this.appService.ent_cd);
      if (resp) {
        this.acct_numlist = resp;
        this.getdefault(this.is_direct);
      }
    } else if (this.arrService.arrData === undefined) {
      this.accountObj = this.arrService.accountObj;
      this.params = this.arrService.params;
      this.is_direct = false;
      this.params['acct_num'] = this.accountObj.acct_num;
      this.arrService.params = this.params;
      const respacc = await this.reportService.getAccount(this.ent_cd);
      if (respacc) {
        this.acct_numlist = respacc;
        const respdef = await this.getdefault(this.is_direct);
        if (respdef) {
          this.setInstanceVariables();
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
      this.is_direct = false;
      this.params = this.arrService.params;
      this.accountObj = this.arrService.accountObj;
      const respacc = await this.reportService.getAccount(this.ent_cd);
      if (respacc) {
        this.acct_numlist = respacc;
        this.getdefault(this.is_direct);
        this.setInstanceVariables();
        this.displayedColumns = ['active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date'];
        this.columnsToDisplay = ['arr_num', 'arr_suf', 'arr_src_cd', 'active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date',
        'curr_symbol', 'balance'];
        this.setdatasource();
      }
    }


    // tslint:disable-next-line: no-shadowed-variable
/*     this.paginator.page.subscribe(MatPaginator => {
      const len = (MatPaginator.pageIndex + 1) * MatPaginator.pageSize;
      if (MatPaginator.length <= len) {
        this.next100row();
      }
    }); */
  }

  // set instance variables
  setInstanceVariables() {
    this.gaap_cd = this.params.gaap_cd;
    this.curr_cd = this.params.curr_cd;
    this.org_unit_cd = this.params.org_unit_cd;
    this.selectedPpd = this.params.ppd;
    this.acct_dt = this.params.acct_dt;
    this.curr_type_cd = this.params.tgt_curr_type_cd;
    this.curr_cd = this.params.tgt_curr_cd;
  }
  // refresh data
  async refreshData() {
    this.ping = true;
    this.arrService.arrData = this.reload;
    this.data = this.reload;
    this.datasource = this.reload;
    this.tempdata.length = 0;
    this.params = {};
    this.params['gaap_cd'] = this.gaap_cd;
    this.params['tgt_curr_cd'] = this.curr_cd;
    this.params['tgt_curr_type_cd'] = this.curr_type_cd;
    this.params['org_unit_cd'] = this.org_unit_cd;
    this.params['acct_num'] = this.accountObj.acct_num;
    this.params['ppd'] = this.selectedPpd;
    this.params['acct_dt'] = this.acct_dt;
    this.arrService.params = this.params;
    this.arrService.accountObj = this.accountObj;
    const waitres = await this.getdata(this.fixedcolumn);
    if (waitres) {
      this.arrService.arrData = this.data;
      this.setdatasource();
      this.spinner.hide();
    } else {
      this._snackBar.open('No Data Found', 'close', {
        duration: 2000});
        this.spinner.hide();
    }
  }

  // request for data
  async getdata(fixedcolumn) {
    this.spinner.show();
    const columns = fixedcolumn;
    this.total = 0;
    const resp = await this.arrService.getData(this.params, columns);
    if (resp) {
      this.refactorData(resp);
      this.spinner.hide();
      return true;
    } else {
      this.spinner.hide();
     return false;
    }

  }

  // refactor data after getting
  refactorData(resp) {
    this.data = resp;
    this.arrService.arrData = this.data;
    this.tempdata = Array.from(this.data);
    for (let i = 0; i < this.data.length; i++) {
      this.total = this.total + this.data[i].balance;
    }
    this.arrService.total = this.total;
    if (this.countget === 0) {
      this.initialdata = this.data;
      this.countget++;
    }
  }

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
    this.accountObj = this.acct_numlist[0];
    this.acct_num_ctl.setValue(this.accountObj);

  }

  // default selection set value first time
  bindAafterBack() {
    this.gaapctl.setValue(this.params.gaap_cd);
    this.currtypectl.setValue(this.params.tgt_curr_type_cd);
    this.currcodectl.setValue(this.params.tgt_curr_cd);
    this.Currency_symbol = this.reportService.setcurrSymbol(this.params.tgt_curr_cd);
    this.ppdctl.setValue(this.params.ppd);
    this.acct_dt_ctl.setValue(this.params.acct_dt);
    let index = 0;
    for (let i = 0; i < this.acct_numlist.length; i++) {
        if (this.acct_numlist[i].acct_num === this.accountObj.acct_num) {
          index = i;
          break;
        }
    }
    this.acct_num_ctl.setValue(this.acct_numlist[index]);
  }
  // selected value for filters
  selectGaap(event) {
    this.gaap_cd = event.value;

  }

  selectcurrType(event) {
    this.curr_type_cd = event.value;

  }
  selectcurrCode(event) {
    console.log(event);
    this.curr_cd = event.value;
    this.Currency_symbol = this.reportService.setcurrSymbol(this.curr_cd);
  }
  selectproDate(event) {
    console.log(event);
    this.selectedPpd = event.value;

  }

  selectacctDate(event) {
    console.log(event);
    this.acct_dt = event.target.value;

  }
  selectacctNum(event) {
    console.log(event);
    this.accountObj = event.value;
  }


  // mat filter options function
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  // next level data request
  rowClicked(event) {
    console.log(event);
    this.jrnlService.jrnlData = this.reload;
    this.jrnlService.params = this.params;
    this.jrnlService.params['arr_num'] =  event.arr_num;
    this.jrnlService.params['arr_suf'] = event.arr_suf;
    this.jrnlService.params['arr_src_cd'] = event.arr_src_cd;
    const Obj = new Object();
    Obj['arr_num'] = event.arr_num;
    Obj['arr_suf'] = event.arr_suf;
    Obj['arr_src_cd'] = event.arr_src_cd;
    this.jrnlService.arrObj = Obj;
    this.jrnlService.accountObj = this.accountObj;
    this.router.navigate(['reports/jrnl-list']);

  }

  async next100row() {
    const resp = await this.arrService.getnext100row();
    this.updateDataSource(resp);
  }

  // update data table source after geting 100 more rows
  updateDataSource(resp) {
    const data = resp;
    if (data.length === 0) {
      console.log('No more data');
      return 1;
    } else {
      this.ping = true;
      this.nextrows = data;
      let index = 0;
      const prvslen = this.data.length;
      for (let i = this.data.length; i < this.nextrows.length + prvslen; i++) {
        this.data[i] = this.nextrows[index];
        this.tempdata[i] = this.nextrows[index];
        this.total = this.total + this.nextrows[index].balance;
        index++;
      }
      this.setdatasource();
      return 1;
    }
  }

  // dataource of table
  setdatasource() {
    this.datasource = new MatTableDataSource(this.data);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  gotoTrial() {
    this.router.navigate(['/reports/trial-bal']);
  }

  gotoJrnl() {
    this.router.navigate(['/reports/jrnl-list']);
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

    // get columns request
    async getcolumns() {
      const resc = await this.reportService.getArrCols();
       if (resc) {
        this.columntemp = resc;
        let index = 0;
        for (let i = 0; i < this.columntemp.length; i++) {
          if (this.columntemp[i].col_short_name === 'arr_num' || this.columntemp[i].col_short_name === 'arr_suf'
          || this.columntemp[i].col_short_name === 'arr_src_cd' || this.columntemp[i].col_short_name === 'active_dt'
          || this.columntemp[i].col_short_name === 'arr_org_cont_mat_dt'
          || this.columntemp[i].col_short_name === 'indctry_inst_rate_ex_date'
          || this.columntemp[i].col_short_name === 'balance') {
          } else {
            this.column_list[index] = this.columntemp[i].col_short_name;
            index++;
          }
        }
        this.column_list.sort();
        // console.log(this.column_list);
        this.setColumn();
        this.arrService.column_list = this.column_list;
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
      for (let i = 0 ; i < this.selected_columns.length; i++) {
        for (let j = 0; j < this.displayedColumns.length; j++) {
            if ( this.displayedColumns[j] === this.selected_columns[i]) {
              check = check + 1;
              break;
            }
        }
      }
      if (check < this.selected_columns.length) {
        let str = this.fixedcolumn;
        for (let i = 0; i < this.selected_columns.length; i++) {
          str = str + ',' + this.selected_columns[i] ;
        }
        const  resp =  await this.getdata(str);
        if (resp) {
          this.displayedColumns =  ['active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date'];
          this.columnsToDisplay = [];
          this.columnsToDisplay =  ['arr_num', 'arr_suf', 'arr_src_cd', 'active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date'];
          for (let i = 0; i < this.selected_columns.length; i++) {
            this.columnsToDisplay.push(this.selected_columns[i]);
            this.displayedColumns.push(this.selected_columns[i]);
          }
          this.columnsToDisplay.push('curr_symbol');
          this.columnsToDisplay.push( 'balance');
          this.setdatasource();
          this.spinner.hide();
        }
      } else {
        let str = this.fixedcolumn;
        for (let i = 0; i < this.selected_columns.length; i++) {
          str = str + ',' + this.selected_columns[i] ;
        }
        this.displayedColumns =  ['active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date'];
        this.columnsToDisplay = [];
        this.columnsToDisplay =  ['arr_num', 'arr_suf', 'arr_src_cd', 'active_dt', 'arr_org_cont_mat_dt', 'indctry_inst_rate_ex_date'];
        for (let i = 0; i < this.selected_columns.length; i++) {
          this.columnsToDisplay.push(this.selected_columns[i]);
          this.displayedColumns.push(this.selected_columns[i]);
        }
        this.columnsToDisplay.push('curr_symbol');
        this.columnsToDisplay.push( 'balance');
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
