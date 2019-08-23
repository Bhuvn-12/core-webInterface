import { Injectable } from '@angular/core';
import { HttpClient,  HttpErrorResponse,  HttpHeaders,  HttpParams } from '@angular/common/http';
import {AppService} from '../../../../app.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  httpUrl  ;

  constructor(private http: HttpClient, private appService: AppService) {
    this.httpUrl = this.appService.httpUrl + '/settings/admin/user';
   }


  async deleteUser(row) {
    const resp  = await this.http.post<any>(this.httpUrl  +  '/deleteLeRefrence', row).toPromise()
    .then(res => {
      return res;
    });
    if ( !resp.error) {
      return resp;
    }

  }
  async modifyUser(newuser, olduser) {
    const obj  = new Object;
    obj['old_row']  = olduser;
    obj['new_row']  = newuser;
    const resp  = await this.http.post<any>(this.httpUrl  +  '/modifyUser', obj).toPromise().then(res => {
      return res;
    });
    if ( !resp.error) {
      return resp;
    }

  }

  async getuser(myobj) {

    const resp  = await this.http.get<any>(this.httpUrl + '/getUsers' + myobj).toPromise().then(res => {
      return res;
    });
    if ( !resp.error) {
      return resp['data'];
    } else {
      return false;
    }
  }
  async myuserdata(myobj) {

    const resp  = await this.http.get<any>(this.httpUrl + '/getAllUsersInfo' + myobj).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if ( !resp.error) {
      return resp['data'];
    } else {
      return false;
    }
  }

  async sentinvite(myobj2) {

    const resp  = await this.http.post<any>(this.httpUrl + '/Inviteuser', myobj2).toPromise().then(res   => {
      return res;
    });
    if ( !resp.error) {
      return resp;
    }

  }

  async getrole() {
    const resp   =  await this.http.get<any>(this.httpUrl + '/getRoles').toPromise().then(res   => {
      return res;
    });
    if ( !resp.error) {
      return resp['data'];
    }

  }



  async adduser(newuser) {
    const resp = await this.http.post<any>(this.httpUrl + '/addLegalEntityAndRoleForUser', newuser).toPromise()
    .then(res   => {
      return res;
    });
    if ( !resp.error) {
      return resp;
    }

  }
}
