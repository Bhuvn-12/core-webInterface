import { Component, OnInit , ViewChild} from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {AppService} from '../../../../app.service';
import {AccountDetailsService  } from 'src/app/services/settings/configuration/account_details/account-details.service';
import { Router } from '@angular/router';


declare var $: any;

export interface AcctData {
  lvl1_cd: string;
  lvl1_desc: string;
  lvl2_cd: string;
  lvl2_desc: string;
  lvl3_cd: string;
  lvl3_desc: string;
  lvl4_cd: string;
  lvl4_desc: string;

}


@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns: string[] = [ 'lvl1_cd', 'lvl1_desc', 'lvl2_cd', 'lvl2_desc', 'lvl3_cd', 'lvl3_desc',
   'lvl4_cd', 'lvl4_desc', 'edit', 'delete'];
  dataSource: MatTableDataSource<AcctData>;

  constructor(private router: Router, private accountdetailService: AccountDetailsService,
    private appService: AppService, ) {
    this.httpUrl = this.accountdetailService.httpUrl;
  }
// @Output() personListChange = new EventEmitter<AcctData[]>();
  httpUrl;
  ent_cd;
  data = [];
  actions;
  is_edit = true;
  is_save = false;
  accountInfo;
  lvl3_cd;
  clicked_row;
  async ngOnInit() {
    this.ent_cd = this.appService.ent_cd;
    this.accountInfo = await this.accountdetailService.getaccountDetails( this.ent_cd );
    if (this.accountInfo) {
      this.data = this.accountInfo;
      for (let i = 0; i < this.data.length ; i++) {
         this.data[i]['editable'] = false;
      }
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    }
 }
  async deleteRow(rowData, index) {
    console.log(rowData);
    const res = await this.accountdetailService.delete(rowData);
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
    const res = await this.accountdetailService.editsave(Obj);
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
