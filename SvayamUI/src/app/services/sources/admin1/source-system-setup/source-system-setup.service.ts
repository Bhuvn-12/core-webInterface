import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {AppService} from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class SourceSystemSetupService {
  httpUrl;
  ind_id;
  editsrcObj;
  clickedObj;
  constructor(private http: HttpClient, private appService: AppService ) {
    this.httpUrl = this.appService.httpUrl  +  '/source';
  }

  async addSource(dataObj) {
    dataObj['ent_cd'] =  this.appService.ent_cd;
    const resp = await this.http.post<any>(this.httpUrl + '/addsrcsystem', dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async updateSource(dataObj) {
    dataObj['ent_cd'] =  this.appService.ent_cd;
    const resp = await this.http.put<any>(this.httpUrl + '/updatesrcsystem', dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async getProducts(ss_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/getproducts' + ss_id).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async addProduct(dataObj) {
    dataObj['ent_cd'] =  this.appService.ent_cd;
    const resp = await this.http.post<any>(this.httpUrl + '/addproducts', dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async updateProduct(dataObj) {
    dataObj['ent_cd'] =  this.appService.ent_cd;
    const resp = await this.http.put<any>(this.httpUrl + '/updateproduct', dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async deleteProduct(dataObj) {
    const resp = await this.http.delete<any>(this.httpUrl + '/' + dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async getEvents(prod_id) {
    const resp = await this.http.get<any>(this.httpUrl + '/getevents' + prod_id).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
  async addEvent(dataObj) {
    dataObj['ent_cd'] =  this.appService.ent_cd;
    const resp = await this.http.post<any>(this.httpUrl + '/addevents', dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async updateEvent(dataObj) {
    dataObj['ent_cd'] =  this.appService.ent_cd;
    const resp = await this.http.put<any>(this.httpUrl + '/updateevent', dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async deleteEvent(dataObj) {
    const resp = await this.http.delete<any>(this.httpUrl + '/deleteEvent' + dataObj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async getExtProdList(obj) {
    const resp = await this.http.get<any>(this.httpUrl + '/productslist' + obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }

  async copyEvents(obj) {
    const resp = await this.http.post<any>(this.httpUrl + '/copyevents' , obj).toPromise().then(res => {
      return res;
    });
    if (!resp.error) {
      return resp.data;
    } else {
      return false;
    }
  }
}
