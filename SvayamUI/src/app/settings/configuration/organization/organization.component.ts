import { Component, OnInit } from '@angular/core';
import { LegalEntityService } from '../../../services/settings/configuration/organization/legal-entity.service';
import { MatTableDataSource } from '@angular/material';
import {AppService} from '../../../app.service';
import {NgxSpinnerService} from 'ngx-spinner';

declare var $: any;


@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})

export class OrganizationComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private legal_entityService: LegalEntityService , private appService: AppService) { }
  displayedColumns: string[] = ['ent_desc', 'base_currency', 'presentation_currency', 'delete',
'advance'];
  tabledata;
  dataSource;
  user_id ;
  data1;
  element = [];
  countryArr = [];
  countrydata;
  industry;
  country;
  legalentity_name;
  legalentity_cd;
  currencyArr = [];
  costcenterArr = [];
  currencydata;
  costcenterdata;
  advlegalentity_name;
  costcenter;
  currency1 = [];
  editedrow;
  tabledata1;

  async ngOnInit() {
    const usrObj = JSON.parse(localStorage.getItem('usrDtls'));
    this.user_id = usrObj.user_id;
    this.tabledata = await this.legal_entityService.mylegalentityy(this.user_id);
    this.dataSource = new MatTableDataSource(this.tabledata);
    if (this.tabledata) {
      this.refreshTableDataSource();
    }
  }

  async Add() {
    this.data1 = await this.legal_entityService.myindustry();
    if (this.data1) {
      this.element = this.data1;
      this.countrydata = await this.legal_entityService.mycountry();
      if (this.countrydata) {
        this.countryArr = this.countrydata;
        $('#addorg').modal('show');
      }
    }
  }

  async AdvanceSetup(row) {
    this.editedrow = row;
    this.advlegalentity_name = row.ent_desc;
    this.countrydata = await this.legal_entityService.mycountry();
    if (this.countrydata) {
      this.countryArr = this.countrydata;
    }
    this.currencydata = await this.legal_entityService.mycurrency();
    if (this.currencydata) {
      this.currencyArr = this.currencydata;
    }
    $('#advance').modal('show');
    // this.costcenterdata = await this.legal_entityService.mycostcenter();
    // if (this.costcenterdata) {
    //   this.costcenterArr = this.costcenterdata;
    // }


  }


  selectindustry(event) {
    this.industry = event.value;
  }

  selectcountry(event) {
    this.country = event.value;
  }

  selectcost(event) {
    this.costcenter = event.value;
  }
  selectcurrency(event) {
    this.currency1 = event.value;
  }


  async savedetail() {
    this.spinner.show();

    const obj = new Object;
    obj['user_id'] = this.user_id;
    obj['ent_desc'] = this.legalentity_name;
    obj['ind_id'] = this.industry.ind_id;
    obj['ind_name'] = this.industry.ind_name;
    obj['country_name'] = this.country.country_name;
    obj['ent_cd'] = this.legalentity_cd;
    obj['country_id'] = this.country.id;
    const res = await this.legal_entityService.sendorganization(obj);
    if (res['error'] === false) {
      $('#addorg').modal('hide');
      this.appService.invokeHeader();
      this.tabledata = [];
      this.tabledata = await this.legal_entityService.mylegalentityy(this.user_id);
      if (this.tabledata) {
        this.dataSource = new MatTableDataSource(this.tabledata);
        this.spinner.hide();


        console.log(this.tabledata);
      }
    } else {
      this.spinner.hide();

    }
  }

  async saveAdvanceDetail() {
    this.spinner.show();
    const obj = new Object;
    let pre_curr = '';
    for (let i = 0; i < this.currency1.length; i++) {
    if (i === 0) {
      pre_curr = this.currency1[i].currency;
    } else {
    pre_curr = pre_curr + ',' + this.currency1[i].currency;
    }
    }
    obj['user_id'] = this.user_id;
    obj['ent_cd'] = this.editedrow.ent_cd;
    obj['ent_desc'] = this.advlegalentity_name;
    obj['currency'] = pre_curr;
    // obj['cost_center_cd'] = this.costcenter[0].cost_center_cd;
    // obj['cost_center_desc'] = this.costcenter[0].cost_center_desc;
      console.log(obj);
      const res = await this.legal_entityService.saveAllAdvanceDetail(obj);
      if (res['error'] === false) {
        this.spinner.hide();
        $('#advance').modal('hide');
        this.appService.invokeHeader();
        this.tabledata = [];
        this.tabledata = await this.legal_entityService.mylegalentityy(this.user_id);
        if (this.tabledata) {
          this.dataSource = new MatTableDataSource(this.tabledata);
          console.log(this.tabledata);
        }
      } else {
        this.spinner.hide();
      }
    }

    async deleteUser(index) {
    console.log(this.tabledata[index]);
    const res = await this.legal_entityService.deleteLegalEntity(this.tabledata[index].ent_cd);
    if (res === false) {
    this.tabledata.splice(index, 1);
    this.refreshTableDataSource();
    }
    }

  refreshTableDataSource() {
    this.dataSource = new MatTableDataSource(this.tabledata);
  }
  reloadPage() {
    // location.reload();
  }


}
