import { Component, OnInit } from '@angular/core';
import {AdminService} from '../../services/sources/admin/admin.service';
import { MatTableDataSource } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private adminService: AdminService, private appService: AppService, private router: Router, private _snackBar: MatSnackBar) {
    this.httpUrl = this.adminService.httpUrl;
  }

  displayedColumns: string[] = ['ss_name', 'delete', 'modify'];
  tabledata;
  entityid;
  loginUsr;
  dataSource;
  ent_cd ;
  rulesArr = [];
  data1;
  curr_file;
  selected_file;
  tempselected = [];
  fileUrl;
  selectedFiles;
  currentFileUpload;
  progress;
  uploader;
  optionList;
  uploadObj;
  httpUrl;
  URL = this.httpUrl;



  async ngOnInit() {
    this.ent_cd = this.appService.ent_cd;
    console.log(this.ent_cd);
    this.tabledata = await this.adminService.mysourcesystem(this.ent_cd);
    console.log(this.tabledata);
    if (this.tabledata) {
     this.refreshTableDataSource();
    }
    this.data1 = await this.adminService.getRuleFiles(this.ent_cd);
    console.log(this.data1);
    for (let i = 0; i < this.data1.length; i++) {
      const obj = new Object;
      if (this.data1[i].status === 'ACTIVE') {
        this.curr_file = this.data1[i].file_name;
      }
      obj['file_name'] = this.data1[i].file_name;
      obj['file_status'] = this.data1[i].status;
      this.rulesArr[this.rulesArr.length] = obj;

    }

    this.uploader = new FileUploader({ url: this.URL, itemAlias: 'rulefile' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
    };


  }

  async makecur() {
    const obj = new Object;
    obj['ent_cd'] = this.ent_cd;
    obj['file_name'] = this.selected_file;
     if (this.curr_file === this.selected_file) {
      this._snackBar.open('File is already active ', 'close', {
        duration: 2000});
    } else {
      const res = await this.adminService.makeCurFile(obj);
      if (res.error === false) {
        this._snackBar.open(res.data, 'close', {
          duration: 2000});
        this.curr_file = this.selected_file;

      } else {
        this._snackBar.open(res.data, 'close', {
          duration: 2000});
      }
    }


  }


  async download() {
    const obj = new Object();
    obj['ent_cd'] = this.ent_cd;
    obj['file_name'] = this.selected_file;
    console.log('Entered');
    const res = await this.adminService.downloadFile(obj);
    console.log('Entered');
    const a = document.createElement('a');
    document.body.appendChild(a);
    this.fileUrl = window.URL.createObjectURL(res);

    a.href = this.fileUrl;

    a.download = this.selected_file;

    a.click();

    window.URL.revokeObjectURL(this.fileUrl);

  }


  ruleselect(event) {
    this.selected_file = event.value;
    console.log(this.selected_file);

  }

  async deleteSource(Obj, index) {
    console.log(Obj);
    const resp = await this.adminService.deleteSource(Obj.ss_id);
    if  (resp) {
      this.tabledata.splice(index, 1);
      this.refreshTableDataSource();
      this._snackBar.open(resp.data, 'close', {
        duration: 2000});
    } else {
      this._snackBar.open(resp.data, 'close', {
        duration: 2000});
    }
  }

  refreshTableDataSource() {
    this.dataSource = new MatTableDataSource(this.tabledata);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  async upload() {

    console.log(this.uploader);
    const obj = new Object;
    obj['ent_cd'] = this.ent_cd;
    obj['file_name'] = this.uploader.queue[0].some.name;
    console.log(obj);
    const params = JSON.stringify(obj);
    this.uploader.queue[0].url = this.httpUrl + '/uploadrulefile' + params;
    this.uploader.queue[0].upload(function() {
      this._snackBar.open('File Uploaded', 'close', {
        duration: 2000});
    });


  }

  routermodifySource(obj) {
    this.adminService.editsrcObj = obj;
    this.router.navigate(['/source/modifysrc']);
  }
  routerAddSource() {
    this.router.navigate(['/source/addsrc']);
  }

}
