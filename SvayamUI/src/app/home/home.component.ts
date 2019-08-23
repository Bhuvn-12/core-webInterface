import { Component, OnInit } from '@angular/core';
import {HomeService} from '../services/home/home.service';
import {AppService} from '../app.service';
import {ReportsService} from '../services/reports/reports.service';
declare var $: any;
// import Chart from Chart.js;
import Chart from 'chart.js';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  announcemetArr = [];
  imageUrlArr = [];
  imgurl = './assets/img/announcement/';
  ent_cd;
  totalOfTrialbal = 0;
  totalOfIncomestmt = 0;
  totalOfAssets = 0;
  totalOfLiability = 0;
  totalOfEquity = 0;
  totalOfBalSheet = 0;
  totalOfIncome = 0;
  totalOfExpense = 0;
  data;
  showSpinner = true;
  systemDataObj ;
  systemDataArr;
  tutorialArr = [];
  today;

  constructor(private homeService: HomeService, private appService: AppService, private reportsService: ReportsService) { }
// tslint:disable-next-line: use-life-cycle-interface
  async ngOnInit () {
    this.today = this.reportsService.getTodayDate();
    this.data = this.homeService.tbalance;
    this.ent_cd = this.appService.ent_cd;
    this.announcemetArr = await this.homeService.getannouncements();
    if (this.announcemetArr) {
      for (let i = 0; i < this.announcemetArr.length; i++) {
        this.imageUrlArr[i] = this.imgurl + this.announcemetArr[i].image_path;
      }
    }
    this.systemDataObj = {};
    this.systemDataObj['arr'] = 0;
    this.systemDataObj['ip'] = 0;
    this.systemDataObj['sje'] = 0;
    this.systemDataObj['jsf'] = 0;
    this.getTbalance();
    this.getSystemState(this.ent_cd);
    this.getTutorials();
  }

  async getTutorials() {
    const resp = await this.homeService.getTutorils();
    if (resp) {
      this.tutorialArr = resp;

    }
  }
  async getSystemState(ent_cd) {
    const resp = await this.homeService.getSystemState(ent_cd);
    if (resp) {
      this.refactorSystemData(resp);
      this.sysInfochart();
    }
  }
  async getTbalance() {
    const Obj = new Object();
    Obj['ent_cd'] = this.ent_cd;
    Obj['acct_dt'] = this.today;
    const resp = await this.homeService.getTBalance(Obj);
    if (resp) {
      console.log(resp);
      this.refactorData(resp);
       this.tBalchart();

    }
  }
  refactorSystemData(data) {
    this.systemDataArr = data;
    this.systemDataObj = {};
    for (let i = 0; i < this.systemDataArr.length; i++) {
      if (this.systemDataArr[i].processes === 'Arrangement') {
        this.systemDataObj['arr'] = this.systemDataArr[i].counts;
      }
      if (this.systemDataArr[i].processes === 'Ip') {
        this.systemDataObj['ip'] = this.systemDataArr[i].counts;
      }
      if (this.systemDataArr[i].processes === 'Prepare') {
        this.systemDataObj['sje'] = this.systemDataArr[i].counts;
      }
      if (this.systemDataArr[i].processes === 'jsf') {
        this.systemDataObj['jsf'] = this.systemDataArr[i].counts;
      }

    }
  }

  refactorData(data) {
    this.totalOfTrialbal = 0;
    this.totalOfIncomestmt = 0;
    this.totalOfAssets = 0;
    this.totalOfLiability = 0;
    this.totalOfEquity = 0;
    this.totalOfBalSheet = 0;
    this.totalOfIncome = 0;
    this.totalOfExpense = 0;
    this.data = data;
    this.homeService.tbalance = this.data;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].lvl3_desc === 'ASSET') {
        this.totalOfAssets += this.data[i].balance;
        this.totalOfBalSheet += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'LIABILITY') {
        this.totalOfLiability += this.data[i].balance;
        this.totalOfBalSheet += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'EQUITY') {
        this.totalOfEquity += this.data[i].balance;
        this.totalOfBalSheet += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'INCOME') {
        this.totalOfIncome += this.data[i].balance;
        this.totalOfIncomestmt += this.data[i].balance;
      }
      if (this.data[i].lvl3_desc === 'EXPENSE') {
        this.totalOfExpense += this.data[i].balance;
        this.totalOfIncomestmt += this.data[i].balance;
      }
      this.totalOfTrialbal += this.data[i].balance;

    }
  }

  popUp(index) {
    if (index === 0) {
      $('#textA0').attr('data-content', this.announcemetArr[index].description );
      $('#textA0').popover('show');
    }
    if (index === 1) {
      $('#textA1').attr('data-content', this.announcemetArr[index].description);
      $('#textA1').popover('show');
    }
    if (index === 2) {
      $('#textA2').attr('data-content', this.announcemetArr[index].description);
      $('#textA2').popover('show');
    }
  }
  popUpTutorial(index) {
    if (index === 0) {
      $('#textT0').attr('data-content', this.tutorialArr[index].content);
      $('#textT0').popover('show');
    }
    if (index === 1) {
      $('#textT1').attr('data-content', this.tutorialArr[index].content);
      $('#textT1').popover('show');
    }
    if (index === 2) {
      $('#textT2').attr('data-content', this.tutorialArr[index].content);
      $('#textT2').popover('show');
    }
  }

  tBalchart() {
    const ctx = $('#trialBalChart')[0].getContext('2d');
    const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE'],
            datasets: [{
            backgroundColor: ['rgb(0, 255, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 255, 0)',
            'rgb(255, 0, 255)',
            'rgb(0, 255, 255)'],
            data: [this.totalOfAssets ,
                    this.totalOfLiability,
                    this.totalOfEquity,
                    this.totalOfIncome ,
                    this.totalOfExpense ]
        }],
    },

    // Configuration options go here
     options: {
    }
    });
  }
    sysInfochart() {
    const ctx = $('#sysInfoChart')[0].getContext('2d');
    const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ['INPUT SJE', 'SAL', 'IP', 'JSF KEYS'],
            datasets: [{
            backgroundColor: ['rgb(0, 255, 0)',
            'rgb(255, 0, 0)',
            'rgb(255, 255, 0)',
            'rgb(255, 0, 255)'],
            data: [
              this.systemDataObj['sje'],
              this.systemDataObj['arr'],
              this.systemDataObj['ip'],
              this.systemDataObj['jsf'],
             ]
        }],
    },

    // Configuration options go here
     options: {
    }
    });
  }

}
