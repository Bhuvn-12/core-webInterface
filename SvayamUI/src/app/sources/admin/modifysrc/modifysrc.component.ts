import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModifySourceService } from '../../../services/sources/admin/modifysource/modify-source.service';
import { AdminService } from '../../../services/sources/admin/admin.service';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';

declare var $: any;
@Component({
  selector: 'app-modifysrc',
  templateUrl: './modifysrc.component.html',
  styleUrls: ['./modifysrc.component.css']
})
export class ModifysrcComponent implements OnInit {

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
  selected = 'option2';

  constructor(private modifysrcService: ModifySourceService, private fb: FormBuilder, private adminsrcService: AdminService,
    private router: Router) {
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
      account_type_cd: ['', Validators.required],
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
  spdisplayedColumns: string[] = ['action', 'dtl_prod_desc'];
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
  unallotted_prod_arr = [];
  allotted_prod_arr;
  allotted_event = [];
  unallotted_event = [];
  allotted_account = [];
  unallotted_account = [];
  unallotted_cust = [];
  allotted_cust = [];
  prodObj1;
  eveObj;
  custObj;
  id;
  acObj;
  ent_cd = 'FZ102';
  delArray = [];
  // action values variable
  action;
  index;
  data;
  viewed_prod = false;
  view_eve = false;
  view_ac = false;
  DelProdArray = [];
  DelEventArray = [];
  DelAccountArray = [];
  DelCustArray = [];
  AddProdArray = [];
  AddEventArray = [];
  AddAccountArray = [];
  AddCustArray = [];
  EditsrcArray = [];
  EditProdArray = [];
  EditEventArray = [];
  EditAccountArray = [];
  EditCustArray = [];

  // clicked source sytstem object
  clickedObj;

  async ngOnInit() {
    this.clickedObj = this.adminsrcService.editsrcObj;
    if (this.clickedObj === undefined) {
      this.router.navigate(['/source/admin']);
    } else {
      this.opensrcModal();
    }
  }

  // ***************************************************************************************************** */
  //                            source System all request
  // **************************************************************************************************** */
  async opensrcModal() {
    this.dataobj = await this.modifysrcService.getSrc(this.clickedObj.ss_id);
    this.data = this.dataobj[0];
    // console.log(this.dataobj);
    $('#createsrc').modal('show');
    this.sourceForm.setValue({
      ss_name: this.dataobj[0].ss_name,
      is_automatic: this.dataobj[0].is_automatic,
      kafka_ip: this.dataobj[0].kafka_ip,
      kafka_port: this.dataobj[0].kafka_port,
      topic: this.dataobj[0].topic,
    });
  }
  // add edit save button
  add_edit_src() {
    this.srcArray = [];
    if (this.sourceForm.invalid) {
      return;
    } else {
      const obj = new Object();
      if (this.sourceForm.get('is_automatic').value === true) {
        obj['is_automatic'] = 'Y';
      } else {
        obj['is_automatic'] = 'N';
      }
      obj['ss_name'] = this.sourceForm.get('ss_name').value;
      obj['kafka_ip'] = this.sourceForm.get('kafka_ip').value;
      obj['kafka_port'] = this.sourceForm.get('kafka_port').value;
      obj['topic'] = this.sourceForm.get('topic').value;
      obj['ss_id'] = this.data.ss_id;
      this.EditsrcArray.push(obj);
      this.srcArray.push(obj);
      $('#createsrc').modal('hide');
      this.getProducts();
    }
  }
  // ***************************************************************************************************** */
  //                           Products  all request
  // **************************************************************************************************** */

  async getProducts() {
    if (!this.viewed_prod) {
      for (let i = 0; i < this.srcArray.length; i++) {
        this.srcArray[i]['source_id'] = 'S' + i;
      }
      const resp = await this.modifysrcService.getproducts(this.srcArray[0]);
      this.prodArray = resp.allotted;
      this.allotted_prod_arr = resp.allotted.slice();
      this.unallotted_prod_arr = resp.unallotted;

      for (let i = 0; i < this.prodArray.length; i++) {
        this.prodArray[i]['ss_name'] = this.srcArray[0].ss_name;
        this.prodArray[i]['source_id'] = this.srcArray[0].source_id;
        this.prodArray[i]['is_allotted'] = true;
      }
      for (let i = 0; i < this.unallotted_prod_arr.length; i++) {
        this.unallotted_prod_arr[i]['ss_name'] = this.srcArray[0].ss_name;
        this.unallotted_prod_arr[i]['source_id'] = this.srcArray[0].source_id;
        this.unallotted_prod_arr[i]['is_allotted'] = false;
        this.unallotted_prod_arr[i]['action'] = 'add';
      }
    }

    this.refreshDataSourcep();
    $('#Productslist').modal('show');
  }

  // select one from listed
  async checkedp(row, index) {
    this.prodArray.push(row);
    this.unallotted_prod_arr.splice(index, 1);
    this.refreshDataSourcep();
  }

  // delet from selected
  deleteItemp(row, index) {
    this.index = index;
    if (this.prod_new_paginator.pageIndex !== 0) {
      const pagesize = this.prod_new_paginator.pageSize;
      const pageindex = this.prod_new_paginator.pageIndex;
      this.index = index + (pageindex * pagesize);
    }
    row['action'] = 'Delete';
    if (row['is_allotted'] === true) {
      this.DelProdArray.push(row);
    }
    this.prodArray.splice(this.index, 1);
    this.refreshDataSourcep();
  }

  // add edit Product Modal
  openPModel(index, data, action) {
    // console.log(this.data);
    this.data = undefined;
    this.index = index;
    if (this.prod_new_paginator.pageIndex !== 0) {
      const pageIndex = this.prod_new_paginator.pageIndex;
      const pageSize = this.prod_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    // console.log('index after' + this.index);
    this.action = action;
    if (action === 'add') {
      this.prodForm.reset();
      $('#Createprdct').modal('show');
    } else {
      this.data = data;
      $('#Createprdct').modal('show');
      console.log(data);
      this.prodForm.setValue({
        prod_desc: data.prod_desc,
        prod_cd: data.prod_cd,
        dtl_prod_desc: data.dtl_prod_desc,
        dtl_prod_cd: data.dtl_prod_cd,
        off_balance_sheet_exposure_type: data.off_balance_sheet_exposure_type,
        credit_conversion_factor: data.credit_conversion_factor,
        src_sys: data.ss_name
      });
    }
  }

  // add edit save button
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

      if (this.action === 'add') {
        obj['prod_id'] = '';
        obj['is_allotted'] = false;
        obj['action'] = 'add';
        this.prodArray.push(obj);
      } else {
        if (this.data.action === 'add') {
          obj['action'] = 'add';
        } else {
          obj['action'] = 'edit';
          obj['old_dtl_prod_cd'] = this.data.dtl_prod_cd;
        }
        obj['prod_id'] = this.data.prod_id;
        obj['is_allotted'] = this.data.is_allotted;
        this.prodArray.splice(this.index, 1, obj);
      }
      // console.log(obj);
      this.refreshDataSourcep();
      $('#Createprdct').modal('hide');
    }
  }



