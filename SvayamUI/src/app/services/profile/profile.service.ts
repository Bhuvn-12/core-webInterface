import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {AppService} from '../../app.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  httpUrl;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/profile';
  }

  async getUserDetails(id) {
    const waitres = await this.http.get<any>(this.httpUrl + '/getprofileinfo' + id).toPromise().then(res => {
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

  async changepassword(data) {
    const resp = await this.http.put<any>(this.httpUrl + '/changepassword', data).toPromise().then(res => {
      return res;
    }, error => {
      return 0;
    });
    // console.log(resp);
    if (resp['error'] === false) {
      return true;
    } else {
      return false;
    }

  }
  async updateprofile(data) {
    const resp = await this.http.post<any>(this.httpUrl + '/updateprofile', data).toPromise().then(res => {
      return res;
    }, error => {
      return 0;
    });
    // console.log(resp);
    if (resp['error'] === false) {
      return true;
    } else {
      return false;
    }

  }
  /*   async uploadimage(formdata){
      const resp = await this.http.post<any>(this.httpUrl+'/updateprofile',formdata,{
  reportProgress:true,
  observe:'events'
      } )
      .subscribe(events => {
        if(events.type == HttpEventType.UploadProgress) {
            console.log('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
        } else if(events.type === HttpEventType.Response) {
            console.log(events);
        }
      })
      .toPromise().then(res => {
        return res;
      }, error => {
        return 0;
      });
      console.log(resp);
      if (resp['error']==false) {
        return true;
      } else {
        return false;
      }
    } */

  async getImage(user_id) {
    const obj = new Object();
    obj['user_id'] = user_id;
    const resp = await this.http.post(this.httpUrl + '/getprofileimage', obj, { responseType: 'blob' }).toPromise().then(res => {
      console.log('calling');
      console.log(res);
      return res;
    });
    if (resp) {
      return resp;
    }
  }
}
