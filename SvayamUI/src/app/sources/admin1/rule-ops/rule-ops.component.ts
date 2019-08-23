import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rule-ops',
  templateUrl: './rule-ops.component.html',
  styleUrls: ['./rule-ops.component.css']
})
export class RuleOpsComponent implements OnInit {

  constructor() { }
  rows = [];
  ngOnInit() {
    this.rows[0] = {id: 1, rule: 'IUE', incoming_records: 100, outgoing_records: 200};
    this.rows[1] = {id: 2, rule: 'IUE', incoming_records: 100, outgoing_records: 200};
  }

}
