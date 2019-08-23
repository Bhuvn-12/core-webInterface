import { Component, OnInit } from '@angular/core';
import { InstumentService } from '../../services/adjustments/instument-le/instument.service';
import { AppService } from '../../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-instrument-le',
  templateUrl: './instrument-le.component.html',
  styleUrls: ['./instrument-le.component.css']
})
export class InstrumentLEComponent implements OnInit {
  MJPForm: FormGroup;
  constructor(private mjpservice: InstumentService, private fb: FormBuilder, private appService: AppService) {
    this.MJPForm = this.fb.group({
      arr_src_cd: ['', Validators.required],
      customer_type_desc: ['', Validators.required],
      arr_num: ['', Validators.required],
      dtl_prod_desc: ['', Validators.required],
      arr_suf: ['', Validators.required],
      dtl_customer_type_cd: ['', Validators.required],
      prod_cd: ['', Validators.required],
      alt_org_unit_cd: ['', Validators.required],
      partner_org_unit_cd: ['', Validators.required],
      file_cd: ['', Validators.required],
      account_number: ['', Validators.required],
      file_subldgr_cd: ['', Validators.required],
      lcl_acct_num: ['', Validators.required],
      ldgr_src_cd: ['', Validators.required],
      jrnl_entry_cd: ['', Validators.required],
      txn_amt: ['', Validators.required],
      jrnl_id: ['', Validators.required],
      tgt_curr_cd: ['', Validators.required],
      ldgr_recon_id: ['', Validators.required],
      jrnl_line_id: ['', Validators.required],
      acct_dt: ['', Validators.required],
      src_trace_key: ['', Validators.required],
      jrnl_parent_type_cd: ['', Validators.required],
      db_cr_ind: ['', Validators.required],
      jrnl_ext_id: ['', Validators.required],
      jrnl_parent_key: ['', Validators.required],
      jrnl_dtl_id: ['', Validators.required],
    });

  }
  account_data;
  AccNumArr = [];
  currencyArr = [];
  productArr = [];


  customerArr = [];
  recordArr = [];
  data_array = [];
  displayedColumns: string[] = ['arr_src_cd', 'arr_num', 'arr_suf', 'txn_amt', 'dtl_prod_desc', 'acct_dt', 'action'];
  datasource;
  ent_cd;

  async ngOnInit() {
    this.ent_cd = this.appService.ent_cd;
    this.account_data = await this.mjpservice.getdetails(this.ent_cd);
    console.log(this.account_data);
    if (this.account_data) {
      this.AccNumArr = this.account_data.acct_info;
      this.currencyArr = this.account_data.currency;
      this.productArr = this.account_data.prod_info;
      console.log(this.AccNumArr);
      this.customerArr = this.account_data.cust_info;
    }
  }

  selectchange(obj) {
    console.log(obj);
  }


  Add() {
    if (this.MJPForm.invalid) {
      return;
    }
    const obj = new Object();
    obj['arr_src_cd'] = this.MJPForm.get('arr_src_cd').value;
    obj['customer_type_desc'] = this.MJPForm.get('customer_type_desc').value;
    obj['arr_num'] = this.MJPForm.get('arr_num').value;
    obj['dtl_prod_desc'] = this.MJPForm.get('dtl_prod_desc').value;
    obj['arr_suf'] = this.MJPForm.get('arr_suf').value;
    obj['dtl_customer_type_cd'] = this.MJPForm.get('dtl_customer_type_cd').value;
    obj['prod_cd'] = this.MJPForm.get('prod_cd').value;
    obj['alt_org_unit_cd'] = this.MJPForm.get('alt_org_unit_cd').value;
    obj['partner_org_unit_cd'] = this.MJPForm.get('partner_org_unit_cd').value;
    obj['file_cd'] = this.MJPForm.get('file_cd').value;
    obj['account_number'] = this.MJPForm.get('account_number').value;
    obj['file_subldgr_cd'] = this.MJPForm.get('file_subldgr_cd').value;
    obj['lcl_acct_num'] = this.MJPForm.get('lcl_acct_num').value;
    obj['ldgr_src_cd'] = this.MJPForm.get('ldgr_src_cd').value;
    obj['jrnl_entry_cd'] = this.MJPForm.get('jrnl_entry_cd').value;
    obj['txn_amt'] = this.MJPForm.get('txn_amt').value;
    obj['jrnl_id'] = this.MJPForm.get('jrnl_id').value;
    obj['tgt_curr_cd'] = this.MJPForm.get('tgt_curr_cd').value;
    obj['ldgr_recon_id'] = this.MJPForm.get('ldgr_recon_id').value;
    obj['acct_dt'] = this.MJPForm.get('acct_dt').value;
    obj['jrnl_line_id'] = this.MJPForm.get('jrnl_line_id').value;
    obj['jrnl_parent_type_cd'] = this.MJPForm.get('jrnl_parent_type_cd').value;
    obj['db_cr_ind'] = this.MJPForm.get('db_cr_ind').value;
    obj['jrnl_ext_id'] = this.MJPForm.get('jrnl_ext_id').value;
    obj['jrnl_parent_key'] = this.MJPForm.get('jrnl_parent_key').value;
    obj['jrnl_dtl_id'] = this.MJPForm.get('jrnl_dtl_id').value;
    obj['src_trace_key'] = this.MJPForm.get('src_trace_key').value;

    this.data_array.push(obj);
    console.log(this.data_array[0]);
    this.datasource = new MatTableDataSource(this.data_array);
    console.log(this.datasource);
  }

