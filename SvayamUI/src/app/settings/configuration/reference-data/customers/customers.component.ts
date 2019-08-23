import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {AppService} from '../../../../app.service';
import {CustomersService  } from 'src/app/services/settings/configuration/customers/customers.service';
import { Router } from '@angular/router';


export interface AcctData {
  lvl1_cd: string;
  lvl1_desc: string;
  lvl2_cd: string;
  lvl2_desc: string;
  lvl3_cd: string;
  lvl3_desc: string;


}
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {


  displayedColumns: string[] = [ 'lvl1_cd', 'lvl1_desc', 'lvl2_cd', 'lvl2_desc', 'lvl3_cd', 'lvl3_desc', 'edit', 'delete'];
  dataSource: MatTableDataSource<AcctData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router: Router, private customerService: CustomersService,
    private appService: AppService, ) {
    this.httpUrl = this.customerService.httpUrl;
  }
  httpUrl;
  ent_cd;
  data;
  lvl3_cd;
  is_edit = true;
  is_save = false;
  customerInfo;
  clicked_row;
  async ngOnInit() {
    this.ent_cd = this.appService.ent_cd;
    this.customerInfo = await this.customerService.getcustomerDetails( this.ent_cd );
  if (this.customerInfo) {
    this.data = this.customerInfo;
    for (let i = 0 ; i < this.data.length ; i++) {
      this.data[i]['editable'] = false;
    }
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }
  }



  async deleteRow(rowData, index) {
    console.log(rowData);
    const res = await this.customerService.delete(rowData);
    if (res) {
      this.refreshdatasource(rowData, index, 'delete');
    }
  }

  async edit(rowData: any, index) {
    const is_editable = this.data[index]['editable'];
    if (is_editable) {
      this.data[index]['editable'] = false ;
    } else {
      this.data[index]['editable'] = true ;
    }
    this.clicked_row = rowData;
  }
  async save_edit(rowData, index) {
    const is_editable = this.data[index]['editable'];
    if (is_editable) {
      this.data[index]['editable'] = false ;
    } else {
      this.data[index]['editable'] = true ;
    }
    const Obj = new Object();
    Obj['old'] = this.clicked_row;
    Obj['new'] = rowData;
    console.log(Obj);
    const res = await this.customerService.editsave(Obj);
    if (res) {
      this.refreshdatasource(rowData, index, 'edit');
    }
  }
  refreshdatasource(row, index, action) {
    if (action === 'delete') {
      this.data.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.data);
    }
    if (action === 'edit') {
      this.data.splice(index, 1, row);
      this.dataSource = new MatTableDataSource(this.data);
    }
  }
}


