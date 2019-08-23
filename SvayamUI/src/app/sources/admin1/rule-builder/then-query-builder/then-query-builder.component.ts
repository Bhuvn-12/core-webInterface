import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QueryBuilderComponent} from 'angular2-query-builder-test';
import {LookupService} from '../../../../services/sources/admin1/lookupObject/lookup.service';
import { RuleDefinitionService } from '../../../../services/sources/admin1/rule-engine/rule-definition.service';
@Component({
  selector: 'app-then-query-builder',
  templateUrl: './then-query-builder.component.html',
  styleUrls: ['./then-query-builder.component.css']
})
export class ThenQueryBuilderComponent extends QueryBuilderComponent implements OnInit {

  constructor(private ref: ChangeDetectorRef, private lookupService: LookupService,
    private ruleDefService: RuleDefinitionService) {
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
    return ['='];
  }

}
