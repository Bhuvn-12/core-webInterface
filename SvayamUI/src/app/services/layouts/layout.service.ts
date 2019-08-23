import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {AppService} from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  httpUrl;
  imgURL;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl;
   }
  async getUserImage(user_id) {
    const obj = new Object();
    obj['user_id'] = user_id;
    const resp = await this.http.post(this.httpUrl + '/profile/getprofileimage', obj, { responseType: 'blob' }).toPromise().then(res => {
      return res;
    });
    if (resp) {
      return resp;
    }
  }
}
