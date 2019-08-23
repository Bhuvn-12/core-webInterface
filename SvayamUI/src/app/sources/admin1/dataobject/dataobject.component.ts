import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DataObjectService} from '../../../services/sources/admin1/dataObject/data-object.service';

declare var $: any;
@Component({
  selector: 'app-dataobject',
  templateUrl: './dataobject.component.html',
  styleUrls: ['./dataobject.component.css']
})
export class DataobjectComponent implements OnInit {

  submitType: String = 'Save';
  selectedObj;
  dataObjForm: FormGroup;
  submitted = false;
  showNew: Boolean = false;
  newrow = {  col_seq_no: '', column_name: '', column_desc: '', column_type: '', is_disabled: false};

  constructor(private formBuilder: FormBuilder, private dataObjectService: DataObjectService) { }

  rows = [];
  dataObjects;
  keyArr;
  ent_cd;

  async ngOnInit() {
    this.dataObjForm = this.formBuilder.group({
      dataObjName: ['', Validators.required],
    });

    this.getDataObject();
  }

  async getDataObject() {
    this.dataObjects = await this.dataObjectService.getDataObject(this.ent_cd);
    if (this.dataObjects) {
      this.keyArr = Object.keys(this.dataObjects);
    }
    this.pushObject(this.keyArr[0]);
  }
  // make row array of selected data object
  pushObject(keyName) {
    this.selectedObj = this.dataObjects[keyName][0];
    this.rows = [ ];
    for ( let i = 0; i < this.dataObjects[keyName].length; i++) {
      let obj = new Object();
      obj = this.dataObjects[keyName][i];
      obj['is_disabled'] = true;
      this.rows.push(obj);
    }
  }

  // open modal for new data object details
  newDataObject() {
    $('#dataObjModal').modal('show');
  }

  // make new data object
  async saveDataObject() {
    this.submitted = true;
    if (this.dataObjForm.invalid) {
      return;
    } else {
      const objName = this.dataObjForm.get('dataObjName').value;
      const resp = await this.dataObjectService.saveDataObject(this.ent_cd, objName);
      if (resp) {
        const dataObj = new Object();
        dataObj['model_name'] = objName;
        dataObj['model_id'] = resp;
        this.dataObjects[objName] = [dataObj];
        this.selectedObj = dataObj;
        this.keyArr.push(objName);
        $('#dataObjModal').modal('hide');
        this.rows = [];
      }

    }
  }

  // make a row for add data object
  newColumn() {
    this.showNew = true;
  }

  // make row editable
  async makeEditable(index: number, row: Object) {
    this.rows[index].is_disabled = false;
    console.log(this.rows);
  }

  // delete from database
  async deleteColumn(index: number, row: Object) {
    const resp = await this.dataObjectService.deleteColumn(this.ent_cd, row);
    if (resp) {
      this.rows.splice(index, 1);
    }
  }

  // save edited changes in database
  async saveChange(index: number, row: Object) {
    const resp = await this.dataObjectService.updateColumn(this.ent_cd, row);
    if (resp) {
      this.rows[index] = row;
      this.rows[index].is_disabled = true;
    }
  }

  // delete addable row without save
  deleteNew() {
    this.showNew = false;
  }

  // add new column in selected data object
  async addColumn( row: Object) {
    row['model_id'] = this.selectedObj.model_id;
    row['model_name'] = this.selectedObj.model_name;
    row['is_nullable'] = 0;
    const resp = await this.dataObjectService.insertColumn(this.ent_cd, row);
    if (resp) {
    row['is_disabled'] = true;
    row['id'] = resp;
    if (this.dataObjects[this.selectedObj.model_name].length  === 1) {
      this.rows[0] = row;
      this.dataObjects[this.selectedObj.model_name][0] = row;
    } else {
      this.dataObjects[this.selectedObj.model_name].push(row);
    }
    this.showNew = false;
    }
  }

  // show selected data Object
  showDataObject (index, key) {
    this.pushObject(key);
  }

  get f() { return this.dataObjForm.controls; }
}
