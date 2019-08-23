import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatStepper } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminService } from '../../services/sources/admin/admin.service';
import { SourceSystemSetupService } from '../../services/sources/admin1/source-system-setup/source-system-setup.service';
import { RuleDefinitionService } from '../../services/sources/admin1/rule-engine/rule-definition.service';
import { AppService } from '../../app.service';
import { NgxSpinnerService } from 'ngx-spinner';


declare var $: any;

@Component({
  selector: 'app-admin1',
  templateUrl: './admin1.component.html',
  styleUrls: ['./admin1.component.css']
})
export class Admin1Component implements OnInit {
  @Output() personListChange = new EventEmitter();

  eventCtl = new FormControl();

  constructor(private adminService: AdminService, private appService: AppService, private fb: FormBuilder,
    private router: Router, private _snackBar: MatSnackBar, private srcSetupService: SourceSystemSetupService,
    private ruleDefService: RuleDefinitionService, private spinner: NgxSpinnerService) {
    // Source form control initilization
    this.sourceForm = this.fb.group({
      ss_name: ['', Validators.required],
    });


    // Product form control initilization
    this.prodForm = this.fb.group({
      prod_desc: ['', Validators.required],
      prod_cd: ['', Validators.required],
      dtl_prod_desc: ['', Validators.required],
      dtl_prod_cd: ['', Validators.required],
      off_balance_sheet_exposure_type: [''],
      credit_conversion_factor: ['', Validators.required],
      src_sys: ['']
    });

    this.eventForm = this.fb.group({
      ev_name: ['', Validators.required],
      screen_to_project: ['', Validators.required],
      prd_sys: ['']

    });
  }

  // form Group for Form Control
  prodForm: FormGroup;
  sourceForm: FormGroup;
  eventForm: FormGroup;
  displayedColumns: string[] = ['ss_name', 'delete', 'modify'];
  displayedColumnsProd = [, , , , ,
    , 'actionsColumn'];
  new_product = {
    prod_cd: '', prod_desc: '', dtl_prod_cd: '', dtl_prod_desc: '', off_balance_sheet_exposure_type: '',
    'credit_conversion_factor': '', is_disabled: false
  };
  new_event = { ev_name: '', screen_to_project: '', prod_id: '', is_disabled: false, is_saved: false };

  prodList = [];
  eventList = [];
  ext_prod_arr = [];
  ss_name;
  dataSource;
  prodsource;
  ent_cd;
  tabledata;
  showNew;
  showNewEvent;
  ss_id;
  editsrcObj;
  prod_id_str = '0';
  loadRuleBuilder = 0;
  isLinear = true;
  is_show = false;

  // copy event variable
  copyObj;
  event_id_arr = [];
  async ngOnInit() {
    this.ent_cd = this.appService.ent_cd;
    this.tabledata = await this.adminService.mysourcesystem(this.ent_cd);
    if (this.tabledata) {
      this.refreshTableDataSource();
    }
    const respModal = await this.ruleDefService.getmodels(this.ent_cd);
    if (respModal) {
      this.ruleDefService.dataModel = respModal;
      this.ruleDefService.dataObjArr = Object.keys(respModal);
    }
    this.getExtProdList();

  }

  async deleteSource(Obj, index) {
    const resp = await this.adminService.deleteSource(Obj.ss_id);
    if (resp) {
      this.tabledata.splice(index, 1);
      this.refreshTableDataSource();
      this._snackBar.open(resp, 'close', {
        duration: 2000
      });
    } else {
      this._snackBar.open(resp.data, 'close', {
        duration: 2000
      });
    }
  }

  refreshTableDataSource() {
    this.dataSource = new MatTableDataSource(this.tabledata);
  }
  routermodifySource(obj) {
    this.adminService.editsrcObj = obj;
    this.editsrcObj = obj;
    this.openModal('edit');
    // this.router.navigate(['/source/modifysrc']);
  }
  openModal(action) {
    this.ruleDefService.action = action;
    if (action === 'edit') {
      this.is_show = true;
      this.ss_name = this.editsrcObj.ss_name;
      this.ss_id = this.editsrcObj.ss_id;
    } else {
      this.is_show = false;
      this.ss_name = '';
    }
    $('#addModal').modal('show');

  }

