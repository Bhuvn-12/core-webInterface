import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AppService} from '../../app.service';
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  httpUrl;
  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/signup';
   }

  async signupFunc(data) {
    const resp = await this.http.post<any>(this.httpUrl , data).toPromise().then(res => {
      console.log(res);
      return res;
    }, error => {
      return false;
    });
    if (resp['error'] === false) {
      return true;
    } else {
      return false;
    }

  }
}
