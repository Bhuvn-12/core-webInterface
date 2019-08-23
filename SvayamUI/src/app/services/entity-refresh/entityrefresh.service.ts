import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntityrefreshService {
  httpUrl;
  constructor(private http: HttpClient) {
    this.httpUrl = 'http://103.97.185.146:8075' + '/settings/configuration/Organisation';
  }
  async is_getAgain(email) {
    const resp = await this.http.get<any>(this.httpUrl + '/getafterorgsetupinfo' + email).toPromise().then(res => {
      console.log(res);
      return res;
    });
    if (!resp.error) {
      localStorage.setItem('usrDtls', JSON.stringify(resp.data.user_info));
      localStorage.setItem('entDtls', JSON.stringify(resp.data.ent_info));
      return true;
    } else {
      console.log('Error in login');
      return false;
    }
  }

  removeLocalStorage() {
    localStorage.removeItem('usrDtls');
    localStorage.removeItem('entDtls');
    localStorage.removeItem('resourceArr');
  }
}
