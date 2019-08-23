import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';
import { ManualService } from '../../services/sources/manual/manual.service';
import { AppService } from '../../app.service';
import {OperationsService} from '../../services/operations/operations.service';
import {MatSnackBar} from '@angular/material/snack-bar';
declare var $: any;

@Component({
  selector: 'app-manual',
  templateUrl: './manual.component.html',
  styleUrls: ['./manual.component.css']
})
export class ManualComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['select', 'name', 'arr_num', 'arr_suf', 'arr_src_cd', 'prod_cd', 'dtl_prod_cd'];
  constructor(private _snackBar: MatSnackBar, private opsService: OperationsService,
    private router: Router, private manualService: ManualService,
    private appService: AppService, private formBuilder: FormBuilder) {
    this.httpUrl = this.manualService.httpUrl;
  }

  httpUrl;
  data;
  manualInfo;
  ent_cd;
  prodArray = [];
  eventArray = [];
  country_arr = [];
  partyDtl_arr = [];
  custArr = [];
  country_name;
  country_cd;
  prodEvent = new Map();
  sprodObj;
  seventObj;
  showArr = false;
  showSje = false;
  searchForm: FormGroup;
  sjeForm: FormGroup;
  arrForm: FormGroup;
  dataSource;
  sjeDtl = {};
  submitted = false;
  selectedRow;
  arrDtl = {};
  ip_cust_type_cd;
  ip_dtl_cust_type_cd;
  uploader;
  ppd;

  async ngOnInit() {

    const resPpd = await this.opsService.getPpd();
    if (resPpd['error'] === false) {
      const data = resPpd.data;
      this.ppd = data[data.length - 1].ppd;
    }
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'eventfile' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.ent_cd = this.appService.ent_cd;
    this.searchForm = this.formBuilder.group({
      name: [''],
      product: [''],
      arr_num: [''],
      cust_type: ['']
    });
    this.sjeForm = this.formBuilder.group({
      arr_num: ['', [Validators.required]],
      arr_suf: ['', Validators.required],
      amt: ['', Validators.required],
      arr_src_cd: ['', Validators.required],
      tgt_curr_cd: ['', Validators.required],
      dtl_cust_industry_cd: ['', Validators.required],
    });
    this.arrForm = this.formBuilder.group({
      ip_name: ['', [Validators.required]],
      ip_country: ['', Validators.required],
      ip_city_name: ['', Validators.required],
      zip_cd: ['', Validators.required],
      ip_dtl_cust_type_cd: ['', Validators.required],
      occupation: ['', Validators.required],
    });
    this.manualInfo = await this.manualService.getManualDetails(this.ent_cd);
    // console.log(this.ent_cd);
    if (this.manualInfo) {
      this.data = this.manualInfo;
    }
    this.country_arr = await this.manualService.getCountry();
    if ( this.country_arr ) {
      // console.log(this.country_arr);
      this.partyDtl_arr = await this.manualService.getPartyDtlType(this.ent_cd);
      if (this.partyDtl_arr) {
        // console.log(this.partyDtl_arr);
      }
    }

  }


  async manual(object) {
    const resp = await this.manualService.getproductsandevents(object.ss_id);
    if (resp) {
      for (let i = 0; i < resp.length; i++) {
        this.prodArray[i] = resp[i].product;
        this.prodEvent[resp[i].product.dtl_prod_cd] = resp[i].events;
      }
      $('#modelId').modal('show');
    }

  }
  selectedProduct(event) {
    this.sprodObj = event.value;
    this.eventArray = this.prodEvent[event.value.dtl_prod_cd];
  }
  selectedevent(event) {
    this.seventObj = event.value;
    if (this.seventObj.screen_to_project === 'arr') {
      this.showArr = false;
      this.showSje = true;
    } else {
      this.showSje = false;
      this.showArr = true;
    }
  }

  async search() {
    const searchObj = {
      name: this.searchForm.get('name').value, product: this.searchForm.get('product').value,
      arr_num: this.searchForm.get('arr_num').value, cust_type: this.searchForm.get('cust_type').value, org_unit_cd: this.ent_cd
    };

    const resp = await this.manualService.search(searchObj);
    if (resp) {
      const mydata = resp;
      console.log(mydata);
      this.dataSource = new MatTableDataSource(mydata);
      this.dataSource.paginator = this.paginator;
      $('#TableModal').modal('show');
    }
  }

    // select country and set country code
    selectCountry(event) {
      this.country_name = event.value.country_name;
      this.country_cd = event.value.country_cd; // Bindup Data Code
    }

    // select detail customer type
    selectDtlType(event) {
      this.ip_cust_type_cd = event.value.customer_type_cd;
      this.ip_dtl_cust_type_cd = event.value.dtl_customer_type_cd;
    }


  async validateSje() {
    const date = this.formatDate();
    console.log(date);
    this.submitted = true;
    if (this.sjeForm.invalid) {
      return;
    } else {
      const arr_num = this.sjeForm.get('arr_num').value;
      this.sjeDtl['src_trace_key'] = 'SVYAM';
      this.sjeDtl['arr_num'] = arr_num.toString();
      this.sjeDtl['arr_suf'] = this.sjeForm.get('arr_suf').value;
      this.sjeDtl['amount'] = this.sjeForm.get('amt').value;
      this.sjeDtl['cust_industry_cd'] = this.sjeForm.get('dtl_cust_industry_cd').value['customer_type_cd'];
      this.sjeDtl['dtl_cust_industry_cd'] = this.sjeForm.get('dtl_cust_industry_cd').value['dtl_customer_type_cd'];
      this.sjeDtl['arr_src_cd'] = this.sjeForm.get('arr_src_cd').value;
      this.sjeDtl['tgt_curr_cd'] = this.sjeForm.get('tgt_curr_cd').value['currency'];
      this.sjeDtl['event_name'] = this.seventObj.ev_name;
      this.sjeDtl['org_unit_cd'] = this.ent_cd;
      this.sjeDtl['prod_cd'] = this.sprodObj.prod_cd;
      this.sjeDtl['dtl_prod_cd'] = this.sprodObj.dtl_prod_cd;
      this.sjeDtl['date'] = this.ppd;  // date ;
      this.sjeDtl['is_automated'] = 'false';
      console.log(this.sjeDtl);
      const resp = await this.manualService.postEvents(this.sjeDtl);
      if (resp) {
        this._snackBar.open(resp.data, 'close', {
          duration: 2000,
        });
      } else {
        this._snackBar.open(resp.data, 'close', {
          duration: 2000,
        });
      }
    }
  }

  validateArr() {
    this.submitted = true;
    if (this.arrForm.invalid) {
      return;
    } else {
      // var date = this.formatDate();

      this.arrDtl['name'] = this.arrForm.get('ip_name').value;
      this.arrDtl['country'] = this.country_name;
      this.arrDtl['residence_country_cd'] = this.country_cd; // Bindup Data Code
      this.arrDtl['city'] = this.arrForm.get('ip_city_name').value;
      this.arrDtl['zip'] = this.arrForm.get('zip_cd').value;
      this.arrDtl['cust_industry_cd'] = this.ip_cust_type_cd;
      this.arrDtl['dtl_cust_industry_cd'] = this.ip_dtl_cust_type_cd;
      this.arrDtl['occupation'] = this.arrForm.get('occupation').value;
      this.arrDtl['org_unit_cd'] = this.ent_cd;
      this.arrDtl['prod_cd'] = this.sprodObj.prod_cd;
      this.arrDtl['dtl_prod_cd'] = this.sprodObj.dtl_prod_cd;
      this.arrDtl['event_name'] = this.seventObj.ev_name;
      this.arrDtl['date'] = this.ppd;  // this.srcService.proList.ppd;
      this.arrDtl['starting_amount'] = '0.0';
      this.arrDtl['is_automated'] = 'false';
      console.log(this.arrDtl);
      const resp = this.manualService.postEvents(this.arrDtl);
      if (resp) {
        this._snackBar.open('Data Submitted Successful', 'close', {
          duration: 2000,
        });
      }

    }
  }
  selectedButton(row) {
    this.selectedRow = row;
    console.log(this.selectedRow);
    if (this.seventObj.screen_to_project === 'arr') {
      this.setSjeform();
    } else {
      this.setArrform();
    }
  }

  setArrform() {
    this.arrForm.setValue({
      ip_name: this.selectedRow.name,
      ip_country: this.selectedRow.country,
      ip_city_name: this.selectedRow.city,
      zip_cd: this.selectedRow.zip,
      ip_dtl_cust_type_cd: this.sprodObj.dtl_prod_cd,
      occupation: this.selectedRow.occupation
    });
    $('#TableModal').modal('hide');
  }

  setSjeform() {
    this.sjeForm.setValue({
      arr_num: this.selectedRow.arr_num,
      arr_suf: this.selectedRow.arr_suf,
      amt: this.selectedRow.starting_amount,
      arr_src_cd: this.selectedRow.arr_src_cd,
      tgt_curr_cd: this.sjeForm.get('tgt_curr_cd').value,
      dtl_cust_industry_cd: this.sjeForm.get('dtl_cust_industry_cd').value,
    });
    $('#TableModal').modal('hide');

  }

  // date formating function
  formatDate() {
// tslint:disable-next-line: prefer-const
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
// tslint:disable-next-line: prefer-const
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');

  }

  async uploadfile() {
    const obj = new Object();
    obj['ent_cd'] = this.ent_cd;
    console.log(this.uploader);
    obj['file_name'] = this.uploader.queue[0].some.name;
    const params = JSON.stringify(obj);
    this.uploader.queue[0].url = this.httpUrl + '/uploadeventfile' + params;
    this.uploader.queue[0].upload();
    this.uploader.onCompleteItem = async (item: any, response: any, status: any, headers: any) => {
      console.log(response);
      if (!response.error) {
       console.log('uploded');
       $('#UploadModal').modal('hide');
      }
    };
  }
  openUpload() {
    $('#UploadModal').modal('show');
  }

  onclick(event) {
    event.target.value = null;
    this.uploader = new FileUploader({ url: this.httpUrl, itemAlias: 'eventfile' });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
  }
  async demoStart(obj, index) {
    // console.log(index);
    const resp = await this.manualService.demoStart(obj);
    if (resp) {
      this.data[index]['is_running'] = 1;
    }
  }

  async demoStop(obj, index) {
    // console.log(index);
    const resp = await this.manualService.demoStop(obj);
    if (resp) {
      this.data[index]['is_running'] = 0;
    }
  }

}
