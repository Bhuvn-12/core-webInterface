import { Injectable } from '@angular/core';
import {AppService} from '../../../app.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  httpUrl;

  constructor(private appservice: AppService, private http: HttpClient) {
    this.httpUrl = this.appservice.httpUrl + '/sources/status' ;
   }
   async getStausofLegalEntityy(myobj) {
     const resp = await this.http.get<any>( this.httpUrl + '/getstateofSrcSystem' + myobj).toPromise().then(res => {
       return res;

     });
     console.log(resp);
     if (!resp.error) {
       return resp.data;
     } else {
       return false;
     }
   }


}
