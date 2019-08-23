import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LookupService } from '../../../services/sources/admin1/lookupObject/lookup.service';
declare var $: any;
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})
export class LookupComponent implements OnInit {
  lookupForm: FormGroup;
  lookupObjectForm: FormGroup;
  key_column_ctl = new FormControl();
  value_column_ctl = new FormControl();
  submitted = false;
  submitted1 = false;
  selctedObject = {lookup_id: '', lookup_name: '', lookup_sub_type: ''};
  constructor(private formBuilder: FormBuilder, private lookupService: LookupService) { }

  // variable to create form input dynamically
  listArr = [];
  lookupArr = [];
  lookup_cat = [];
  lookup_sub_cat = [];
  columnList = [];
  keyValCols = [];
  // variables for updating and switching between choices
  input_obj;
  selected_cat_obj;
  slected_sub_cat_obj;
  lookup_obj;
  is_disabled = true;
  FormObj = {};
  is_formshow = false;
  action;
  is_nextClicked = false;
  sendObj;
  lookup_sub_type;
  keyValArr = [];
  keyArr = [];
  valArr = [];
  async ngOnInit() {
    // lookup Object Form
    this.lookupForm = this.formBuilder.group({
      lookup_name: ['', Validators.required],
      lookup_sub_type: ['', Validators.required]
    });
    const respobj = await this.getlookups();
    if (respobj) {
      this.getlookupInfo(this.selctedObject);
    }
  }

  // get lookup object list
  async getlookups() {
    const resp = await this.lookupService.getlookups();
    if (resp) {
      this.lookupArr = resp;
      this.selctedObject = this.lookupArr[0];
      return true;
    } else {
      return false;
    }
  }