  refreshDataSourcep() {
    this.prodsource1 = new MatTableDataSource(this.prodArray);
    this.prodsource = new MatTableDataSource(this.unallotted_prod_arr);
    this.prodsource1.paginator = this.prod_new_paginator;
    this.prodsource.paginator = this.prod_exist_paginator;
  }

  // ***************************************************************************************************** */
  //                           Events  all request
  // **************************************************************************************************** */

  async getEvents() {
    // console.log('Is data coming??');
    this.viewed_prod = true;
    $('#Productslist').modal('hide');
    if (!this.view_eve) {
      for (let i = 0; i < this.prodArray.length; i++) {
        this.prodArray[i]['product_id'] = 'P' + i;
      }
      const xyz = await this.modifysrcService.getevents(this.prodArray);
      if (xyz) {
        // console.log(xyz);
        this.eveArray = xyz.allotted;

        // console.log(xyz.allotted[0].ev_id);
        this.allotted_event = xyz.allotted.slice();
        // console.log(this.allotted_event);
        this.unallotted_event = xyz.unallotted;
        // console.log(this.unallotted_event,xyz.unallotted)
        for (let i = 0; i < this.allotted_event.length; i++) {
          for (let j = 0; j < this.prodArray.length; j++) {
            if (this.prodArray[j].prod_id === this.allotted_event[i].prod_id) {
              this.allotted_event[i]['dtl_prod_desc'] = this.prodArray[j].dtl_prod_desc;
              this.allotted_event[i]['product_id'] = this.prodArray[j].product_id;
              this.allotted_event[i]['is_eve_allotted'] = true;
            }
          }
        }
        for (let i = 0; i < this.unallotted_event.length; i++) {
          for (let j = 0; j < this.prodArray.length; j++) {
            if (this.prodArray[j].prod_id === this.unallotted_event[i].prod_id) {
              this.unallotted_event[i]['dtl_prod_desc'] = this.prodArray[j].dtl_prod_desc;
              this.unallotted_event[i]['product_id'] = this.prodArray[j].product_id;
              this.unallotted_event[i]['is_eve_allotted'] = false;
              this.unallotted_event[i]['action'] = 'add';
            }
          }

        }
      }

    }
    this.refreshDataSourceE();
    $('#Eventlist').modal('show');
    // console.log(this.eveArray);
  }

