import { Component, OnInit } from '@angular/core';
import { OperationsService } from '../services/operations/operations.service';
import { AppService } from '../app.service';
import { interval } from 'rxjs/internal/observable/interval';
import { startWith, switchMap, endWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  constructor(private operationService: OperationsService, private appService: AppService) {
  }
  ppdctl = new FormControl();
  currPpd = 'PPD Error';
  ppdArr = [];
  status = [];
  count = [];
  ent_cd;
  statusObj = new Map<String, String>();
  countObj = new Map<any, any>();
  selectedPpd;
  intervalObj;
  async ngOnInit() {
    const res = await this.operationService.getPpd();
    if (res['error'] !== true) {
      const data = res.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].isCurrent === 1) {
          this.selectedPpd = data[i].ppd;
          this.currPpd = data[i].ppd;
        }
        this.ppdArr[this.ppdArr.length] = data[i].ppd;
      }
      this.ent_cd = this.appService.ent_cd;
      this.ppdctl.setValue(this.selectedPpd);
      await this.getPpdCount();
      await this.getStatus(this.ent_cd);
      await this.buildMap();
    }
    this.intervalObj = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.continousRequest())).subscribe(result => {
        });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    if (this.intervalObj !== undefined) {
      this.intervalObj.unsubscribe();
    }
  }

  async continousRequest() {
    await this.getPpdCount();
    await this.getStatus(this.ent_cd);
    const resp = await this.buildMap();
    return resp;
  }
  async activate(row) {
    const obj = new Object;
    obj['ent_cd'] = this.ent_cd;
    obj['process_name'] = row;
    obj['activity'] = 'Activate';
    const res = await this.operationService.changeProcessState(obj);
    await this.getStatus(this.ent_cd);
    await this.buildMap();

  }
  async deactivate(row) {
    const obj = new Object();
    obj['ent_cd'] = this.ent_cd;
    obj['process_name'] = row;
    obj['activity'] = 'Deactivate';
    const res = await this.operationService.changeProcessState(obj);
    await this.getStatus(this.ent_cd);
    await this.buildMap();

  }
  async changePpd(event) {
    this.selectedPpd = event.target.value;
    await this.getPpdCount();
    await this.getStatus(this.ent_cd);
    await this.buildMap();
  }
  async getPpdCount() {
    let obj = new Object();
    obj = { ent_cd: this.ent_cd, ppd: this.selectedPpd };
    const res = await this.operationService.getCount(obj);
    this.count = res.data;
  }
  async getStatus(ent_cd) {
    const res = await this.operationService.getStatus(ent_cd);
    this.status = res.data;
  }
  async buildMap() {
    for (let i = 0; i < this.status.length; i++) {
      if (this.status[i].is_active === 'true') {
        this.statusObj.set(this.status[i].process_name, 'Active');
      } else {
        this.statusObj.set(this.status[i].process_name, 'Inactive');
      }
      this.countObj.set(this.status[i].process_name, 0);
    }
    this.countObj.set('jsf', 0);
    this.countObj.set('rsf0', 0);
    this.countObj.set('rsf1', 0);
    this.countObj.set('rsf2', 0);
    this.countObj.set('rsf3', 0);
    this.countObj.set('rsf4', 0);
    this.countObj.set('rsf5', 0);
    for (let j = 0; j < this.count.length; j++) {
      this.countObj.set(this.count[j].name, this.count[j].num_of_records);
    }
  }
}
