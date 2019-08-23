import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ConfirmBoxComponent} from '../layouts/confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TestComponent implements OnInit {

  constructor( public dialog: MatDialog, private http: HttpClient) {
  }
  async ngOnInit() {
    const res = await this.http.get('http://127.0.0.1:3000/');
    console.log(res);
  }

}