  // selet from listed
  async checkede(row, index) {
    // row['ev_id'] = '';
    this.eveArray.push(row);
    this.unallotted_event.splice(index, 1);
    this.refreshDataSourceE();
  }

  // delete from selected
  deleteIteme(row, index) {
    this.index = index;
    // console.log(this.event_new_paginator.pageIndex);
    if (this.event_new_paginator.pageIndex !== 0) {
      const pageIndex = this.event_new_paginator.pageIndex;
      const pageSize = this.event_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    row['action'] = 'delete';
    if (row['is_eve_allotted'] === true) {
      this.DelEventArray.push(row);
    }
    this.eveArray.splice(this.index, 1);
    this.refreshDataSourceE();
  }

  // add edit Modal
  openEModel(index, data, action) {
    // // console.log('Event testing:'+data.ev_name)
    this.data = undefined;
    this.index = index;
    // console.log(this.event_new_paginator.pageIndex);
    if (this.event_new_paginator.pageIndex !== 0) {
      const pageIndex = this.event_new_paginator.pageIndex;
      const pageSize = this.event_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    // console.log('index after' + this.index);
    this.action = action;
    if (action === 'add') {
      this.eveForm.reset();
      $('#CreatEvnt').modal('show');
      this.refreshDataSourceE();
    } else {
      this.data = data;
      $('#CreatEvnt').modal('show');
      this.eveForm.setValue({
        ev_name: data.ev_name,
        screen_to_project: data.screen_to_project,
        prd_sys: data.dtl_prod_desc
      });
      this.refreshDataSourceE();
    }

  }

  // add edit save button
  add_edit_event() {
    if (this.eveForm.invalid) {
      // console.log('test');
      return;
    } else {
      const obj = new Object();
      // console.log('fz', this.eveForm.get('prd_sys'));
      obj['product_id'] = this.eveForm.get('prd_sys').value['product_id'];
      obj['ev_name'] = this.eveForm.get('ev_name').value;
      obj['screen_to_project'] = this.eveForm.get('screen_to_project').value['screen'];
      obj['dtl_prod_desc'] = this.eveForm.get('prd_sys').value['dtl_prod_desc'];
      if (this.action === 'add') {
        obj['ev_id'] = '';
        obj['is_eve_allotted'] = false;
        obj['action'] = 'add';
        this.eveArray.push(obj);
      } else {
        if (this.data.action === 'add') {
          obj['action'] = 'add';
          obj['ev_id'] = '';
        } else {
          if (obj['product_id'] === this.data.product_id) {
            obj['action'] = 'edit';
            obj['ev_id'] = this.data.ev_id;
          } else {
            obj['action'] = 'add';
            obj['ev_id'] = '';
            const delObj = Object.assign({}, this.data);
            delObj['action'] = 'delete';
            this.DelEventArray.push(delObj);
          }
        }
        obj['is_eve_allotted'] = this.data.is_eve_allotted;
        this.eveArray.splice(this.index, 1, obj);
      }
      this.refreshDataSourceE();
      $('#CreatEvnt').modal('hide');
    }
  }

  refreshDataSourceE() {
    this.evesource1 = new MatTableDataSource(this.eveArray);
    this.evesource = new MatTableDataSource(this.unallotted_event);
    this.evesource1.paginator = this.event_new_paginator;
    this.evesource.paginator = this.event_exist_paginator;
  }

  // ***************************************************************************************************** */
  //                           Account  all request
  // **************************************************************************************************** */
  async getAccounts() {
    this.view_eve = true;
    $('#Eventlist').modal('hide');
    for (let i = 0; i < this.eveArray.length; i++) {
      this.eveArray[i]['event_id'] = 'E' + i;
    }
    const resp1 = await this.modifysrcService.getaccount(this.eveArray);
    this.acArray = resp1.allotted;
    this.unallotted_account = resp1.unallotted;
    this.allotted_account = resp1.allotted.slice();
    for (let i = 0; i < this.unallotted_account.length; i++) {
      for (let j = 0; j < this.eveArray.length; j++) {
        if (this.eveArray[j].ev_id === this.unallotted_account[i].ev_id) {
          this.unallotted_account[i]['ev_name'] = this.eveArray[j].ev_name;
          this.unallotted_account[i]['event_id'] = this.eveArray[j].event_id;
          this.unallotted_account[i]['action'] = 'add';
          break;
        }
      }
    }
    for (let i = 0; i < this.acArray.length; i++) {
      for (let j = 0; j < this.eveArray.length; j++) {
        if (this.eveArray[j].ev_id === this.allotted_account[i].ev_id) {
          this.acArray[i]['ev_name'] = this.eveArray[j].ev_name;
          this.acArray[i]['event_id'] = this.eveArray[j].event_id;
          break;
        }
      }
    }
    $('#Accountslist').modal('show');
    this.refreshDataSource_ac();
  }

  // select from listed
  async checked_ac(row, index) {
    // row['acc_id'] = '';
    this.acArray.push(row);
    this.unallotted_account.splice(index, 1);
    this.refreshDataSource_ac();
  }

  // delet from selected
  deleteItem_ac(row, index) {
    // // console.log('Working', row)
    this.index = index;
    if (this.account_new_paginator.pageIndex !== 0) {
      const pageIndex = this.account_new_paginator.pageIndex;
      const pageSize = this.account_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    row['action'] = 'Delete';
    this.DelAccountArray.push(row);
    this.acArray.splice(this.index, 1);
    this.refreshDataSource_ac();

  }



  // add edit Modal
  openACModal(index, data, action) {
    this.index = index;
    if (this.account_new_paginator.pageIndex !== 0) {
      const pageIndex = this.account_new_paginator.pageIndex;
      const pageSize = this.account_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.action = action;
    // console.log(data.account_type_cd);
    if (this.action === 'add') {
      this.acForm.reset();
      $('#AddAccount').modal('show');
    } else {
      $('#AddAccount').modal('show');
      // console.log(data);
      this.data = data;
      this.s_ev_acc = [];
      this.s_ev_acc[0] = data;
      this.acForm.setValue({
        account_number: data.account_number,
        acct_desc: data.acct_desc,
        acct_type: data.acct_type,
        account_type_cd: data.account_type_cd,
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
    }

  }

  selectEvent(event) {
    // console.log(event);
    if (this.action === 'add') {
      this.s_ev_acc = event.value;
      // console.log(event.value);
    } else {
      this.s_ev_acc = event.value;
    }

  }

  // add edit save button
  add_edit_account() {
    this.view_eve = true;
    if (!this.view_ac) {
      // console.log(this.action);
      if (this.acForm.invalid) {
        // console.log('inside invalid');
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
        obj1['account_number'] = this.acForm.get('account_number').value;
        obj1['acct_desc'] = this.acForm.get('acct_desc').value;
        obj1['acct_type'] = this.acForm.get('acct_type').value;
        obj1['account_type_cd'] = this.acForm.get('account_type_cd').value;
        obj1['account_grp_cd'] = this.acForm.get('account_grp_cd').value;
        obj1['lr_exposure_type'] = this.acForm.get('lr_exposure_type').value;
        obj1['lr_sub_cat'] = this.acForm.get('lr_sub_cat').value;
        if (this.action === 'add') {
          for (let i = 0; i < this.s_ev_acc.length; i++) {
            const clone = Object.assign({}, obj1);
            clone['ev_name'] = this.s_ev_acc[i].ev_name;
            clone['action'] = 'add';
            clone['ev_id'] = '';
            clone['event_id'] = this.s_ev_acc[i].event_id;
            clone['acc_id'] = '';
            this.acArray.push(clone);
          }
          this.refreshDataSource_ac();
        } else {
          if (this.data.action === 'add') {
            if (this.s_ev_acc.length > 1) {
              for (let j = 0; j < this.s_ev_acc.length; j++) {
                const clone1 = Object.assign({}, obj1);
                clone1['ev_name'] = this.s_ev_acc[j].ev_name;
                clone1['event_id'] = this.s_ev_acc[j].event_id;
                clone1['ev_id'] = this.s_ev_acc[j].ev_id;
                clone1['action'] = 'add';
                clone1['acc_id'] = '';
                if (j === 0) {
                  this.acArray.splice(this.index, 1, clone1);
                } else {
                  this.acArray.push(clone1);
                }
              }
            } else {
              const clone2 = Object.assign({}, obj1);
              clone2['ev_name'] = this.s_ev_acc[0].ev_name;
              clone2['event_id'] = this.s_ev_acc[0].event_id;
              clone2['ev_id'] = this.s_ev_acc[0].ev_id;
              clone2['action'] = 'add';
              clone2['acc_id'] = '';
              this.acArray.splice(this.index, 1, clone2);
            }
          } else {
            if (this.s_ev_acc.length > 1) {
              for (let j = 0; j < this.s_ev_acc.length; j++) {
                const clone1 = Object.assign({}, obj1);
                clone1['ev_name'] = this.s_ev_acc[j].ev_name;
                clone1['event_id'] = this.s_ev_acc[j].event_id;
                clone1['ev_id'] = this.s_ev_acc[j].ev_id;
                clone1['old_acc_id'] = this.data.acc_id;
                if (this.data.event_id === this.s_ev_acc[j].event_id) {
                  if (j === 0) {
                    clone1['action'] = 'edit';
                    clone1['acc_id'] = this.data.acc_id;
                    this.acArray.splice(this.index, 1, clone1);
                  } else {
                    clone1['action'] = 'edit';
                    clone1['acc_id'] = this.data.acc_id;
                    this.acArray.push(clone1);
                  }
                } else {
                  if (j === 0) {
                    clone1['action'] = 'add';
                    clone1['acc_id'] = '';
                    this.acArray.splice(this.index, 1, clone1);
                    const delObj = Object.assign({}, this.data);
                    delObj['action'] = 'delete';
                    this.DelAccountArray.push(delObj);
                  } else {
                    clone1['action'] = 'add';
                    clone1['acc_id'] = '';
                    const delObj = Object.assign({}, this.data);
                    delObj['action'] = 'delete';
                    this.DelAccountArray.push(delObj);
                    this.acArray.push(clone1);
                  }
                }

              }
            } else {
              const clone2 = Object.assign({}, obj1);
              clone2['ev_name'] = this.s_ev_acc[0].ev_name;
              clone2['event_id'] = this.s_ev_acc[0].event_id;
              if (this.s_ev_acc[0].event_id === this.data.event_id) {
                clone2['ev_id'] = this.s_ev_acc[0].ev_id;
                clone2['action'] = 'edit';
              } else {
                const delObj = Object.assign({}, this.data);
                delObj['action'] = 'delete';
                this.DelAccountArray.push(delObj);
                clone2['ev_id'] = this.s_ev_acc[0].ev_id;
                clone2['action'] = 'add';
              }
              this.acArray.splice(this.index, 1, clone2);
            }
          }
          this.refreshDataSource_ac();
        }
      }
    }
  }

  refreshDataSource_ac() {
    // console.log(this.acArray);
    this.acsource1 = new MatTableDataSource(this.acArray);
    // console.log(this.acsource1);
    this.acsource = new MatTableDataSource(this.unallotted_account);
    this.acsource1.paginator = this.account_new_paginator;
    this.acsource.paginator = this.account_exist_paginator;

  }

  // ***************************************************************************************************** */
  //                           Account  all request
  // **************************************************************************************************** */
  async openCustomerModal() {
    this.view_ac = true;
    $('#Accountslist').modal('hide');
    const resp1 = await this.modifysrcService.getall_customers(this.ent_cd);
    // console.log(resp1);
    this.allotted_cust = resp1.allotted.slice();
    this.custArray = resp1.allotted;
    this.unallotted_cust = resp1.unallotted;
    this.csource = new MatTableDataSource(this.unallotted_cust);
    this.refreshDataSourcec();
    $('#Customerlist').modal('show');

  }

  // select from listed
  async checkedc(row, index) {
    this.custArray.push(row);
    this.unallotted_cust.splice(index, 1);
    this.refreshDataSourcec();
  }

  // delete from selected
  deleteItemc(row, index) {
    this.index = index;
    if (this.customer_new_paginator.pageIndex !== 0) {
      const pageIndex = this.customer_new_paginator.pageIndex;
      const pageSize = this.customer_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    row['action'] = 'Delete';
    this.DelCustArray = row;
    this.custArray.splice(this.index, 1);
    this.refreshDataSourcec();

  }

  // add edit Modal
  openCModal(index, data, action) {
    this.data = undefined;
    this.index = index;
    if (this.customer_new_paginator.pageIndex !== 0) {
      const pageIndex = this.customer_new_paginator.pageIndex;
      const pageSize = this.customer_new_paginator.pageSize;
      this.index = index + (pageIndex * pageSize);
    }
    this.action = action;
    // console.log('Checking' + data.acct_desc);
    if (this.data.action !== undefined || this.action === 'add') {
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

  // add edit save button
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
        this.custArray['action'] = 'add';
        this.custArray['cust_id'] = '';
      } else {
        if (this.data.action === 'add') {
          obj['action'] = 'add';
          obj['cust_id'] = '';
        } else {
          obj['action'] = 'edit';
          obj['cust_id'] = this.data.cust_id;
          obj['old_dtl_customer_type_cd'] = this.data.dtl_customer_type_cd;
        }
        this.custArray.splice(this.index, 1, obj);
        // this.custArray['action']='edit'
      }
      this.refreshDataSourcec();
      $('#CreatCustomer').hide();
    }
  }

  refreshDataSourcec() {
    // // console.log(this.srcArray)
    this.csource1 = new MatTableDataSource(this.custArray);
    this.csource = new MatTableDataSource(this.unallotted_cust);
    this.csource.paginator = this.customer_exist_paginator;
    this.csource1.paginator = this.customer_new_paginator;

  }






  // final factorization of data
  async postfinalData() {

    const finalEvent = [];
    const finalAccount = [];
    const finalProduct = [];
    const finalCustomer = [];
    const p_id = {};
    const e_id = {};
    console.log(this.prodArray);
    console.log(this.eveArray);
    console.log(this.acArray);
    console.log(this.custArray);

    for (let i = 0; i < this.prodArray.length; i++) {
      if (this.prodArray[i].action === undefined) {
        continue;
      } else  if (this.prodArray[i].action === 'edit') {
        finalProduct.push(this.prodArray[i]);
      } else {
        p_id[this.prodArray[i].product_id] = 0;
        finalProduct.push(this.prodArray[i]);
      }
    }
    for (let i = 0; i < this.eveArray.length; i++) {
      if (this.eveArray[i].action === undefined) {
        continue;
      } else  if (this.eveArray[i].action === 'edit') {
        finalEvent.push(this.eveArray[i]);
      } else {
        if (this.eveArray[i].screen_to_project !== 'ip') {
          if (p_id[this.eveArray[i].product_id] === undefined) {
          } else {
            p_id[this.eveArray[i].product_id] =  p_id[this.eveArray[i].product_id] + 1 ;
          }
            e_id[this.eveArray[i].event_id] = 0;
        }
        if (p_id[this.eveArray[i].product_id] !== undefined ) {
          if (p_id[this.eveArray[i].product_id] === undefined) {
           // p_id[this.prodArray[i].product_id] = 0;
          } else {
            p_id[this.eveArray[i].product_id] =  p_id[this.eveArray[i].product_id] + 1 ;
          }
        }
        finalEvent.push(this.eveArray[i]);
      }
    }
    for (let i = 0; i < this.acArray.length; i++) {
      if (this.acArray[i].action === undefined) {
        continue;
      } else  if (this.acArray[i].action === 'edit') {
        if (e_id[this.acArray[i].event_id] !== undefined) {
          e_id[this.acArray[i].event_id] =  e_id[this.acArray[i].event_id] + 1 ;
        }
        finalAccount.push(this.acArray[i]);
      } else {
        finalAccount.push(this.acArray[i]);
        if (e_id[this.acArray[i].event_id] !== undefined) {
          e_id[this.acArray[i].event_id] =  e_id[this.acArray[i].event_id] + 1 ;
        }
      }
    }

    const EventKeys = Object.keys(e_id);
    const tempEventArr = Array.from(finalEvent);
    for (let i = 0;  i < EventKeys.length; i++) {
      if (e_id[EventKeys[i]] !== 0) {
        continue;
      }
        for (let j = 0;  j < tempEventArr.length; j++) {
          if ( tempEventArr[j].event_id === EventKeys[i]) {
            if ( p_id[tempEventArr[j].product_id] !== undefined) {
              p_id[tempEventArr[j].product_id] = p_id[tempEventArr[j].product_id] - 1;
            }
            finalEvent.splice(j, 1);
          }
        }
    }
    const prodKeys = Object.keys(p_id);
    const tempProdArr = Array.from(finalProduct);
    for (let i = 0;  i < prodKeys.length; i++) {
      if (p_id[prodKeys[i]] !== 0) {
        continue;
      }
        for (let j = 0;  j < tempProdArr.length; j++) {
          if ( tempProdArr[j].product_id === prodKeys[i]) {
            finalEvent.splice(j, 1);
          }
        }
    }


    for (let i = 0; i < this.custArray.length; i++) {
      let flag_found = false;
      for (let j = 0; j < this.allotted_cust.length; j++) {
        if (this.custArray[i].cust_id === this.allotted_cust[j].cust_id) {
          if (this.custArray[i]['action'] !== undefined) {
            this.custArray[i]['action'] = 'edit';
            finalCustomer.push(this.custArray[i]);
          }
          flag_found = true;
          break;
        }
      }
      if (!flag_found) {
        finalCustomer.push(this.custArray);
      }

    }
    const addeditObj = new Object();
    addeditObj['products'] = finalProduct;
    addeditObj['events'] = finalEvent;
    addeditObj['customers'] = finalCustomer;
    addeditObj['accounts'] = finalAccount;
    const delObj = this.checkDelete();
    console.log('delete obj', addeditObj);
    console.log('delete obj', delObj);


  }



  checkDelete() {
    const delObj = new Object();
    const delProdArr = [];
    const delEventArr = [];
    const delAccountArr = [];
    const delCustomerArr = [];
    // check delete products
    for (let i = 0; i < this.allotted_prod_arr.length; i++) {
      for (let k = 0; k < this.DelProdArray.length; k++) {
        if (this.allotted_prod_arr[i].prod_id === this.DelProdArray[k].prod_id) {
          delProdArr.push(this.DelProdArray[k]);
          break;
        }
      }
    }
    // check delete events
    for (let i = 0; i < this.allotted_event.length; i++) {
      for (let k = 0; k < this.DelEventArray.length; k++) {
        if (this.allotted_event[i].ev_id === this.DelEventArray[k].ev_id) {
          delEventArr.push(this.DelEventArray[k]);
          break;
        }
      }
    }
    // check delete Accounts
    for (let i = 0; i < this.allotted_account.length; i++) {
      for (let k = 0; k < this.DelAccountArray.length; k++) {
        if (this.allotted_account[i].acc_id === this.DelAccountArray[k].acc_id) {
          delAccountArr.push(this.DelProdArray[k]);
          break;
        }
      }
    }
    // check delete customers
    for (let i = 0; i < this.allotted_cust.length; i++) {
      for (let k = 0; k < this.DelCustArray.length; k++) {
        if (this.allotted_account[i].cust_id === this.DelCustArray[k].cust_id) {
          delCustomerArr.push(this.DelProdArray[k]);
          break;
        }
      }
    }

    delObj['products'] = delProdArr;
    delObj['events'] = delEventArr;
    delObj['accounts'] = delAccountArr;
    delObj['customers'] = delCustomerArr;
    return delObj;
  }


}
