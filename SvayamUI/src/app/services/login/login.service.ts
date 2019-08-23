import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  httpUrl;
  constructor(private http: HttpClient, private appService: AppService, private router: Router) {
    this.httpUrl = this.appService.httpUrl + '/login';
  }
  private redirectUrl = '/';
  private loginUrl = '/login';
  loggedInUser;
  usrObj;

  async is_authanticated(obj) {
    this.removeLocalStorage();
    const resp = await this.http.get<any>(this.httpUrl + '/getafterlogininfo' + JSON.stringify(obj)).toPromise().then(res => {
      // localStorage.setItem('usrtemp', JSON.stringify(res));
      console.log(res);
      return res;
    });
    if (!resp.error) {
      localStorage.setItem('usrDtls', JSON.stringify(resp.data.user_info));
      localStorage.setItem('entDtls', JSON.stringify(resp.data.ent_info));
      this.appService.ent_cd = resp.data.ent_info[0].ent_cd;
      return true;
    } else {
      console.log('Error in login');
      return false;
    }
  }


  logout() {
    // remove user from local storage to log user out
    this.removeLocalStorage();
    this.router.navigate(['/login']);
  }
  getRedirectUrl(): string {
    return this.redirectUrl;
  }
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  getLoginUrl(): string {
    return this.loginUrl;
  }

  removeLocalStorage() {
    localStorage.removeItem('usrDtls');
    localStorage.removeItem('entDtls');
    localStorage.removeItem('resourceArr');
  }

  async resetPassword(email) {
    const resp = await this.http.post<any>(this.httpUrl + '/sendUserPassword', email).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      return resp;
    } else {
      return false;
    }
  }

}
