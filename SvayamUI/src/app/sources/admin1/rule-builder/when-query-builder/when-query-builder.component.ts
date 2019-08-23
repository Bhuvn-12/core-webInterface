import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QueryBuilderComponent} from 'angular2-query-builder-test';

import {LookupService} from '../../../../services/sources/admin1/lookupObject/lookup.service';
@Component({
  selector: 'app-when-query-builder',
  templateUrl: './when-query-builder.component.html',
  styleUrls: ['./when-query-builder.component.css']
})
export class WhenQueryBuilderComponent extends QueryBuilderComponent implements OnInit {

  constructor(ref: ChangeDetectorRef, private lookupService: LookupService) {
    super(ref);
  }
  lookups = [];
  ngOnInit() {
    this.getLookups();
  }
  async getLookups () {
    const resp = await this.lookupService.getlookups();
    if (resp) {
     this.lookups = resp;
    }
  }
  getInputType(type) {
    return type;

  }
  getFieldTemplate() {
    return null;
    }
  findTemplateForRule(rule) {
    return null;
  }
  getOperators() {
    return ['==', '!='];
  }


}