  delete(data, index) {
    this.data_array.splice(index, 1);
    this.refreshTable();
  }

  refreshTable() {
    this.datasource = this.data_array;
  }

  modify(data, index) {
    console.log(data);
    this.MJPForm.setValue({
      arr_src_cd: data.arr_src_cd,
      arr_num: data.arr_num,
      arr_suf: data.arr_suf,
      dtl_prod_desc: data.dtl_prod_desc,
      dtl_customer_type_cd: data.dtl_customer_type_cd,
      prod_cd: data.prod_cd,
      alt_org_unit_cd: data.alt_org_unit_cd,
      partner_org_unit_cd: data.partner_org_unit_cd,
      file_cd: data.file_cd,
      account_number: data.account_number,
      file_subldgr_cd: data.file_subldgr_cd,
      lcl_acct_num: data.lcl_acct_num,
      ldgr_src_cd: data.ldgr_src_cd,
      jrnl_entry_cd: data.jrnl_entry_cd,
      txn_amt: data.txn_amt,
      jrnl_id: data.jrnl_id,
      tgt_curr_cd: data.tgt_curr_cd,
      acct_dt: data.acct_dt,
      jrnl_line_id: data.jrnl_line_id,
      jrnl_parent_type_cd: data.jrnl_parent_type_cd,
      db_cr_ind: data.db_cr_ind,
      jrnl_ext_id: data.jrnl_ext_id,
      jrnl_parent_key: data.jrnl_parent_key,
      jrnl_dtl_id: data.jrnl_dtl_id,
      customer_type_desc: data.customer_type_desc,
      ldgr_recon_id: data.ldgr_recon_id,
      src_trace_key: data.src_trace_key
    });
    this.data_array.splice(index, 1);
    this.refreshTable();

  }
  Submit() {
    for (let i = 0; i < this.data_array.length; i++) {
      this.data_array[i]['org_unit_cd'] = 'From service';
      this.data_array[i]['jrnl_type_cd'] = 'FIN';
      this.data_array[i]['tech_comp_cd'] = 'ARE';
      this.data_array[i]['arr_ind'] = 'Y';
      this.data_array[i]['adj_cd'] = 'N';
      this.data_array[i]['int_file_cd'] = 'RA';
      this.data_array[i]['cust_grouping_cd'] = 'any';
      this.data_array[i]['book_cd'] = 'IFRS';
      this.data_array[i]['ldgr_type_cd'] = 'Actual';
      this.data_array[i]['txn_chnl_cd'] = '100230';
      this.data_array[i]['ref_org_unit_cd'] = '';
      this.data_array[i]['ref_acct_num'] = this.data_array[i].account_number.account_number;
      this.data_array[i]['prod_event_cd'] = 'ADD';
      this.data_array[i]['src_curr_cd'] = this.data_array[i].tgt_curr_cd;
      this.data_array[i]['src_curr_type_cd'] = 'TX';
      this.data_array[i]['tgt_curr_type_cd'] = 'TX';
      this.data_array[i]['fiscal_year'] = 'Year';
      this.data_array[i]['fiscal_month'] = 'Month';
      this.data_array[i]['fiscal_period'] = 'Period';
      this.data_array[i]['orig_acct_dt'] = '';
      this.data_array[i]['ppd'] = 'Curr Ppd';
      this.data_array[i]['wod'] = 'Curr Ppd';
      this.data_array[i]['txn_amt_type_cd'] = 'MVT';
      this.data_array[i]['txn_conv_rate'] = '';
      this.data_array[i]['txn_conv_ind'] = '';
      this.data_array[i]['jrnl_ln_desc'] = 'Manual Journal';
      this.data_array[i]['match_ref_num'] = 'A';
      this.data_array[i]['bus_func_cd'] = 'ACC';
      this.data_array[i]['acct_num'] = this.data_array[i].account_number.account_number;
      this.data_array[i]['dtl_cust_industry_cd'] = this.data_array[i].dtl_customer_type_cd.dtl_customer_type_cd;
      this.data_array[i]['cust_industry_cd'] = this.data_array[i].customer_type_desc.dtl_customer_type_cd;
      this.data_array[i]['dtl_prod_cd'] = this.data_array[i].dtl_prod_desc.dtl_prod_cd;
      this.data_array[i]['cust_industry_cd'] = this.data_array[i].customer_type_desc.dtl_customer_type_cd;
      this.data_array[i]['prod_cd'] = this.data_array[i].prod_cd.prod_cd;
    }
    // tslint:disable-next-line: prefer-const
    let total = 0;
    // tslint:disable-next-line: no-shadowed-variable
    for (let i = 0; i < this.data_array.length; i++) {
      console.log(this.data_array[i]['txn_amt']);
    }
    if (total === 0) {
      this.mjpservice.postData(this.data_array);
    }
  }
}