  // add Source
  async addSource() {
    let dataObj = new Object();
    if (this.ruleDefService.action === 'edit') {
      dataObj = this.editsrcObj;
      dataObj['ss_name'] = this.ss_name;
      const resp = await this.srcSetupService.updateSource(dataObj);
      if (resp) {
        this.is_show = true;
        this._snackBar.open('Source system is updated', 'close', {
          duration: 2000
        });
      }
    } else {
      dataObj['ss_name'] = this.ss_name;
      const resp = await this.srcSetupService.addSource(dataObj);
      if (resp) {
        this.is_show = true;
        this.ss_id = resp;
        dataObj['ss_id'] = this.ss_id;
        this.tabledata.push(dataObj['ss_id']);
        this._snackBar.open('Source system is added', 'close', {
          duration: 2000
        });
      }
    }

  }

  // all product methods
  async gotoProduct(stepper: MatStepper) {
    if (this.ruleDefService.action === 'edit') {
      this.prodList = [];
      const resp = await this.srcSetupService.getProducts(this.editsrcObj.ss_id);
      if (resp) {
        for (let i = 0; i < resp.length; i++) {
          resp[i]['is_disabled'] = true;
          this.prodList[i] = resp[i];
          if (i !== 0) {
            this.prod_id_str = '' + this.prod_id_str + ',' + resp[i].prod_id;
          } else {
            this.prod_id_str = '' + resp[i].prod_id;
          }
        }
        stepper.next();
      } else {
        this._snackBar.open('Error in getting Products', 'close', {
          duration: 2000
        });
      }
    } else {
      stepper.next();
    }

  }
  newProduct() {
    this.showNew = true;
  }


  deleteNewProd() {
    this.showNew = false;
  }
  makeEditableProd(index: number, row: Object) {
    this.prodList[index].is_disabled = false;
  }


  async addProduct(row: Object) {
    row['ss_id'] = this.ss_id;
    const resp = await this.srcSetupService.addProduct(row);
    if (resp) {
      row['is_disabled'] = true;
      row['prod_id'] = resp;
      this.prodList.push(row);
      // this.prod_id_str = '' + this.prod_id_str + ',' + resp;
      this.showNew = false;
      this.new_product = {
        prod_cd: '', prod_desc: '', dtl_prod_cd: '', dtl_prod_desc: '', off_balance_sheet_exposure_type: '',
        'credit_conversion_factor': '', is_disabled: false
      };
      this._snackBar.open('Product is added', 'close', {
        duration: 2000
      });
    }
  }

  async updateProd(index: number, row: Object) {
    const resp = await this.srcSetupService.updateProduct(row);
    if (resp) {
      this.prodList[index] = row;
      this.prodList[index].is_disabled = true;
      this._snackBar.open('Product  is updated', 'close', {
        duration: 2000
      });
    } else {
      this._snackBar.open('Error in product updation', 'close', {
        duration: 2000
      });
    }
  }

  async deleteProd(index, row) {
    const resp = await this.srcSetupService.deleteProduct(row);
    if (resp) {
      this.prodList.splice(index, 1);
      this._snackBar.open('Event  is deleted', 'close', {
        duration: 2000
      });
    }
  }

  // go to events
  async gotoEvents(stepper: MatStepper) {
    if (this.ruleDefService.action === 'edit') {
      this.eventList = [];
      const resp = await this.srcSetupService.getEvents(this.prod_id_str);
      if (resp) {
        for (let i = 0; i < resp.length; i++) {
          resp[i]['is_disabled'] = true;
          this.eventList[i] = resp[i];
        }
        stepper.next();
      } else {
        this._snackBar.open('Error in getting Events', 'close', {
          duration: 2000
        });
      }
    } else {
      stepper.next();
    }
  }

  newEvent() {
    this.showNewEvent = true;
  }
  deleteNewEvent() {
    this.showNewEvent = false;
  }
  makeEditableEvent(index: number, row: Object) {
    this.eventList[index].is_disabled = false;
  }

  // add new event
  async addEvent(row: Object) {
    const resp = await this.srcSetupService.addEvent(row);
    if (resp) {
      row['is_disabled'] = true;
      row['ev_id'] = resp;
      this.eventList.push(row);
      this.showNewEvent = false;
      this.new_event = { ev_name: '', screen_to_project: '', prod_id: '', is_disabled: false, is_saved: false };
      this._snackBar.open('Event  is added', 'close', {
        duration: 2000
      });
    }
  }
  // update event information
  async updateEvent(index: number, row: Object) {
    const resp = await this.srcSetupService.updateEvent(row);
    if (resp) {
      this.eventList[index] = row;
      this.eventList[index].is_disabled = true;
      this._snackBar.open('Event  is updated', 'close', {
        duration: 2000
      });
    }
  }