  // get columns list
  async getlookupInfo(lookupobj) {
    const respinfo = await this.lookupService.getlookupInfo(lookupobj);
    if (respinfo) {
      this.columnList = [];
      this.FormObj = {};
      this.lookup_obj = respinfo[0];
      if (this.lookup_obj !== undefined) {
        if (this.selctedObject.lookup_sub_type === 'MANUAL') {
            const res_lookup_Obj = JSON.parse(this.lookup_obj.static_data);
            this.keyArr = this.keyValArr = Object.keys(res_lookup_Obj);
            for (let i = 0; i < this.keyArr.length; i++) {
              this.valArr[i] = res_lookup_Obj[this.keyArr[i]];
            }
            this.lookup_sub_type = lookupobj.lookup_sub_type;
            this.selctedObject = lookupobj;
        } else {
          this.columnList = Object.keys(this.lookup_obj);
          this.makeArrayStruct();
          this.lookupObjectForm = this.formBuilder.group(this.FormObj);
          const setValObj = new Object();
          for (let i = 0; i < this.columnList.length; i++) {
            setValObj[this.columnList[i]] = this.lookup_obj[this.columnList[i]];
          }
          this.selctedObject = lookupobj;
          this.lookup_sub_type = this.selctedObject.lookup_sub_type;
          this.lookupObjectForm.setValue(setValObj);
          this.is_nextClicked = true;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  // check validation for dynamic created form
  is_Invalid(name) {
    return this.lookup_info[name].errors;
  }

  // create new lookup
  async createLookup() {
    this.submitted = false;
    this.submitted1 = false;
    this.is_disabled = false;
    this.is_nextClicked = false;
    this.lookupForm.reset();
    const resinput = await this.lookupService.getlookuInputs();
    if (resinput) {
      this.input_obj = resinput;
      this.lookup_sub_cat = Object.keys(this.input_obj);
      $('#lookupObjModal').modal('show');
      this.action = 'add';
    }
  }

  // lookup_meta
  get lookup_meta() { return this.lookupForm.controls; }
  get lookup_info() { return this.lookupObjectForm.controls; }
  // on change sub cat selection
  subSelection(event) {
    this.FormObj = {};
    this.columnList = [];
    this.lookup_sub_type = event.target.value;
    // line added to hide and show view form
    this.selctedObject['lookup_sub_type'] = event.target.value;
    this.columnList = this.input_obj[event.target.value];
    this.makeArrayStruct();
    this.lookupObjectForm = this.formBuilder.group(this.FormObj);
  }

  // store lookup Object and get columns from database
  saveLookup() {
    this.submitted1 = true;
    if (this.lookupForm.invalid) {

      return;
    } else {
      this.makeArrayStruct();
      this.lookupObjectForm = this.formBuilder.group(this.FormObj);
      $('#lookupObjModal').modal('hide');
    }

  }

  // insert data in database
  async getKeyValueCols() {
    this.submitted = true;
    if (this.lookupObjectForm.invalid) {
      return;
    } else {
      // send data to backend
      this.sendObj = new Object();
      for (let i = 0; i < this.columnList.length; i++) {
        this.sendObj[this.columnList[i]] = this.lookupObjectForm.get(this.columnList[i]).value;
      }
      if (this.action === 'add') {
        this.sendObj['lookup_name'] = this.lookupForm.get('lookup_name').value;
        this.sendObj['lookup_sub_type'] = this.lookupForm.get('lookup_sub_type').value;
        const respkey = await this.lookupService.getMySQLtableCols(this.sendObj);
        if (respkey) {
          this.is_nextClicked = true;
          this.keyValCols = [];
          this.keyValCols = respkey;
          this.key_column_ctl.setValue(this.keyValCols[0]);
          this.value_column_ctl.setValue(this.keyValCols[0]);
        }
      }
      if (this.action === 'edit') {
        this.sendObj['lookup_id'] = this.selctedObject.lookup_id;
        const respkey = await this.lookupService.getMySQLtableCols(this.sendObj);
        if (respkey) {
          this.is_nextClicked = true;
          this.keyValCols = [];
          this.keyValCols = respkey;
        }
      }
    }
  }

  // insert mysql lookup into database
  async insertLookUpMysql() {
    this.sendObj['key_column'] = this.key_column_ctl.value;
    this.sendObj['value_column'] = this.value_column_ctl.value;
    if (this.action === 'add') {
      const respin = await this.lookupService.postlookupObject(this.sendObj);
      if (respin) {
        const pushObj = {lookup_id: '' , lookup_name: '', lookup_sub_type: ''};
        pushObj['lookup_name'] = this.sendObj['lookup_name'];
        pushObj['lookup_id'] = respin;
        pushObj['lookup_sub_type'] = this.sendObj['lookup_sub_type'];
        this.lookupArr.push(pushObj);
        this.selctedObject = pushObj;
        this.is_disabled = true;
      }
    } else {
      this.sendObj['lookup_id'] = this.selctedObject.lookup_id;
      const respup = await this.lookupService.updatelookupObject(this.sendObj);
      if (respup) {
        this.is_disabled = true;
        // this.is_nextClicked = false;
        this.lookup_sub_type = '';
      }
    }
  }

  // edit data
  editDataMysql() {
    this.action = 'edit';
    this.is_nextClicked = false;
    this.lookup_sub_type = this.selctedObject.lookup_sub_type;
    this.is_disabled = false;
  }
  // show selected lookup details
  async showDetails(obj) {
    this.is_disabled = true;
    this.selctedObject = obj;
    this.is_nextClicked = true;
    this.lookup_sub_type = obj.lookup_sub_type;
    this.getlookupInfo(obj);
  }

  // insert Hbase lookup in database
  async insertLookUpHbase() {
    this.submitted = true;
    if (this.lookupObjectForm.invalid) {
      return;
    } else {
      // send data to backend
      const sendObj = new Object();
      for (let i = 0; i < this.columnList.length; i++) {
        sendObj[this.columnList[i]] = this.lookupObjectForm.get(this.columnList[i]).value;
      }

      if (this.action === 'add') {
        sendObj['lookup_name'] = this.lookupForm.get('lookup_name').value;
        sendObj['lookup_sub_type'] = this.lookupForm.get('lookup_sub_type').value;
        const respin = await this.lookupService.postlookupObject(sendObj);
        if (respin) {
          const pushObj = {lookup_id: '' , lookup_name: '', lookup_sub_type: ''};
          pushObj['lookup_name'] = sendObj['lookup_name'];
          pushObj['lookup_id'] = respin;
          pushObj['lookup_sub_type'] = sendObj['lookup_sub_type'];
          this.lookupArr.push(pushObj);
          this.selctedObject = pushObj;
          this.is_disabled = true;
        }
      }
      if (this.action === 'edit') {
        sendObj['lookup_id'] = this.selctedObject.lookup_id;
        const respup = await this.lookupService.updatelookupObject(sendObj);
        if (respup) {
          this.is_disabled = true;
        }
      }
    }
  }

  // edit hbase lookup
  editDataHbase() {
    this.action = 'edit';
    this.is_disabled = false;
  }

  // delete lookup from database
  async deleteLookup() {
    let index = 0;
    for (let i = 0; i < this.lookupArr.length; i++) {
      if (this.selctedObject.lookup_id === this.lookupArr[i].lookup_id) {
        index = i;
        break;
      }
    }
    const respdel = await this.lookupService.deletelookupObject(this.selctedObject);
    if (respdel) {
      this.lookupArr.splice(index, 1);
      this.selctedObject = this.lookupArr[0];
      this.getlookupInfo(this.selctedObject);
    }
  }

  // make array structure from given name
  makeArrayStruct() {
    this.FormObj = {};
    this.listArr = [];
    for (let i = 0; i < this.columnList.length;) {
      const b = [];
      this.FormObj[this.columnList[i]] = ['', Validators.required];
      b.push(this.columnList[i]);
      i = i + 1;
      if (i !== this.columnList.length) {
        this.FormObj[this.columnList[i]] = ['', Validators.required];
        b.push(this.columnList[i]);
        i = i + 1;
      }
      this.listArr.push(b);
    }
    this.is_formshow = true;
  }

  // add keyvalue
  addKeyValue() {
    const obj = new Object();
    this.keyValArr.push(obj);
  }
  deletekeyVal(index) {
    this.keyValArr.splice(index, 1);
  }
  async addEditManual() {
    const Obj = new Object();
    const dataObj = new Object();
    for (let i = 0; i < this.keyValArr.length; i++) {
      dataObj[this.keyArr[i]] = this.valArr[i];
    }
    Obj['static_data'] = JSON.stringify(dataObj);
    if (this.action === 'add') {
      Obj['lookup_name'] = this.lookupForm.get('lookup_name').value;
      Obj['lookup_sub_type'] = this.lookupForm.get('lookup_sub_type').value;
      const resp =  await this.lookupService.postlookupObject(Obj);
      if (resp) {
        console.log(resp);
      }
    } else {
      Obj['lookup_name'] = this.selctedObject.lookup_name;
      Obj['lookup_sub_type'] = this.selctedObject.lookup_sub_type;
      Obj['lookup_id'] = this.selctedObject.lookup_id;
      const resp =  await this.lookupService.updatelookupObject(Obj);
      if (resp) {
        console.log(resp);
      }
    }

  }
}
