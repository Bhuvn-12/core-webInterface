import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {AppService} from '../../../../app.service';
import {ProductsService  } from 'src/app/services/settings/configuration/products/products.service';
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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns: string[] = [ 'lvl1_cd', 'lvl1_desc', 'lvl2_cd', 'lvl2_desc', 'lvl3_cd', 'lvl3_desc', 'edit', 'delete'];
  dataSource: MatTableDataSource<AcctData>;

  constructor(private router: Router, private productService: ProductsService,
    private appService: AppService, ) {
    this.httpUrl = this.productService.httpUrl;
  }
  httpUrl;
  ent_cd;
  data;
  lvl3_cd;
  is_edit = true;
  is_save = false;
  productInfo;
  clicked_row;
  async ngOnInit() {
   this.ent_cd = this.appService.ent_cd;
    this.productInfo = await this.productService.getproductDetails( this.ent_cd );
    if (this.productInfo) {
      this.data = this.productInfo;
      for (let i = 0; i < this.data.length ; i++) {
        this.data[i]['editable'] = false;
      }
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    }

    }

  async deleteRow(rowData, index) {
    console.log(rowData);
    const res = await this.productService.delete(rowData);
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
    const res = await this.productService.editsave(Obj);
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
