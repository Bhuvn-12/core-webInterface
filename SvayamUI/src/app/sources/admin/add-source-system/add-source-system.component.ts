import { Component, OnInit, ViewChild } from '@angular/core';
import { AddSourceService } from '../../../services/sources/admin/addsource/add-source.service';
import {AdminService} from '../../../services/sources/admin/admin.service';
import {AppService} from '../../../app.service';
import { MatTableDataSource, MatPaginator, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare var $: any;
@Component({
  selector: 'app-add-source-system',
  templateUrl: './add-source-system.component.html',
  styleUrls: ['./add-source-system.component.css']
})
export class AddSourceSystemComponent implements OnInit {

  @ViewChild('ss_exist_paginator') ss_exist_paginator: MatPaginator;
  @ViewChild('ss_new_paginator') ss_new_paginator: MatPaginator;
  @ViewChild('prod_exist_paginator') prod_exist_paginator: MatPaginator;
  @ViewChild('prod_new_paginator') prod_new_paginator: MatPaginator;
  @ViewChild('event_exist_paginator') event_exist_paginator: MatPaginator;
  @ViewChild('event_new_paginator') event_new_paginator: MatPaginator;
  @ViewChild('account_exist_paginator') account_exist_paginator: MatPaginator;
  @ViewChild('account_new_paginator') account_new_paginator: MatPaginator;
  @ViewChild('customer_exist_paginator') customer_exist_paginator: MatPaginator;
  @ViewChild('customer_new_paginator') customer_new_paginator: MatPaginator;
  sourceForm: FormGroup;
  prodForm: FormGroup;
  eveForm: FormGroup;
  acForm: FormGroup;
  CustForm: FormGroup;
  eventCtl = new FormControl();
  selected = 'option2';
  constructor(private addSoucreService: AddSourceService, private fb: FormBuilder, private router: Router,
    private adminService: AdminService, private appService: AppService, private spinner: NgxSpinnerService,
     private _snackBar: MatSnackBar) {
    this.sourceForm = this.fb.group({
      ss_name: ['', Validators.required],
      is_automatic: [''],
      kafka_ip: [''],
      kafka_port: [''],
      topic: ['']
    });
    this.prodForm = this.fb.group({
      prod_desc: ['', Validators.required],
      prod_cd: ['', Validators.required],
      dtl_prod_desc: ['', Validators.required],
      dtl_prod_cd: ['', Validators.required],
      off_balance_sheet_exposure_type: [''],
      credit_conversion_factor: ['', Validators.required],
      src_sys: ['']
    });
    this.eveForm = this.fb.group({
      ev_name: ['', Validators.required],
      screen_to_project: ['', Validators.required],
      prd_sys: ['']

    });
    this.acForm = this.fb.group({
      account_number: ['', Validators.required],
      acct_desc: ['', Validators.required],
      acct_type: ['', Validators.required],
      acct_type_cd: ['', Validators.required],
      account_grp_cd: ['', Validators.required],
      rwa_off_ind: [''],
      bsht_ind: [''],
      trl_bal_ind: [''],
      incm_stmt_ind: [''],
      perfm_account_ind: [''],
      carry_fwd_ind: [''],
      lr_exposure_type: [''],
      lr_sub_cat: [''],
    });
    this.CustForm = this.fb.group({
      customer_type_cd: ['', Validators.required],
      customer_type_desc: ['', Validators.required],
      dtl_customer_type_cd: ['', Validators.required],
      dtl_customer_type_desc: ['', Validators.required],
      cust_segment: ['', Validators.required],
      lr_exposure_type: ['', Validators.required],
      risk_weight: ['', Validators.required],
    });


  }
  displayedColumns: string[] = ['select', 'ss_name'];
  SdisplayedColumns: string[] = ['action', 'ss_name'];
  pdisplayedColumns: string[] = ['select', 'dtl_prod_desc'];
  spdisplayedColumns: string[] = ['action', 'dtl_prod_desc', 'ss_name'];
  edisplayedColumns: string[] = ['select', 'ev_name'];
  esdisplayedColumns: string[] = ['action', 'ev_name', 'dtl_prod_desc'];
  cdisplayedColumns: string[] = ['select', 'dtl_customer_type_desc'];
  csdisplayedColumns: string[] = ['action', 'dtl_customer_type_desc'];
  acdisplayedColumns: string[] = ['select', 'acct_desc'];
  acseldisplayedColumns: string[] = ['action', 'acct_desc', 'ev_name'];
  srcSource;
  srcSource1;
  prodsource;
  prodsource1;
  evesource;
  evesource1;
  csource;
  csource1;
  acsource;
  acsource1;
  srcArray = [];
  prodArray = [];
  eveArray = [];
  custArray = [];
  acArray = [];
  title = 'FPEM';
  sprojectArray = [{ screen: 'ip', view: 'Arrangement' }, { screen: 'arr', view: 'Sje' }];
  s_ev_acc = [];
  dataobj;
  prodObj;
  eveObj;
  custObj;
  id;
  acObj;
  ent_cd;
  acct_type;
  // action values variable
  action;
  index;
  data;


  async ngOnInit() {
    this.ent_cd = this.appService.ent_cd;
    if ( this.ent_cd === undefined) {
      this.router.navigate(['/source/admin']);
    } else {
      this.opensrcModal();
    }
  }

  // *********************************************************************************************** */
  //                    Source system Modal and all actions
  // *********************************************************************************************** */
  async opensrcModal() {
    this.srcSource = '';
    this.srcSource1 = '';
    this.srcArray = [];
    this.prodArray = [];
    this.eveArray = [];
    this.custArray = [];
    this.acArray = [];
    const data = await this.addSoucreService.getSrc('1');
    if (data) {
      this.dataobj = data;
      // console.log(this.dataobj);
      this.srcSource = new MatTableDataSource(this.dataobj);
      this.srcSource.paginator = this.ss_exist_paginator;
      $('#A').modal('show');
    }
  }
  openSModel(index, data, action) {
    this.data = undefined;
    this.index = index;
    this.action = action;

    if (this.action === 'add') {
      // this.sourceForm.reset()
      $('#createsrc').modal('show');
    } else {
      this.data = data;
      let is_auto = false;
      if (data.is_automatic === 'Y') {
        is_auto = true;
      } else {
        is_auto = false;
      }
      $('#createsrc').modal('show');
      this.sourceForm.setValue({
        ss_name: data.ss_name,
        is_automatic: is_auto,
        kafka_ip: data.kafka_ip,
        kafka_port: data.kafka_port,
        topic: data.topic,
      });
    }

  }

  // edit and add srcfunction
  add_edit_src() {
    if (this.sourceForm.invalid) {
      return;
    } else {
      const obj = new Object();
      let isauto;
      if (this.sourceForm.get('is_automatic').value === true) {
        isauto = 'Y';
      } else {
        isauto = 'N';
      }
      obj['ss_name'] = this.sourceForm.get('ss_name').value;
      obj['is_automatic'] = isauto;
      obj['kafka_ip'] = this.sourceForm.get('kafka_ip').value;
      obj['kafka_port'] = this.sourceForm.get('kafka_port').value;
      obj['topic'] = this.sourceForm.get('topic').value;
      if (this.action === 'add') {
        obj['ss_id'] = '';
        obj['ind_id'] = this.adminService.ind_id;
        this.srcArray.push(obj);
      } else {
        obj['ss_id'] = this.data.ss_id;
        this.srcArray.splice(this.index, 1, obj);
      }
      $('#createsrc').modal('hide');
      this.refershDataSource();
    }
  }

  async checked(row, index) {
    // console.log('calling', row);
    this.srcArray.push(row);
    this.index = index;
    // console.log(this.ss_exist_paginator);
    if (this.ss_exist_paginator.pageIndex !== 0) {
      const pageIndex = this.ss_exist_paginator.pageIndex;
      const pageSize = this.ss_exist_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
      // console.log(this.index);
    }
    this.dataobj.splice(index, 1);
    this.refershDataSource();
  }

  refershDataSource() {
    this.srcSource1 = new MatTableDataSource(this.srcArray);
    this.srcSource = new MatTableDataSource(this.dataobj);
    this.srcSource1.paginator = this.ss_new_paginator;
    this.srcSource.paginator = this.ss_exist_paginator;
  }
  deleteItem(row, index) {
    // console.log('Working', row);
    this.srcArray.splice(index, 1);
    this.refershDataSource();

  }

  // ***********************************************************************************************
  //              Product Modal and all actions
  // *********************************************************************************************** */

  async openprodModal() {
    $('#A').modal('hide');
    for (let i = 0; i < this.srcArray.length; i++) {
      this.srcArray[i]['source_id'] = 'S' + i;
    }
    // console.log(this.srcArray);
    const resp = await this.addSoucreService.getproducts(this.srcArray);
    this.prodObj = resp;
    for (let i = 0; i < this.prodObj.length; i++) {
      for (let j = 0; j < this.srcArray.length; j++) {
        if (this.srcArray[j].ss_id === this.prodObj[i].ss_id) {
          this.prodObj[i]['ss_name'] = this.srcArray[j].ss_name;
          this.prodObj[i]['source_id'] = this.srcArray[j].source_id;
          break;
        }
      }
    }
    this.prodsource = new MatTableDataSource(this.prodObj);
    this.prodsource.paginator = this.prod_exist_paginator;
    $('#B').modal('show');
  }

  // product checked request
  async checkedp(row, index) {
    this.prodArray.push(row);
    this.index = index;
    if (this.prod_exist_paginator.pageIndex !== 0) {
      const pageIndex = this.prod_exist_paginator.pageIndex;
      const pageSize = this.prod_exist_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.prodObj.splice(this.index, 1);
    this.refershDataSourcep();
  }

  deleteItemp(row, index) {
    // console.log('Working', row);
    this.index = index;
    if (this.prod_new_paginator.pageIndex !== 0) {
      const pageIndex = this.prod_new_paginator.pageIndex;
      const pageSize = this.prod_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.prodArray.splice(this.index, 1);
    this.refershDataSourcep();

  }

  //  New Product Creation
  openPModel(index, data, action) {
    this.data = undefined;
    this.index = index;
    this.action = action;
    if (this.prod_new_paginator.pageIndex !== 0) {
      const pageIndex = this.prod_new_paginator.pageIndex;
      const pageSize = this.prod_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    if (action === 'add') {
      this.prodForm.reset();
      $('#Createprdct').modal('show');
    } else {
      $('#Createprdct').modal('show');
      let setsrc;
      this.data = data;
      for (let i = 0 ; i < this.srcArray.length; i++) {
        if (this.srcArray[i].source_id === data.source_id) {
          setsrc = this.srcArray[i];
          break;
        }
      }
      this.prodForm.setValue({
        prod_desc: data.prod_desc,
        prod_cd: data.prod_cd,
        dtl_prod_desc: data.dtl_prod_desc,
        dtl_prod_cd: data.dtl_prod_cd,
        off_balance_sheet_exposure_type: data.off_balance_sheet_exposure_type,
        credit_conversion_factor: data.credit_conversion_factor,
        src_sys: setsrc
      });
    }

  }

  // add edit save button function
  add_edit_prod() {
    if (this.prodForm.invalid) {
      return;
    } else {
      const obj = new Object();
      obj['prod_desc'] = this.prodForm.get('prod_desc').value;
      obj['prod_cd'] = this.prodForm.get('prod_cd').value;
      obj['dtl_prod_desc'] = this.prodForm.get('dtl_prod_desc').value;
      obj['dtl_prod_cd'] = this.prodForm.get('dtl_prod_cd').value;
      obj['off_balance_sheet_exposure_type'] = this.prodForm.get('off_balance_sheet_exposure_type').value;
      obj['credit_conversion_factor'] = this.prodForm.get('credit_conversion_factor').value;
      obj['ss_name'] = this.prodForm.get('src_sys').value['ss_name'];
      obj['source_id'] = this.prodForm.get('src_sys').value['source_id'];
      if (this.action === 'add') {
        obj['prod_id'] = '';
        this.prodArray.push(obj);
      } else {
        obj['prod_id'] = this.data.prod_id;
        this.prodArray.splice(this.index, 1, obj);
      }
      this.refershDataSourcep();
      $('#Createprdct').modal('hide');
    }
  }

  refershDataSourcep() {
    this.prodsource1 = new MatTableDataSource(this.prodArray);
    this.prodsource = new MatTableDataSource(this.prodObj);
    this.prodsource1.paginator = this.prod_new_paginator;
    this.prodsource.paginator = this.prod_exist_paginator;

  }


  // ***********************************************************************************************
  //              Event Modal and all actions
  // *********************************************************************************************** */
  async openEventModal() {
    $('#B').modal('hide');
    // console.log(this.prodArray);
    for (let i = 0; i < this.prodArray.length; i++) {
      this.prodArray[i]['product_id'] = 'P' + i;
    }
    const resp1 = await this.addSoucreService.getevents(this.prodArray);
    // console.log(resp1);
    this.eveObj = resp1;
    for (let i = 0; i < this.eveObj.length; i++) {
      for (let j = 0; j < this.prodArray.length; j++) {
        if (this.prodArray[j].prod_id === this.eveObj[i].prod_id) {
          this.eveObj[i]['dtl_prod_desc'] = this.prodArray[j].dtl_prod_desc;
          this.eveObj[i]['product_id'] = this.prodArray[j].product_id;
          break;
        }
      }
    }
    this.evesource = new MatTableDataSource(this.eveObj);
    this.evesource.paginator = this.event_exist_paginator;
    $('#C').modal('show');
  }

  // selection from listed events
  async checkede(row, index) {
    this.eveArray.push(row);
    this.index = index;
    if (this.event_exist_paginator.pageIndex !== 0) {
      const pageIndex = this.event_exist_paginator.pageIndex;
      const pageSize = this.event_exist_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
      // console.log(this.index);
    }
    this.eveObj.splice(this.index, 1);
    this.refershDataSourceE();
  }

  // delete from selected list
  deleteIteme(row, index) {
    this.index = index;
    if (this.event_new_paginator.pageIndex !== 0) {
      const pageIndex = this.event_new_paginator.pageIndex;
      const pageSize = this.event_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.eveArray.splice(this.index, 1);
    this.refershDataSourceE();
  }

  openEModel(index, data, action) {
    // console.log('Event testing:'+data.ev_name)
    this.data = undefined;
    this.index = index;
    this.action = action;
    if (this.event_new_paginator.pageIndex !== 0) {
      const pageIndex = this.event_new_paginator.pageIndex;
      const pageSize = this.event_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    if (action === 'add') {
      this.eveForm.reset();
      $('#CreatEvnt').modal('show');
    } else {
      this.data = data;
      $('#CreatEvnt').modal('show');
      let setProd;
      for ( let i  = 0; i < this.prodArray.length; i++) {
        if (this.prodArray[i].product_id === data.product_id) {
          setProd = this.prodArray[i];
        }
      }
      this.eveForm.setValue({
        ev_name: data.ev_name,
        screen_to_project: data.screen_to_project,
        prd_sys: setProd

      });

    }
  }

  // add edit save button
  add_edit_event() {
    if (this.eveForm.invalid) {
      return;
    } else {
      const obj = new Object();
      obj['ev_name'] = this.eveForm.get('ev_name').value;
      obj['screen_to_project'] = this.eveForm.get('screen_to_project').value['screen'];
      obj['dtl_prod_desc'] = this.eveForm.get('prd_sys').value['dtl_prod_desc'];
      obj['product_id'] = this.eveForm.get('prd_sys').value['product_id'];
      if (this.action === 'add') {
        obj['ev_id'] = '';
        this.eveArray.push(obj);
      } else {
        obj['ev_id'] = this.data.ev_id;
        this.eveArray.splice(this.index, 1, obj);
      }
      this.refershDataSourceE();
      $('#CreatEvnt').modal('hide');
    }
  }

  refershDataSourceE() {
    this.evesource1 = new MatTableDataSource(this.eveArray);
    this.evesource = new MatTableDataSource(this.eveObj);
    this.evesource1.paginator = this.event_new_paginator;
    this.evesource.paginator = this.event_exist_paginator;

  }


  // ***********************************************************************************************
  //              Accounts Modal and all actions
  // *********************************************************************************************** */

  async openaccountModal() {
    // console.log(this.eveArray);
    $('#C').modal('hide');
    for (let i = 0; i < this.eveArray.length; i++) {
      this.eveArray[i]['event_id'] = 'E' + i;
      this.eveArray[i]['ent_cd'] = this.appService.ent_cd;
    }
    const resp1 = await this.addSoucreService.getaccount(this.eveArray);
    this.acObj = resp1;
    for (let i = 0; i < this.acObj.length; i++) {
      for (let j = 0; j < this.eveArray.length; j++) {
        if (this.eveArray[j].ev_id === this.acObj[i].ev_id) {
          this.acObj[i]['ev_name'] = this.eveArray[j].ev_name;
          this.acObj[i]['event_id'] = this.eveArray[j].event_id;
          break;
        }
      }
    }
    this.acsource = new MatTableDataSource(this.acObj);
    this.acsource.paginator = this.account_exist_paginator;
    $('#D').modal('show');
  }

  // selection from listed accounts
  async checked_ac(row, index) {
    this.acArray.push(row);
    this.index = index;
    if (this.account_exist_paginator.pageIndex !== 0) {
      const pageIndex = this.account_exist_paginator.pageIndex;
      const pageSize = this.account_exist_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.acObj.splice(index, 1);
    this.refershDataSource_ac();
  }

  // delete from selected acccount
  deleteItem_ac(row, index) {
    this.index = index;
    if (this.account_new_paginator.pageIndex !== 0) {
      const pageIndex = this.account_new_paginator.pageIndex;
      const pageSize = this.account_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.acArray.splice(this.index, 1);
    this.refershDataSource_ac();

  }

  // add and edit account popup
  openACModal(index, data, action) {
    this.index = index;
    this.action = action;
    // console.log('Checking' + data.acct_desc);
    if (this.account_new_paginator.pageIndex !== 0) {
      const pageIndex = this.account_new_paginator.pageIndex;
      const pageSize = this.account_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    if (this.action === 'add') {
      this.acForm.reset();
      $('#AddAccount').modal('show');
    } else {
      $('#AddAccount').modal('show');
      // console.log(data);
      this.s_ev_acc = [];
      let acc_index = 0;
      for ( let i = 0; i < this.eveArray.length; i++) {
        if ( this.eveArray[i].event_id === data.event_id) {
          acc_index++;
          this.s_ev_acc[0] = this.eveArray[i];
          break;
        }
      }
      this.acForm.setValue({
        account_number: data.account_number,
        acct_desc: data.acct_desc,
        acct_type: data.acct_type,
        acct_type_cd: data.account_type_cd,
        account_grp_cd: data.account_grp_cd,
        rwa_off_ind: data.rwa_off_ind,
        bsht_ind: data.bsht_ind,
        trl_bal_ind: data.trl_bal_ind,
        incm_stmt_ind: data.incm_stmt_ind,
        perfm_account_ind: data.perfm_account_ind,
        carry_fwd_ind: data.carry_fwd_ind,
        lr_exposure_type: data.lr_exposure_type,
        lr_sub_cat: data.lr_sub_cat,
      });
      this.eventCtl.setValue(this.eveArray[acc_index]);
    }

  }
  selectEvent(event) {
    // console.log(event);
    if (this.action === 'add') {
      this.s_ev_acc = event.value;
    } else {
      this.s_ev_acc = event.value;
    }

  }

  selectAccType(event) {
    this.acct_type = event.value;
  }

  // add edit save button
  add_edit_account() {
    // console.log(this.action);
    if (this.acForm.invalid) {
      return;
    } else {
      const obj1 = {};
      if (this.acForm.get('rwa_off_ind').value) {
        obj1['rwa_off_ind'] = 'Y';
      } else {
        obj1['rwa_off_ind'] = 'N';
      }
      if (this.acForm.get('bsht_ind').value) {
        obj1['bsht_ind'] = 'Y';
      } else {
        obj1['bsht_ind'] = 'N';
      }
      if (this.acForm.get('trl_bal_ind').value) {
        obj1['trl_bal_ind'] = 'Y';
      } else {
        obj1['trl_bal_ind'] = 'N';
      }
      if (this.acForm.get('incm_stmt_ind').value) {
        obj1['incm_stmt_ind'] = 'Y';
      } else {
        obj1['incm_stmt_ind'] = 'N';
      }
      if (this.acForm.get('perfm_account_ind').value) {
        obj1['perfm_account_ind'] = 'Y';
      } else {
        obj1['perfm_account_ind'] = 'N';
      }
      if (this.acForm.get('carry_fwd_ind').value) {
        obj1['carry_fwd_ind'] = 'Y';
      } else {
        obj1['carry_fwd_ind'] = 'N';
      }
      obj1['memo_ind'] = 'N';
      obj1['account_number'] = this.acForm.get('account_number').value;
      obj1['acct_desc'] = this.acForm.get('acct_desc').value;
      obj1['acct_type'] = this.acct_type;
      obj1['account_type_cd'] = this.acForm.get('acct_type_cd').value;
      obj1['account_grp_cd'] = this.acForm.get('account_grp_cd').value;
      obj1['lr_exposure_type'] = this.acForm.get('lr_exposure_type').value;
      obj1['lr_sub_cat'] = this.acForm.get('lr_sub_cat').value;
      if (this.action === 'add') {
        for (let i = 0; i < this.s_ev_acc.length; i++) {
          const clone = Object.assign({}, obj1);
          clone['ev_name'] = this.s_ev_acc[i].ev_name;
          clone['event_id'] = this.s_ev_acc[i].event_id;
          this.acArray.push(clone);
        }
        this.refershDataSource_ac();
      } else {
        // console.log('test', this.s_ev_acc);
        if (this.s_ev_acc.length > 1) {
          // console.log('inside length >1');
          for (let j = 0; j < this.s_ev_acc.length; j++) {
            const clone1 = Object.assign({}, obj1);
            clone1['ev_name'] = this.s_ev_acc[j].ev_name;
            clone1['event_id'] = this.s_ev_acc[j].event_id;
            if (j === 0) {
              this.acArray.splice(this.index, 1, clone1);
            } else {
              // console.log('inside else of j===0');
              this.acArray.push(clone1);
            }
          }
        } else {
          const clone2 = Object.assign({}, obj1);
          clone2['ev_name'] = this.s_ev_acc[0].ev_name;
          this.acArray.splice(this.index, 1, clone2);
        }
        this.refershDataSource_ac();
      }
    }
  }

  refershDataSource_ac() {
    console.log(this.acArray);
    this.acsource1 = new MatTableDataSource(this.acArray);
    this.acsource = new MatTableDataSource(this.acObj);
    this.acsource1.paginator = this.account_new_paginator;
    this.acsource.paginator = this.account_exist_paginator;

  }


  // ***********************************************************************************************
  //              Customer Modal and all actions
  // *********************************************************************************************** */

  async openCustomerModal() {
    // console.log(this.acArray);
    $('#D').modal('hide');
    const resp1 = await this.addSoucreService.getall_customers();
    // console.log(resp1);
    this.custObj = resp1;
    this.csource = new MatTableDataSource(this.custObj);
    $('#E').modal('show');

  }
  async checkedc(row, index) {
    this.custArray.push(row);
    this.index = index;
    if (this.customer_exist_paginator.pageIndex !== 0) {
      const pageIndex = this.customer_exist_paginator.pageIndex;
      const pageSize = this.customer_exist_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.custObj.splice(index, 1);
    this.refershDataSourcec();
  }

  deleteItemc(row, index) {
    // console.log('Working',row)
    this.index = index;
    if (this.customer_new_paginator.pageIndex !== 0) {
      const pageIndex = this.customer_new_paginator.pageIndex;
      const pageSize = this.customer_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.custArray.splice(index, 1);
    this.refershDataSourcec();
  }

  openCModal(index, data, action) {
    this.data = undefined;
    this.index = index;
    this.action = action;
    if (this.customer_new_paginator.pageIndex !== 0) {
      const pageIndex = this.customer_new_paginator.pageIndex;
      const pageSize = this.customer_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    // console.log('Checking' + data.acct_desc);
    if (this.action === 'add') {
      this.acForm.reset();
      $('#CreatCustomer').modal('show');
    } else {
      this.data = data;
      $('#CreatCustomer').modal('show');
      // console.log(data);
      this.CustForm.setValue({
        customer_type_cd: data.customer_type_cd,
        customer_type_desc: data.customer_type_desc,
        dtl_customer_type_cd: data.dtl_customer_type_cd,
        dtl_customer_type_desc: data.dtl_customer_type_desc,
        cust_segment: data.cust_segment,
        lr_exposure_type: data.lr_exposure_type,
        risk_weight: data.risk_weight
      });
    }

  }
  add_edit_cust() {
    if (this.CustForm.invalid) {
      return;
    } else {
      const obj = new Object();
      obj['customer_type_cd'] = this.CustForm.get('customer_type_cd').value;
      obj['customer_type_desc'] = this.CustForm.get('customer_type_desc').value;
      obj['dtl_customer_type_cd'] = this.CustForm.get('dtl_customer_type_cd').value;
      obj['dtl_customer_type_desc'] = this.CustForm.get('dtl_customer_type_desc').value;
      obj['cust_segment'] = this.CustForm.get('cust_segment').value;
      obj['lr_exposure_type'] = this.CustForm.get('lr_exposure_type').value;
      obj['risk_weight'] = this.CustForm.get('risk_weight').value;
      if (this.action === 'add') {
        this.custArray.push(obj);
      } else {
        this.custArray.splice(this.index, 1, obj);
      }
      this.refershDataSourcec();
      $('#CreatCustomer').modal('hide');
    }
  }

  refershDataSourcec() {
    // console.log(this.srcArray)
    this.csource1 = new MatTableDataSource(this.custArray);
    this.csource = new MatTableDataSource(this.custObj);
    this.csource.paginator = this.customer_exist_paginator;
    this.csource1.paginator = this.customer_new_paginator;

  }








  async postfinalData() {
    this.spinner.show();
    const finalArr = [];
/*     console.log(this.srcArray);
    console.log(this.prodArray);
    console.log(this.eveArray);
    console.log(this.acArray); */

    for (let i = 0; i < this.srcArray.length; i++) {
      let sources = {};
      sources = this.srcArray[i];
      sources['products'] = [];
      for (let j = 0; j < this.prodArray.length; j++) {
        let products = {};
        if (this.srcArray[i].source_id === this.prodArray[j].source_id) {
          products = this.prodArray[j];
          products['events'] = [];
          for (let k = 0; k < this.eveArray.length; k++) {
            let events = {};
            if (this.eveArray[k].product_id === this.prodArray[j].product_id) {
              events = this.eveArray[k];
              events['accounts'] = [];
              for (let l = 0; l < this.acArray.length; l++) {
                let accounts = {};
                if (this.acArray[l].event_id === this.eveArray[k].event_id) {
                  accounts = this.acArray[l];
                  if (Object.keys(accounts).length !== 0) {
                    events['accounts'].push(accounts);
                  }
                }
              }
              if (Object.keys(events).length !== 0) {
                if (this.eveArray[k].screen_to_project === 'arr') {
                  if (events['accounts'].length !== 0) {
                    products['events'].push(events);
                  }
                } else {
                  products['events'].push(events);
                }
              }
            }
          }
        }
        if (Object.keys(products).length !== 0 && products['events'].length !== 0) {
          sources['products'].push(products);
        }
      }
      if (sources['products'].length !== 0) {
        finalArr.push(sources);
      }
    }

    // console.log(finalArr);
    const dataObj = {};
    dataObj['data'] = finalArr;
    dataObj['customer'] = this.custArray;
    dataObj['ent_cd'] = this.ent_cd;
    console.log(dataObj);
    const resp = await this.addSoucreService.postData(dataObj);
    if (resp) {
      this.spinner.hide();
      this._snackBar.open(resp.data, 'close', {
        duration: 2000});
      this.routeAdminPage();
    } else {
      this._snackBar.open(resp.data, 'close', {
        duration: 2000});
      this.spinner.hide();
    }
  }
  async routeAdminPage() {
    const that = this;
    const resp = this.closeAll();
    if (resp) {
      // console.log('calling', resp);
      that.router.navigate(['/source/admin']);
    }
  }

  closeAll() {
    $('#A').modal('hide');
    $('#B').modal('hide');
    $('#C').modal('hide');
    $('#E').modal('hide');
    $('#E').modal('hide');
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
    return 1;
  }


}
