import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {AppService} from '../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class ManualService {

  httpUrl;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/sources/manual';
  }

  async getManualDetails(ent_cd) {
    const waitres = await this.http.get<any>(this.httpUrl + '/getsrcSystem' + ent_cd).toPromise().then(res => {
      return res;
    }, error => {
      return 0;
    });
    // console.log(waitres);
    if (waitres !== 0 || !waitres.error) {
      return waitres.data;
    } else {
      return 0;
    }
  }

  async getproductsandevents(ss_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/getproductsandevents' + ss_id ).toPromise().then(res => {
      // console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }


  async search(dataObj) {
    const obj = JSON.stringify(dataObj);
    const resp = await this.http.get<any>(this.httpUrl + '/searchSrc' + obj).toPromise().then(res => {
      // console.log(res);
      return res;
    }, (err: HttpErrorResponse) => {
      if (err instanceof Error) {
        console.log('Client-side error occured.');
        return false;
      } else {
       console.log('Server-side error occured.');
        return false;
      }
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }



  async postEvents(dataObj) {
    const resp = await this.http.post<any>(this.httpUrl + '/postevent', dataObj).toPromise().then(res => {
      // console.log(res);
      return res;
    }, (err: HttpErrorResponse) => {
      if (err instanceof Error) {
        console.log('Client-side error occured.');
        return false;
      } else {
       console.log('Server-side error occured.');
        return false;
      }
    });
    if (!resp.error) {
     return resp;
    } else {
      return false;
    }
  }
  async getCountry() {
    const resp = await this.http.get<any>(this.httpUrl + '/getCountryInfo').toPromise().then(res => {
      return res;
    }, (err: HttpErrorResponse) => {
      if (err instanceof Error) {
        console.log('Client-side error occured.');
        return false;
      } else {
        console.log('Server-side error occured.');
        return false;
      }
    });
    if (!resp.error) {
      return resp.data;
    }
  }


  async getPartyDtlType(ent_cd) {
    const resp = await this.http.get<any>(this.httpUrl + '/getAllAssignedParties' + ent_cd).toPromise().then(res => {
      return res;
    }, (err: HttpErrorResponse) => {
      if (err instanceof Error) {
        console.log('Client-side error occured.');
        return false;
      } else {
        console.log('server side error');
       console.log(err);
        return false;
      }
    });
    if (!resp.error) {
      // console.log(resp);
      return resp.data;
    }
  }
  async demoStart(Obj) {
    Obj['ent_cd'] = this.appService.ent_cd;
    const resp = await this.http.post<any>(this.httpUrl + '/startdemosrc', Obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async demoStop(Obj) {
    Obj['ent_cd'] = this.appService.ent_cd;
    const params =  JSON.stringify(Obj);
    const resp = await this.http.delete<any>(this.httpUrl + '/stopdemosrc' + params ).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }



}