  // delete event from database
  async deleteEvent(index, row) {
    const resp = await this.srcSetupService.deleteEvent(row.ev_id);
    if (resp) {
      this.eventList.splice(index, 1);
    }
  }

  // route to rule builder
  async ruleRoute(index, row: Object) {
    const that = this;
    this.ruleDefService.clickedObj = row;
    that.ruleDefService.invokeRuleComp();
    $('#AddRuleModal').modal('show');
    this.loadRuleBuilder = 1;
  }

  resetStepper(stepper: MatStepper) {
    this.prodList = [];
    this.eventList = [];
    this.prod_id_str = '0';
    stepper.reset();
    $('#addModal').modal('hide');
  }

  // copy event code start from here
  async getExtProdList() {
    const res = await this.srcSetupService.getExtProdList(this.ent_cd);
    if (res) {
      this.ext_prod_arr = res;
    }
  }

  // selection of product
  async selectproduct(event) {
    const Obj = new Object();
    Obj['ent_cd'] = this.ent_cd;
    Obj['copyFrom'] = event.value.prod_id;
    Obj['copyTo'] = this.prodList[0].prod_id;
    Obj['dtl_prod_cd'] = this.prodList[0].dtl_prod_cd;
    this.copyObj = Obj;
  }

  // copy event list for product
  async copyEventList() {
    this.spinner.show();
    const respEvents = await this.srcSetupService.copyEvents(this.copyObj);
    if (respEvents) {
      for (let i = 0; i < respEvents.length; i++) {
        const row_obj = respEvents[i];
        this.event_id_arr[i] = respEvents[i].ev_id;
        row_obj['is_disabled'] = true;
        this.eventList.push(row_obj);
      }
      this._snackBar.open('Event  is copied', 'close', {
        duration: 2000
      });
      this.getRuleInfo(respEvents);
    }
  }

  // get Rule Information of copied event
  async getRuleInfo(eventObj) {
    for (let i = 0; i < this.event_id_arr.length; i++) {
      const ruleObj = await this.ruleDefService.getRuleSetStruct(eventObj[i]);
      if (ruleObj) {
        const resp1 = await this.makeValidJson(ruleObj);
        if (resp1) {
          const ruleArray = [resp1];
          const str = JSON.stringify(ruleArray);
          const obj = new Object();
          obj['rulesetName'] = ruleObj.rulesetName;
          obj['ev_id'] = this.event_id_arr[i];
          obj['value'] = str;
          const resSave = await this.ruleDefService.updateDrl(obj);
          if (resSave) {
            console.log('updated', i);
          }
        }
      }
    }
    this.spinner.hide();
  }
  // make JSON for inserting into sql
  makeValidJson(Obj) {
    const testObj = Obj.rules[0]; // Array.from(this.ruleArr);
    for (let j = 0; j < testObj.when.rules.length; j++) {
      const regex = /"/g;
      if (testObj.when.rules[j].value !== undefined) {
        const str = testObj.when.rules[j].value.replace(regex, '\\\"');
        testObj.when.rules[j].value = str;
      }
      if (testObj.when.rules[j].lookupkey !== undefined) {
        const str = testObj.when.rules[j].lookupkey.replace(regex, '\\\"');
        testObj.when.rules[j].lookupkey = str;
      }
    }
    for (let k = 0; k < testObj.then.length; k++) {
      for (let l = 0; l < testObj.then[k].assignments.length; l++) {
        const regex = /"/g;
        if (testObj.then[k].assignments[l].value !== undefined) {
          const str1 = testObj.then[k].assignments[l].value.replace(regex, '\\\"');
          testObj.then[k].assignments[l].value = str1;
        }
        if (testObj.then[k].assignments[l].lookupkey !== undefined) {
          const str1 = testObj.then[k].assignments[l].lookupkey.replace(regex, '\\\"');
          testObj.then[k].assignments[l].lookupkey = str1;
        }
      }
    }
    return testObj;
  }

}
