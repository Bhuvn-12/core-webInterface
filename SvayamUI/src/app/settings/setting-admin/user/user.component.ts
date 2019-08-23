import { Component,  OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {UserService} from '../../../services/settings/admin-settings/user/user.service';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService) { }

  data;
  roleArr;
  displayedColumns: string[]  = ['user_id',  'email',  'name',  'ent_cd', 'role_name', 'delete', 'modify'];
  dataSource ;
  entArr = [];
  inviterole;
  ent_cd;
  user_email = '';
  name;
  user;
  userArr = [];
  oldUser;
  newUser;

  userId;
  async ngOnInit() {
    const usrObj = JSON.parse(localStorage.getItem('usrDtls'));
    this.userId = usrObj.user_id;
    this.data = await this.userService.myuserdata(this.userId);
    if (this.data) {
      this.refreshTableData();
    }
  }
  async modifyUser(row) {
    this.oldUser = row;
    this.name = row.name;
    this.user_email = row.email;
    this.entArr = [];
    this.roleArr = [];
    this.roleArr = await this.userService.getrole();
    const map = new Map<String, String>();
    this.entArr = [];
    let m = 0;
    for (let i = 0; i < this.data.length; i++) {
        if (map.get(this.data[i].ent_cd) === '1') {
        } else {
        map.set(this.data[i].ent_cd, '1');
        const obj = new Object;
        obj['ent_cd'] = this.data[i].ent_cd;
        obj['ent_desc'] = this.data[i].ent_desc;
        this.entArr[m++] = obj;
        }
      }
    $('#modify').modal('show');
  }

async deleteUser(row , index) {
  const res = await this.userService.deleteUser(row);
  if (res['error'] === false) {
    this.data.splice(index , 1);
    this.refreshTableData();
  } else {
    console.log('delete failed');
  }
}
  async invite() {
    this.roleArr = await this.userService.getrole();
    const map = new Map<String, String>();
    this.entArr = [];
    for (let i = 0; i < this.data.length; i++) {
         const obj = new Object;
         obj['ent_cd'] = this.data[i].ent_cd;
         obj['ent_desc'] = this.data[i].ent_desc;
         if (map.get(this.data[i].ent_cd) !== '1') {
            map.set(this.data[i].ent_cd, '1');
            this.entArr[this.entArr.length] = obj;

         }
    }
    $('#invite').modal('show');
  }

  async adduser() {
    this.userArr = [];
    this.roleArr = [];
    this.roleArr = await this.userService.getrole();
    console.log(this.roleArr);
    this.entArr = [];
    const data1 = await this.userService.getuser(this.userId);
    console.log(data1);
    for (let i = 0; i < data1.length; i++) {
        const obj = new Object();
        obj['user_id'] = data1[i].user_id;
        obj['name'] = data1[i].name;
        this.userArr[this.userArr.length] = obj;
    }
    $('#addUser').modal('show');

  }

  roleSelect(event) {
    this.inviterole = event.value;
  }

  legalentityselect(event) {
    this.ent_cd = event.value;

  }
  leModify(event) {
    this.ent_cd = event.value;

  }

  userSelect(event) {
    this.user = event.value;
    console.log(this.user);
    let m = 0;
    const map = new Map<String, String>();
    this.entArr = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].user_id === this.user.user_id ) {
        map.set(this.data[i].ent_cd, '1');

      }
    }
    for (let i = 0; i < this.data.length; i++) {
        if (map.get(this.data[i].ent_cd) === '1') {


        } else {
        map.set(this.data[i].ent_cd, '1');
        const obj = new Object;
        obj['ent_cd'] = this.data[i].ent_cd;
        obj['ent_desc'] = this.data[i].ent_desc;
        this.entArr[m++] = obj;
        }
      }
  }


  async modify() {
    if (this.oldUser.role_name === 'Account Admin') {
      window.alert('You can not modify account admin');
    } else {
    if (window.confirm('Are you sure,  you want to  modify?')) {
      const obj  = new Object();
      obj['user_id'] = this.oldUser.user_id;
      obj['email']  = this.user_email;
      obj['role_name'] = this.inviterole.role_name;
      obj['role_id'] = this.inviterole.role_id;
      obj['ent_cd'] = this.ent_cd.ent_cd;
      obj['ent_desc'] = this.ent_cd.ent_desc;
     // obj['name'] = this.name;
      console.log(obj, this.oldUser);
      const res  = await this.userService.modifyUser(obj, this.oldUser);
      if (res['error'] === false) {
        $('#modify').modal('hide');
        this.data = await this.userService.myuserdata(this.userId);
        this.refreshTableData();
      }
    }
  }

  }

  async sentinvite() {
    if (this.inviterole === undefined || this.ent_cd === undefined || this.user_email === undefined) {
      window.alert('Your form is invalid');

    } else if (window.confirm('Are you sure,  you want to  send invitation?')) {
      const obj  = new Object();
      obj['user_id'] = this.userId;
      obj['email']  = this.user_email;
      obj['role_name'] = this.inviterole.role_name;
      obj['role_id'] = this.inviterole.role_id;
      obj['ent_cd'] = this.ent_cd;
      const res  = await this.userService.sentinvite(obj);
      if (res['error'] === false) {
        $('#invite').modal('hide');
      }
    }
  }


  async addUserdetail() {
    if (window.confirm('Are you sure,  you want to  Add user?')) {
      const obj1  = new Object();
      obj1['user_id'] = this.user.user_id;
      obj1['role_id'] = this.inviterole.role_id;
      obj1['ent_cd'] = this.ent_cd;
      const res  = await this.userService.adduser(obj1);
      if (res['error'] === false) {
        $('#addUser').modal('hide');
        this.data = await this.userService.myuserdata(this.userId);
        this.refreshTableData();
      }
    }

  }

  refreshTableData() {
    this.dataSource = new MatTableDataSource(this.data);

  }

}
