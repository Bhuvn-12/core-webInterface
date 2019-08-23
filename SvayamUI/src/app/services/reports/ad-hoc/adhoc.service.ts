import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppService} from '../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class AdhocService {

  httpUrl;
  column_obj;
  temurl;
  paramObj;
  constructor(private appService: AppService, private http: HttpClient) {
    this.httpUrl = this.appService.httpUrl + '/adhoc';
    this.temurl = this.appService.httpUrl;
   }

/* {
    dataSource: {
      filename: 'https://cdn.webdatarocks.com/data/data.csv'
    },
    slice: {
      rows: [{ uniqueName: 'Country' }],
      columns: [{ uniqueName: 'Measures' }],
      measures: [{ uniqueName: 'Price', aggregation: 'sum' }]
    }
  }; */
   async getColumns() {
    const resp = await this.http.get<any>(this.httpUrl + '/fetchallcolumns' ).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
   }

   async getData(obj) {
    const param = JSON.stringify(obj);
    const resp = await this.http.get<any>(this.httpUrl + '/getdata' + param).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
   }

   async getFileData() {
    const resp = await this.http.get(this.temurl + '/public/report2.json').toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (resp) {
      return resp;
    }
   }
}
