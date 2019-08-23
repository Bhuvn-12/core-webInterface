import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QueryBuilderConfig } from 'angular2-query-builder-test';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RuleDefinitionService } from '../../../services/sources/admin1/rule-engine/rule-definition.service';
import { Router } from '@angular/router';
import {ConfirmBoxComponent} from '../../../layouts/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material';

declare var $: any;
@Component({
  selector: 'app-rule-builder',
  templateUrl: './rule-builder.component.html',
  styleUrls: ['./rule-builder.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RuleBuilderComponent implements OnInit {

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private ruleDefService: RuleDefinitionService,
    private router: Router, public dialog: MatDialog) {
         if (this.ruleDefService.action === undefined) {
          this.router.navigate(['/source/admin1']);
        }
  }
  // form control using get set value
  public ruleSet_Ctl = new FormControl();
  public iDataObj_ctl = new FormControl();
  public outDataObj_ctl = new FormControl();
  public ruleName_Ctl = new FormControl();
  public config: QueryBuilderConfig;
  public configthen: QueryBuilderConfig;
  ruleArr = [];
  iDataObjArr = ['MyTable', 'TestTable', 'TestTable2'];
  outputDataObject = ['Out1', 'Out2', 'Out3'];
  // view control varial
  showRuleSet = true;
  showRule = false;
  is_disabled = false;
  dataObj = { inputDataObj: '', rulesetName: '', ent_cd: '', ev_id: '', rules: [] };
  curr_ruleObj;
  current_thenObj = { action: '', ruleIndex: '', thenIndex: '' };
  current_whenObj = { action: '', ruleIndex: '' };
  dataModel;
  ent_cd;
  testObj;
  current_req_action;
  public query = {
    condition: 'and',
    rules: [
    ]
  };
  public querythen = {
    rules: [
    ]
  };

  async ngOnInit() {
    this.initilization();
    this.ruleDefService.RefreshRule.subscribe(is_true => {
      this.initilization();
    });
  }


  async initilization() {
    this.setConfig('');
    this.setConfigthen('');
    this.dataModel = this.ruleDefService.dataModel;
    this.iDataObjArr = this.ruleDefService.dataObjArr;
    this.outputDataObject = this.ruleDefService.dataObjArr;
    if (this.ruleDefService.action === 'edit') {
      const Obj = new Object();
      Obj['ev_id'] = this.ruleDefService.clickedObj.ev_id;
      Obj['ev_name'] = this.ruleDefService.clickedObj.ev_name;
      const respObj = await this.ruleDefService.getRuleSetStruct(Obj);
      if (respObj) {
        this.dataObj = respObj;
        this.ruleSet_Ctl.setValue(this.dataObj.rulesetName);
        if (this.dataObj.rules[0] !== undefined) {
          this.current_req_action = 'edit';
          this.iDataObj_ctl.setValue(this.dataObj.rules[0].inputDataObj);
          this.ruleDefService.drivedKeyArr = [];
          this.ruleDefService.drivedKeyArr = this.ruleDefService.dataModel[this.iDataObj_ctl.value];
        } else {
          this.current_req_action = 'add';
        }
        this.showRule = true;
        this.makeArrayStruct();
        //  make drive array from input data object
        this.ruleDefService.drivedKeyArr = [];
        this.ruleDefService.drivedKeyArr = this.ruleDefService.dataModel[this.iDataObj_ctl.value];
      }
    }
    if (this.ruleDefService.action === 'add') {
      console.log(this.ruleDefService.clickedObj.ev_id);
      this.dataObj = { inputDataObj: '', rulesetName: '', ent_cd: '', ev_id: this.ruleDefService.clickedObj.ev_id, rules: [] };
      this.ruleArr = [];
    }
  }

  setConfig(iDataObj) {
    let attributes = [];
    if (iDataObj === '' || iDataObj === undefined) {
      attributes = [];
    } else {
      attributes = [];
      attributes = this.dataModel[iDataObj];
    }
    const when_fields = {};
    attributes.map((e) => {
      when_fields[e] = {
        name: e, type: 'category', options: attributes.map(a => {
          return { name: a, value: a };
        }), operators: ['==', '!=']
      };
    });
    this.config = { fields: when_fields };
  }

  setConfigthen(outDataObj) {
    let attributes = [];
    if (outDataObj === '' || outDataObj === undefined) {
      attributes = [];
    } else {
      attributes = this.dataModel[outDataObj];
    }
    const then_fields = {};
    attributes.map((e) => {
      then_fields[e] = {
        name: e, type: 'category', options: attributes.map(a => {
          return { name: a, value: a };
        }), operators: ['=', '!=']
      };
    });
    this.configthen = { fields: then_fields };
  }

  createRuleSet() {
    this.showRuleSet = true;
  }
  RuleSetObj() {
    if (!this.ruleSet_Ctl.invalid && !this.iDataObj_ctl.invalid) {
      this.dataObj['rulesetName'] = this.ruleSet_Ctl.value;
      this.dataObj['inputDataObj'] = this.iDataObj_ctl.value;
      if (this.ruleArr.length === 0) {
        this.ruleArr.push({
          ruleName: this.ruleSet_Ctl.value, inputDataObj: this.iDataObj_ctl.value,
          when: { condition: 'and', rules: [] }, then: []
        });
      } else {
        this.ruleArr[0]['ruleName'] = this.ruleSet_Ctl.value;
      }

    }
  }

  // selection change of input Data Object
  selectIDataObj(event) {
    if (this.ruleArr.length !== 0) {
      this._snackBar.open('You can not Change inputDataObject', 'close', {
        duration: 2000
      });
      this.iDataObj_ctl.setValue(this.dataObj.inputDataObj);
    } else {
      console.log('inside change');
      this.ruleDefService.drivedKeyArr = [];
      this.ruleDefService.drivedKeyArr = this.ruleDefService.dataModel[this.iDataObj_ctl.value];
      this.dataObj['inputDataObj'] = event.value;
      this.setConfig(event.value);
    }
  }

  // call when edit and add
  callWhen(ruleObj, ruleIndex) {
    this.setConfig(this.iDataObj_ctl.value);
    this.query = {
      condition: 'and',
      rules: [],
    };
    this.curr_ruleObj = ruleObj;
    this.current_whenObj = { action: 'add', ruleIndex: ruleIndex };
    $('#whenModal').addClass('show');
    $('#whenModal').css('display', 'block');
  }

  // call then add and edit
  callThen(ruleObj, ruleIndex) {
    this.setConfigthen(this.outputDataObject[0]);
    this.outDataObj_ctl.setValue(this.outputDataObject[0]);
    this.querythen = {
      rules: [],
    };
    this.curr_ruleObj = ruleObj;
    this.current_thenObj['action'] = 'add';
    this.current_thenObj['ruleIndex'] = ruleIndex;
    $('#thenModal').addClass('show');
    $('#thenModal').css('display', 'block');
  }

  // save when add and edit
  saveWhen() {
    const ruleIndex = this.current_whenObj.ruleIndex;
    const localwhenq = this.query;
    this.ruleArr[ruleIndex].when = localwhenq;
    this.closeWhen();
  }

  // save then add and edit
  saveThen() {
    const outObj = this.outDataObj_ctl.value;
    const ruleIndex = this.current_thenObj['ruleIndex'];
    const thenIndex = this.current_thenObj['thenIndex'];
    if (this.current_thenObj['action'] === 'add') {
      this.ruleArr[ruleIndex].then.push({ outputDataObject: outObj, assignments: this.querythen.rules });
    } else {
      this.ruleArr[ruleIndex].then.splice(thenIndex, 1, { outputDataObject: outObj, assignments: this.querythen.rules });
    }
    this.closeThen();
  }

  // check rule name is valid or not
  checkUniqueness(ruleName) {
    let check = true;
    for (let i = 0; i < this.ruleArr.length; i++) {
      if (this.ruleArr[i].ruleName === ruleName) {
        check = false;
        break;
      }
    }
    return check;
  }

  // Edit when if Exist otherwise create when
  editWhen(ruleObj, ruleIndex) {
    this.setConfig(this.ruleArr[ruleIndex].inputDataObj);
    this.query = {
      condition: 'and',
      rules: [],
    };
    this.current_whenObj = { action: 'edit', ruleIndex: ruleIndex };
    let condition = 'and';
    if (this.ruleArr[ruleIndex].when.condition !== undefined) {
      condition = this.ruleArr[ruleIndex].when.condition;
    }
    this.query['condition'] = condition;
    this.query['rules'] = this.ruleArr[ruleIndex].when.rules;
    $('#whenModal').addClass('show');
    $('#whenModal').css('display', 'block');
  }

  // edit then perticular condition
  editThen(ruleIndex, thenIndex) {
    this.setConfigthen(this.ruleArr[ruleIndex].then[thenIndex].outputDataObject);
    this.current_thenObj = { action: 'edit', ruleIndex: ruleIndex, thenIndex: thenIndex };
    this.querythen = {
      rules: []
    };
    this.querythen.rules = this.ruleArr[ruleIndex].then[thenIndex].assignments;
    $('#thenModal').addClass('show');
    $('#thenModal').css('display', 'block');
    this.outDataObj_ctl.setValue(this.ruleArr[ruleIndex].then[thenIndex].outputDataObject);
  }


  // delete then from list
  deletethen(ruleIndex, thenIndex) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ruleArr[ruleIndex].then.splice(thenIndex, 1);
      }
    });
  }

  // make Array structure
  makeArrayStruct() {
    this.ruleArr = [];
    const arr = Array.from(this.dataObj.rules);
    this.ruleArr = arr;
  }

  // selection change output Data Object
  selectOutDataObj(event) {
    const obj = event.value;
    this.setConfigthen(obj);
  }

  // save in DataBase
  async saveRuleSet() {
    const resp = await this.makeValidJson();
    if (resp) {
      const str = JSON.stringify(resp);
      const obj = new Object();
      obj['rulesetName'] = this.dataObj.rulesetName;
      obj['ev_id'] = this.ruleDefService.clickedObj.ev_id;
      obj['value'] = str;
      console.log(obj);
      if (this.ruleDefService.action === 'edit') {
        console.log('indise 1 st edit', this.current_req_action);
        if (this.current_req_action === 'add') {
          const resSave = await this.ruleDefService.createDrl(obj);
          if (resSave) {
            $('#AddRuleModal').modal('hide');
          }
        } else {
          const resSave = await this.ruleDefService.updateDrl(obj);
          if (resSave) {
            $('#AddRuleModal').modal('hide');
          }
        }
      } else {
        console.log('indise 1 st add');
        const resSave = await this.ruleDefService.createDrl(obj);
        if (resSave) {
          $('#AddRuleModal').modal('hide');
        }
      }
    }
  }

  // make JSON for inserting into sql
  makeValidJson() {
    console.log(this.ruleArr);
    const testArr = JSON.parse(JSON.stringify(this.ruleArr)); // Array.from(this.ruleArr);
    for (let i = 0; i < testArr.length; i++) {
      for (let j = 0; j < testArr[i].when.rules.length; j++) {
        const regex = /"/g;
        if (testArr[i].when.rules[j].value !== undefined ) {
          const str = testArr[i].when.rules[j].value.replace(regex, '\\\"');
          testArr[i].when.rules[j].value = str;
        }
        if (testArr[i].when.rules[j].lookupkey !== undefined) {
          const str = testArr[i].when.rules[j].lookupkey.replace(regex, '\\\"');
          testArr[i].when.rules[j].lookupkey = str;
        }
      }
      for (let k = 0; k < testArr[i].then.length; k++) {
        for (let l = 0; l < testArr[i].then[k].assignments.length; l++) {
          const regex = /"/g;
          if (testArr[i].then[k].assignments[l].value !== undefined ) {
            const str1 = testArr[i].then[k].assignments[l].value.replace(regex, '\\\"');
            testArr[i].then[k].assignments[l].value = str1;
          }
          if (testArr[i].then[k].assignments[l].lookupkey !== undefined) {
            const str1 = testArr[i].then[k].assignments[l].lookupkey.replace(regex, '\\\"');
            testArr[i].then[k].assignments[l].lookupkey = str1;
          }
        }
      }
    }
    return testArr;
  }
  closeWhen() {
    $('#whenModal').removeClass('show');
    $('#whenModal').css('display', 'none');
  }
  closeThen() {
    $('#thenModal').removeClass('show');
    $('#thenModal').css('display', 'none');
  }

  // delete rule from list
  deleteRule(index): void {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this rule?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ruleArr.splice(index, 1);
      }
    });
  }

}
